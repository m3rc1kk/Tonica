import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import Header from "../../components/Header/Header.jsx";
import SectionBlock from "../../components/Section/SectionBlock.jsx";
import TrackList from "../../components/TrackList/TrackList.jsx";
import { fetchAllFavoriteTracks } from "../../api/musicAPI.js";
import library from '../../assets/images/sidebar/library.svg'

export default function FavoriteTracks() {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadTracks() {
            try {
                setLoading(true);
                const data = await fetchAllFavoriteTracks();
                setTracks(Array.isArray(data) ? data : []);
                setError(null);
            } catch (err) {
                console.error('Error loading favorite tracks:', err);
                setError(err.message);
                setTracks([]);
            } finally {
                setLoading(false);
            }
        }
        loadTracks();
    }, []);

    return (
        <section className='favorite-tracks-page container section'>
            <Sidebar />

            <div className="favorite-tracks-page__inner section__inner">
                <Header
                    icon={library}
                    title='Library'
                />
                
                {loading && (
                    <div className="favorite-tracks-page__loading">
                        <p>Loading tracks...</p>
                    </div>
                )}

                {error && (
                    <div className="favorite-tracks-page__error">
                        <p>Error: {error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <SectionBlock className='favorites section__block-last' title='Favorites' isLink={false}>
                        <TrackList tracks={tracks} className='liked-tracks__list' classNameItem={'liked-tracks__item'}/>
                    </SectionBlock>
                )}
            </div>
        </section>
    )
}

