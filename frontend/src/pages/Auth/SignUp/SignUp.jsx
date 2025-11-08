import Form from "../../../components/Form/Form.jsx";
import ButtonLink from "../../../components/Button/ButtonLink.jsx";
import googleIcon from '../../../assets/images/forms/google.svg'
import signIcon from '../../../assets/images/forms/signicon.svg'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from "../../../api/auth.js";

export default function SignUpPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [avatar, setAvatar] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const inputs = [
        {
            id: "form__field-avatar",
            label: "Avatar",
            type: "file",
            placeholder: "Avatar",
            onChange: (e) => setAvatar(e.target.files[0]),
        },

        {id: "form__field-username",
            label: "Username",
            type: "text",
            placeholder: "example",
            value: username,
            onChange: (e) => setUsername(e.target.value),
        },

        {id: "form__field-email",
            label: "Email",
            type: "email",
            placeholder: "example@gmail.com",
            value: email,
            onChange: (e) => setEmail(e.target.value),
        },

        {id: "form__field-password",
            label: "Password",
            type: "password",
            placeholder: "*********",
            value: password,
            onChange: (e) => setPassword(e.target.value),
        },

        {id: "form__field-password-confirm",
            label: "Password Confirm",
            type: "password",
            placeholder: "*********",
            value: passwordConfirm,
            onChange: (e) => setPasswordConfirm(e.target.value),
        },

    ];

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("password_confirm", passwordConfirm);
            if (avatar) {
                formData.append("avatar", avatar);
            }

            const data = await registerUser(formData);

            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);

            console.log('User registered: ', data.user)
            navigate("/home");
        } catch (err) {
            setError(err.message);
        }
    }



    return (
        <form method='post' onSubmit={handleRegister} className="form login__form container">
            <div className="form__inner login__form-inner">
                <Form
                    title='Sign Up'
                    inputs={inputs}
                    buttonIcon={signIcon}
                    buttonText='Register'
                />

                {error && <div className="form__error"><p>{error}</p></div>}

                <footer className="form__footer">
                    <div className="form__or login__form-or">
                        Or
                    </div>

                    <ButtonLink to={'/'} className="form__google login__form-google">
                        <img src={googleIcon} alt="Google" width={16} height={16} loading='lazy' className="form__google-icon login__form-google-icon"/> Google
                    </ButtonLink>

                    <div className="form__notreg login__form-notreg">
                        <span className="form__notreg-text login__form-notreg-text">Already have an account?</span> <ButtonLink to={'/auth/login'} className="form__notreg-link login__form-notreg-link">Sign In</ButtonLink>
                    </div>
                </footer>
            </div>
        </form>
    )
}