import Form from "../../../components/Form/Form.jsx";
import change from '../../../assets/images/forms/change.svg'

export default function ResetPasswordConfirm() {
    const inputs = [
        {id: "form__field-email", label: "New Password", type: "password", placeholder: "*********"},
        {id: "form__field-email", label: "Repeat Password", type: "password", placeholder: "*********"},
    ];
    return (
        <form method='post' className="form login__form container">
            <div className="form__inner login__form-inner">
                <Form
                    title='Reset Password'
                    inputs={inputs}
                    buttonIcon={change}
                    buttonText='Change'
                />

            </div>
        </form>
    )
}