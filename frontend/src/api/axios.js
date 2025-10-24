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

api.interceptors.response.use((response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refresh");
            try {
                const res = await api.post("token/refresh/", {refresh: refreshToken});
                localStorage.setItem("access", res.data.access);
                originalRequest.headers.authorization = `Bearer ${res.data.access}`;
                return api(originalRequest);
            } catch {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                window.location.href = '/auth/login/'
            }
        }
        return Promise.reject(error);
    }
)

export default api;
