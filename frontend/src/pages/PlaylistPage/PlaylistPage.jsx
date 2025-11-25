// src/pages/PlaylistPage/PlaylistPage.jsx

import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import HeaderSmall from "../../components/HeaderSmall/HeaderSmall.jsx";
import Card from "../../components/Card/Card.jsx";
import Track from "../../components/Track/Track.jsx";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPlaylistDetail } from "../../api/musicAPI.js";

export default function PlaylistPage() {
    const { id } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadPlaylistDetail() {
            try {
                const playlistData = await fetchPlaylistDetail(id);
                setPlaylist(playlistData);
            } catch (error) {
                console.error('Error loading playlist detail:', error);
                setError(error.message);
            }
        }
        loadPlaylistDetail();
    }, [id]);

    useEffect(() => {
        if (error) {
            console.error('PlaylistPage error:', error);
        }
    }, [error]);

    if (!playlist) return null;

    return (
        <section className="playlist-page section container">
            <Sidebar />
            <div className="playlist-page__inner section__inner">
                <HeaderSmall />
                <Card
                    type="playlist"
                    id={playlist.id}
                    title={playlist.title}
                    image={playlist.cover}
                    trackCount={playlist.tracks_count}
                    releaseDate={playlist.created_at}
                />

                <div className="playlist-page__tracks section__block-last">
                    <ul className="playlist-page__tracks-list">
                        {playlist.tracks?.map((track) => (
                            <li className='playlist-page__tracks-item' key={track.id}>
                                <Track
                                    {...track}
                                    className={'playlist-page__track'} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}