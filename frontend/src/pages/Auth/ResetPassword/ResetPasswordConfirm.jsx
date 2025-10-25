import Form from "../../../components/Form/Form.jsx";
import change from '../../../assets/images/forms/change.svg'
import { resetPasswordConfirm } from "../../../api/auth.js";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPasswordConfirm() {
    const { uid, token } = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

    const handleResetPasswordConfirm = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await resetPasswordConfirm(
                uid,
                token,
                newPassword,
                newPasswordConfirm
            );
            navigate("/login");
        } catch (error) {
            setError(error.message)
        }
    };


    const inputs = [
        {
            id: "form__field-email",
            label: "New Password",
            type: "password",
            placeholder: "*********",
            value: newPassword,
            onChange: (e) => setNewPassword(e.target.value),
        },
        {
            id: "form__field-email",
            label: "Repeat Password",
            type: "password",
            placeholder: "*********",
            value: newPasswordConfirm,
            onChange: (e) => setNewPasswordConfirm(e.target.value),
        },
    ];
    return (
        <form onSubmit={handleResetPasswordConfirm} method='post' className="form login__form container">
            <div className="form__inner login__form-inner">
                <Form
                    title='Reset Password'
                    inputs={inputs}
                    buttonIcon={change}
                    buttonText='Change'
                />

                {error && <div className="form__error"><p>{error}</p></div>}

            </div>
        </form>
    )
}