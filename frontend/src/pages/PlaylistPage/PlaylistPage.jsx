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

    const handleTrackRemoved = (trackId) => {
        if (playlist) {
            setPlaylist({
                ...playlist,
                playlist_tracks: playlist.playlist_tracks?.filter(
                    pt => pt.track.id !== trackId
                ) || [],
                tracks_count: (playlist.tracks_count || 1) - 1
            });
        }
    };

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
                        {playlist.playlist_tracks?.map((playlistTrack, index) => (
                            <li className='playlist-page__tracks-item' key={playlistTrack.id}>
                                <Track
                                    {...playlistTrack.track}
                                    className={'playlist-page__track'}
                                    playlistId={id}
                                    onTrackRemoved={handleTrackRemoved}
                                    queueTracks={playlist.playlist_tracks?.map(pt => pt.track) || []}
                                    queueStartIndex={index}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}