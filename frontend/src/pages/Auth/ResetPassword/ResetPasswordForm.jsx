import Form from "../../../components/Form/Form.jsx";
import mail from '../../../assets/images/forms/mail.svg'

export default function ResetPasswordForm() {
    const inputs = [
        {id: "form__field-email", label: "Email", type: "email", placeholder: "example@gmail.com"},
    ];
    return (
        <form method='post' className="form login__form container">
            <div className="form__inner login__form-inner">
                <Form
                    title='Reset Password'
                    inputs={inputs}
                    buttonIcon={mail}
                    buttonText='Send Mail'
                />

            </div>
        </form>
    )
}