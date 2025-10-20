import Form from "../../../components/Form/Form.jsx";
import mail from '../../../assets/images/forms/mail.svg'

export default function ResetPasswordDone() {
    const inputs = [
    ];

    return (
        <form method='post' className="form login__form container">
            <div className="form__inner login__form-inner">
                <div className="form__text-sent">
                    We have sent you an email with a link.
                </div>
            </div>
        </form>
    )
}