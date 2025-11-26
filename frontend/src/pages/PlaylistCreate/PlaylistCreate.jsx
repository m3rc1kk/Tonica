import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import HeaderSmall from "../../components/HeaderSmall/HeaderSmall.jsx";
import Form from "../../components/Form/Form.jsx";
import signIcon from '../../assets/images/forms/signicon.svg';
import { createPlaylist } from "../../api/musicAPI.js";

export default function PlaylistCreate() {
    const [title, setTitle] = useState("");
    const [cover, setCover] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const inputs = [
        {
            id: "form__field-cover",
            label: "Image",
            type: "file",
            placeholder: "Choose cover image",
            onChange: (e) => setCover(e.target.files[0] || null),
        },
        {
            id: "form__field-title",
            label: "Title",
            type: "text",
            placeholder: "My Playlist",
            value: title,
            onChange: (e) => setTitle(e.target.value),
        },
    ];

    const handleCreate = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (!title.trim()) {
            setError("Playlist title is required");
            setIsLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", title.trim());
            if (cover) {
                formData.append("cover", cover);
            }

            const data = await createPlaylist(formData);
            console.log("Playlist created: ", data);

            navigate(`/playlist/${data.id}`);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <section className="playlist-create section container">
            <Sidebar />
            <div className="playlist-create__inner section__inner">
                <HeaderSmall />
                <form method='post' className="form login__form" onSubmit={handleCreate}>
                    <div className="form__inner login__form-inner">
                        <Form
                            title='Create Playlist'
                            inputs={inputs}
                            buttonIcon={signIcon}
                            buttonText={isLoading ? 'Creating...' : 'Create Playlist'}
                        />
                        {error && <div className="form__error"><p>{error}</p></div>}
                    </div>
                </form>
            </div>
        </section>
    );
}
