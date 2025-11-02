import api from "./axios";

export async function loginUser(email, password) {
    try {
        const response = await api.post("auth/login/", { email, password });
        return response.data;
    } catch (error) {
        if (error.response) {
            const data = error.response.data;

            const firstKey = Object.keys(data)[0];
            const message = Array.isArray(data[firstKey])
                ? data[firstKey][0]
                : data.message ||
                data.non_field_errors?.[0] ||
                data.password?.[0] ||
                "Unknown error";

            throw new Error(message);

        } else {
            throw new Error("Network error");
        }
    }
}

export async function registerUser(formData) {
    try {
        const response = await api.post("auth/register/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });

        return response.data;


    } catch (error) {
        if (error.response) {
            const data = error.response.data;

            const firstKey = Object.keys(data)[0];
            const message = Array.isArray(data[firstKey])
                ? data[firstKey][0]
                : data.message ||
                data.non_field_errors?.[0] ||
                data.password?.[0] ||
                "Unknown error";

            throw new Error(message);
    } else {
        throw new Error("Network error");
        }
    }
}

export async function resetPasswordRequest(email) {
    try {
        const response = await api.post("auth/password/reset/", {email})
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data?.email || error.response.data?.error || "Password reset failed");
        }
        throw new Error("Network error");
    }
}

export async function resetPasswordConfirm(uid, token, newPassword, newPasswordConfirm) {
    try {
        const response = await api.post("auth/password/reset/confirm/", {
            uid,
            token,
            new_password: newPassword,
            new_password_confirm: newPasswordConfirm
        })
        return response.data
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data?.non_field_errors?.[0] || error.response.data?.error || "Password reset confirm failed");
        }
        throw new Error("Network error");
    }
}

export async function logoutUser() {
    try {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) throw new Error('We cannot perform this operation')

        await api.post('auth/logout/', {refresh})

        localStorage.removeItem('access')
        localStorage.removeItem('refresh')

        return true
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data?.error || "Failed to logout")
        }
        throw new Error("Network error");
    }
}

export async function fetchUserProfile() {
    try {
        const response = await api.get('auth/profile/');
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data?.detail || "Failed to load user profile");
        }
        throw new Error('Network Error')
    }
}
