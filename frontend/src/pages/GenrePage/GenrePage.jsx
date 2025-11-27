import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import HeaderSmall from "../../components/HeaderSmall/HeaderSmall.jsx";
import SectionBlock from "../../components/Section/SectionBlock.jsx";
import TrackList from "../../components/TrackList/TrackList.jsx";
import { fetchGenreTracks, fetchGenreDetail } from "../../api/musicAPI.js";
import { useParams } from "react-router-dom";


export default function GenrePage() {
    const { slug } = useParams();
    const [tracks, setTracks] = useState([]);
    const [genre, setGenre] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadTracks() {
            try {
                setLoading(true);
                const [tracksData, genreData] = await Promise.all([
                    fetchGenreTracks(slug, 50),
                    fetchGenreDetail(slug)
                ]);
                setTracks(Array.isArray(tracksData) ? tracksData : []);
                setGenre(genreData);
                setError(null);
            } catch (err) {
                console.error('Error loading genre tracks:', err);
                setError(err.message);
                setTracks([]);
            } finally {
                setLoading(false);
            }
        }
        if (slug) {
            loadTracks();
        }
    }, [slug]);

    return (
        <section className='genre-page container section'>
            <Sidebar />

            <div className="genre-page__inner section__inner">
                <HeaderSmall />
                
                {genre && (
                    <div className="genre-page__header">
                        <h1 className="genre-page__title">{genre.title}</h1>
                    </div>
                )}

                {loading && (
                    <div className="genre-page__loading">
                        <p>Loading tracks...</p>
                    </div>
                )}

                {error && (
                    <div className="genre-page__error">
                        <p>Error: {error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <SectionBlock className='tracks section__block-last' title='Tracks' isLink={false}>
                        <TrackList tracks={tracks} className='genre-tracks__list' classNameItem={'genre-tracks__item'}/>
                    </SectionBlock>
                )}
            </div>
        </section>
    )
}

