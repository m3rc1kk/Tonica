import SectionBlock from "../../components/Section/SectionBlock.jsx";
import TrackList from "../../components/TrackList/TrackList.jsx";
import AlbumList from "../../components/AlbumList/AlbumList.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import HeaderSmall from "../../components/HeaderSmall/HeaderSmall.jsx";
import avatar from '../../assets/images/artist/pepel.webp'
import Card from "../../components/Card/Card.jsx";
import { useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import {fetchAlbumDetail} from "../../api/musicAPI.js";
import Track from "../../components/Track/Track.jsx";

export default function AlbumPage() {
    const {id} = useParams();
    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadAlbumDetail() {
            try {
                const albumData = await fetchAlbumDetail(id);

                setAlbum(albumData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        loadAlbumDetail();
    }, [id])

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;



    return (
        <section className="album-page section container">
            <Sidebar />
            <div className="album-page__inner section__inner">
                <HeaderSmall />
                <Card
                    type="album"
                    title={album.title}
                    image={album.cover}
                    author={album.artist}
                    releaseDate={album.release_date}
                    trackCount={album.tracks_count}
                    albumType={album.album_type}
                />

                <div className="album-page__tracks section__block-last">
                    <ul className="album-page__tracks-list">
                        {album.tracks.map((track) => (
                            <li className='album-page__tracks-item' key={track.id}>
                                <Track
                                    {...track}
                                    className={'album-page__track'} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}