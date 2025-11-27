import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import HeaderSmall from "../../components/HeaderSmall/HeaderSmall.jsx";
import SectionBlock from "../../components/Section/SectionBlock.jsx";
import TrackList from "../../components/TrackList/TrackList.jsx";
import { fetchAllArtistTracks, fetchArtistDetail } from "../../api/musicAPI.js";
import { useParams } from "react-router-dom";
import Card from "../../components/Card/Card.jsx";
import avatar from '../../assets/images/artist/pepel.webp'

export default function ArtistTracks() {
    const { id } = useParams();
    const [tracks, setTracks] = useState([]);
    const [artist, setArtist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadTracks() {
            try {
                setLoading(true);
                const [tracksData, artistData] = await Promise.all([
                    fetchAllArtistTracks(id),
                    fetchArtistDetail(id)
                ]);
                setTracks(Array.isArray(tracksData) ? tracksData : []);
                setArtist(artistData);
                setError(null);
            } catch (err) {
                console.error('Error loading artist tracks:', err);
                setError(err.message);
                setTracks([]);
            } finally {
                setLoading(false);
            }
        }
        if (id) {
            loadTracks();
        }
    }, [id]);

    if (!artist && !loading) return null;

    const fullName = artist ? `${artist.first_name} ${artist.last_name}`.trim() : '';

    return (
        <section className='artist-tracks-page container section'>
            <Sidebar />

            <div className="artist-tracks-page__inner section__inner">
                <HeaderSmall />
                
                {artist && (
                    <Card
                        type="artist"
                        image={artist.avatar || avatar}
                        author={artist}
                        fullName={fullName}
                    />
                )}

                {loading && (
                    <div className="artist-tracks-page__loading">
                        <p>Loading tracks...</p>
                    </div>
                )}

                {error && (
                    <div className="artist-tracks-page__error">
                        <p>Error: {error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <SectionBlock className='tracks section__block-last' title='Tracks' isLink={false}>
                        <TrackList tracks={tracks} className='artist-tracks__list' classNameItem={'artist-tracks__item'}/>
                    </SectionBlock>
                )}
            </div>
        </section>
    )
}

