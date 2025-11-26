import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import Header from "../../components/Header/Header.jsx";
import SectionBlock from "../../components/Section/SectionBlock.jsx";
import ArtistList from "../../components/ArtistList/ArtistList.jsx";
import { fetchAllFavoriteArtists } from "../../api/musicAPI.js";
import library from '../../assets/images/sidebar/library.svg'

export default function FavoriteArtists() {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadArtists() {
            try {
                setLoading(true);
                const data = await fetchAllFavoriteArtists();
                setArtists(Array.isArray(data) ? data : []);
                setError(null);
            } catch (err) {
                console.error('Error loading favorite artists:', err);
                setError(err.message);
                setArtists([]);
            } finally {
                setLoading(false);
            }
        }
        loadArtists();
    }, []);

    return (
        <section className='favorite-artists-page container section'>
            <Sidebar />

            <div className="favorite-artists-page__inner section__inner">
                <Header
                    icon={library}
                    title='Library'
                />
                
                {loading && (
                    <div className="favorite-artists-page__loading">
                        <p>Loading artists...</p>
                    </div>
                )}

                {error && (
                    <div className="favorite-artists-page__error">
                        <p>Error: {error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <SectionBlock className='liked-artists section__block-last' title='Liked Artists' isLink={false}>
                        <ArtistList artists={artists} className='liked-artists__list' classNameItem={'liked-artists__item'}/>
                    </SectionBlock>
                )}
            </div>
        </section>
    )
}

