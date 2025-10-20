import Form from "../../../components/Form/Form.jsx";
import back from '../../../assets/images/forms/back.svg'

export default function ResetPasswordComplete() {
    const inputs = [];
    return (
        <form method='post' className="form login__form container">
            <div className="form__inner login__form-inner">
                <Form
                    title='Reset Password'
                    inputs={inputs}
                    buttonIcon={back}
                    buttonText='Back'
                    text='Your password has been successfully changed'
                />

            </div>
        </form>
    )
}