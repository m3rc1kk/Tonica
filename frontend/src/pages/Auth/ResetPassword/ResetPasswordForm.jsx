import Form from "../../../components/Form/Form.jsx";
import mail from '../../../assets/images/forms/mail.svg'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPasswordRequest } from "../../../api/auth.js";

export default function ResetPasswordForm() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('')

        try {
            await resetPasswordRequest(email);
            navigate('/password/reset/done')
        } catch (error) {
            setError(error.message)
        }
    }

    const inputs = [
        {
            id: "form__field-email",
            label: "Email",
            type: "email",
            placeholder: "example@gmail.com",
            value: email,
            onChange: (e) => setEmail(e.target.value),
        },
    ];
    return (
        <form onSubmit={handleResetPassword} method='post' className="form login__form container">
            <div className="form__inner login__form-inner">
                <Form
                    title='Reset Password'
                    inputs={inputs}
                    buttonIcon={mail}
                    buttonText='Send Mail'
                />

                {error && <div className="form__error"><p>{error}</p></div>}

            </div>
        </form>
    )
}