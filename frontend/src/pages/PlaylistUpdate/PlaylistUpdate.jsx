import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import HeaderSmall from "../../components/HeaderSmall/HeaderSmall.jsx";
import Form from "../../components/Form/Form.jsx";
import signIcon from '../../assets/images/forms/signicon.svg';
import { updatePlaylist, fetchPlaylistDetail } from "../../api/musicAPI.js";

export default function PlaylistUpdate() {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [cover, setCover] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadPlaylistData() {
            try {
                const playlistData = await fetchPlaylistDetail(id);
                setTitle(playlistData.title || "");
                setIsLoadingData(false);
            } catch (error) {
                console.error('Error loading playlist:', error);
                setError(error.message || 'Failed to load playlist');
                setIsLoadingData(false);
            }
        }
        if (id) {
            loadPlaylistData();
        }
    }, [id]);

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

    const handleUpdate = async (e) => {
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

            await updatePlaylist(id, formData);
            navigate(`/playlist/${id}`);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    if (isLoadingData) {
        return (
            <section className="playlist-update section container">
                <Sidebar />
                <div className="playlist-update__inner section__inner">
                    <HeaderSmall />
                    <div>Loading...</div>
                </div>
            </section>
        );
    }

    return (
        <section className="playlist-update section container">
            <Sidebar />
            <div className="playlist-update__inner section__inner">
                <HeaderSmall />
                <form method='post' className="form login__form" onSubmit={handleUpdate}>
                    <div className="form__inner login__form-inner">
                        <Form
                            title='Edit Playlist'
                            inputs={inputs}
                            buttonIcon={signIcon}
                            buttonText={isLoading ? 'Updating...' : 'Update Playlist'}
                        />
                        {error && <div className="form__error"><p>{error}</p></div>}
                    </div>
                </form>
            </div>
        </section>
    );
}

