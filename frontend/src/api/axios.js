import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1/",
    headers: {
        "Content-Type": "application/json",
    },
});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refresh");
            const accessToken = localStorage.getItem("access");

            // Если нет ни access, ни refresh токена - пользователь не авторизован
            // Просто возвращаем ошибку без редиректа
            if (!accessToken && !refreshToken) {
                return Promise.reject(error);
            }

            // Если есть refresh токен, пытаемся обновить access токен
            if (refreshToken) {
                try {
                    const res = await axios.post(
                        "http://localhost:8000/api/v1/auth/token/refresh/",
                        { refresh: refreshToken }
                    );

                    const newAccessToken = res.data.access;
                    localStorage.setItem("access", newAccessToken);

                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    return api(originalRequest);
                } catch (refreshError) {
                    // Токен истек или невалиден - делаем редирект только если был access токен
                    // (значит пользователь был авторизован, но токен истек)
                    if (accessToken) {
                        logoutAndRedirect();
                    }
                    return Promise.reject(refreshError);
                }
            }

            // Если был access токен, но нет refresh токена - делаем редирект
            if (accessToken) {
                logoutAndRedirect();
            }
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

function logoutAndRedirect() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/auth/login/";
}

export default api;