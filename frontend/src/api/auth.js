import api from "./axios";

export async function loginUser(email, password) {
    try {
        const response = await api.post("auth/login/", { email, password });
        return response.data;
    } catch (error) {
        if (error.response) {
            const data = error.response.data;

            const message =
                data.message || data.non_field_errors?.[0] ||
                JSON.stringify(data)

            throw new Error(message);

        } else {
            throw new Error("Network error");
        }
    }
}
