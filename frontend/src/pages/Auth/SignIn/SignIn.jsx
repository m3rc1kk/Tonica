import Form from "../../../components/Form/Form.jsx";
import ButtonLink from "../../../components/Button/ButtonLink.jsx";
import googleIcon from '../../../assets/images/forms/google.svg'
import signIcon from '../../../assets/images/forms/signicon.svg'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../api/auth.js";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const inputs = [
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
        }
    ];

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const data = await loginUser(email, password);
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);

            console.log("User logged in: ", data.user);

            navigate("/home");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form method='post' className="form login__form container" onSubmit={handleLogin}>
            <div className="form__inner login__form-inner">
            <Form
                title='Sign In'
                inputs={inputs}
                buttonIcon={signIcon}
                buttonText='Login'
                isLogin={true}
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
                    <span className="form__notreg-text login__form-notreg-text">Not registered yet?</span> <ButtonLink to={'/register'} className="form__notreg-link login__form-notreg-link">Create an account</ButtonLink>
                </div>
            </footer>
            </div>
        </form>
)
}