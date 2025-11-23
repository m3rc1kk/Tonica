import Form from "../../components/Form/Form.jsx";
import { useState } from "react";
import { submitArtistApplication } from "../../api/musicAPI.js";
import signIcon from "../../assets/images/forms/signicon.svg";
import back from '../../assets/images/forms/back.svg'

export default function ArtistApplicationForm() {
    const [stageName, setStageName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const inputs = [
        {
            id: "form__field-stage-name",
            label: "Stage Name",
            type: "text",
            placeholder: "Pepel Nahudi",
            value: stageName,
            onChange: (e) => setStageName(e.target.value),
        },
        {
            id: "form__field-first-name",
            label: "First Name",
            type: "text",
            placeholder: "Dmitriy",
            value: firstName,
            onChange: (e) => setFirstName(e.target.value),
        },
        {
            id: "form__field-last-name",
            label: "Last Name",
            type: "text",
            placeholder: "Nahudiev",
            value: lastName,
            onChange: (e) => setLastName(e.target.value),
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await submitArtistApplication({
                stage_name: stageName,
                first_name: firstName,
                last_name: lastName
        });
            setSuccess(true);
        } catch (error) {
            setError(error.message);
        }
    }
    if (success) {
        return (
        <form method='post' className="form success__form container">
            <div className="form__inner success__form-inner">
                <Form
                    title='Application'
                    inputs={[]}
                    buttonIcon={back}
                    buttonText='Back'
                    text='Your application has been submitted! Wait for approval.'
                />
            </div>
        </form>
    )
}

    return (
        <form onSubmit={handleSubmit} method='post' className="form apply__form container">
            <div className="form__inner apply__form-inner">
                <Form
                    title='Artist Application'
                    inputs={inputs}
                    buttonIcon={signIcon}
                    buttonText='Apply'
                />
                {error && <div className="form__error"><p>{error}</p></div>}
            </div>
        </form>
    )
}