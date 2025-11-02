import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1/",
    headers: {
        "Content-Type": "application/json",
    },
});

// Добавляем токен в каждый запрос
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Обработка ответа и рефреш токена
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Проверяем, что это 401 и запрос ещё не повторялся
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refresh");

            // Если нет refresh токена — сразу на логин
            if (!refreshToken) {
                logoutAndRedirect();
                return Promise.reject(error);
            }

            try {
                // ВАЖНО: используем чистый axios, а не api, чтобы не зациклиться
                const res = await axios.post(
                    "http://localhost:8000/api/v1/auth/token/refresh/",
                    { refresh: refreshToken }
                );

                const newAccessToken = res.data.access;
                localStorage.setItem("access", newAccessToken);

                // Обновляем заголовок для оригинального запроса
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // Повторяем оригинальный запрос
                return api(originalRequest);
            } catch (refreshError) {
                // Если рефреш не удался — выход
                logoutAndRedirect();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Функция выхода и редиректа
function logoutAndRedirect() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/auth/login/";
}

export default api;