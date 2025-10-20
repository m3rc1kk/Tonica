import Form from "../../../components/Form/Form.jsx";
import ButtonLink from "../../../components/Button/ButtonLink.jsx";
import googleIcon from '../../../assets/images/forms/google.svg'
import signIcon from '../../../assets/images/forms/signicon.svg'


export default function SignUpPage() {
    const inputs = [
        {id: "form__field-username", label: "Username", type: "text", placeholder: "example"},
        {id: "form__field-email", label: "Email", type: "email", placeholder: "example@gmail.com"},
        {id: "form__field-password", label: "Password", type: "password", placeholder: "*********"},
        {id: "form__field-password-confirm", label: "Password Confirm", type: "password", placeholder: "*********"},
    ];
    return (
        <form method='post' className="form login__form container">
            <div className="form__inner login__form-inner">
                <Form
                    title='Sign Up'
                    inputs={inputs}
                    buttonIcon={signIcon}
                    buttonText='Register'
                />

                <footer className="form__footer">
                    <div className="form__or login__form-or">
                        Or
                    </div>

                    <ButtonLink to={'/'} className="form__google login__form-google">
                        <img src={googleIcon} alt="Google" width={16} height={16} loading='lazy' className="form__google-icon login__form-google-icon"/> Google
                    </ButtonLink>

                    <div className="form__notreg login__form-notreg">
                        <span className="form__notreg-text login__form-notreg-text">Already have an account?</span> <ButtonLink to={'/login'} className="form__notreg-link login__form-notreg-link">Sign In</ButtonLink>
                    </div>
                </footer>
            </div>
        </form>
    )
}