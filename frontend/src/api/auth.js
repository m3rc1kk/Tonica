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

export async function registerUser(username, email, password, passwordConfirm) {
    try {
        const response = await api.post("auth/register/", {
            username,
            email,
            password,
            password_confirm: passwordConfirm})

        return response.data;


    } catch (error) {
        if (error.response) {
            const data = error.response.data;

            const message =
                data.message ||
                data.non_field_errors?.[0] ||
                data.password?.[0] ||
                JSON.stringify(data)

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