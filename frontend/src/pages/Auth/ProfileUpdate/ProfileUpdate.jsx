import Form from "../../../components/Form/Form.jsx";
import signIcon from '../../../assets/images/forms/signicon.svg'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile, fetchUserProfile } from "../../../api/auth.js";

export default function ProfileUpdate() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function loadUserData() {
            try {
                const userData = await fetchUserProfile();
                setUsername(userData.username || "");
                setEmail(userData.email || "");
            } catch (err) {
                setError(err.message);
            }
        }
        loadUserData();
    }, []);

    const inputs = [
        {
            id: "form__field-avatar",
            label: "Avatar",
            type: "file",
            placeholder: "Avatar",
            onChange: (e) => setAvatar(e.target.files[0] || null),
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
    ];

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("email", email);
            if (avatar) {
                formData.append("avatar", avatar);
            }

            await updateUserProfile(formData);

            console.log('Profile updated')
            navigate("/profile");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <form method='post' onSubmit={handleUpdate} className="form login__form container">
            <div className="form__inner login__form-inner">
                <Form
                    title='Update Profile'
                    inputs={inputs}
                    buttonIcon={signIcon}
                    buttonText='Update'
                />

                {error && <div className="form__error"><p>{error}</p></div>}
            </div>
        </form>
    )
}
