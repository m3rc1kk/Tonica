import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import Header from "../../components/Header/Header.jsx";
import SectionBlock from "../../components/Section/SectionBlock.jsx";
import AlbumList from "../../components/AlbumList/AlbumList.jsx";
import { fetchAllFavoriteAlbums } from "../../api/musicAPI.js";
import library from '../../assets/images/sidebar/library.svg'

export default function FavoriteAlbums() {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadAlbums() {
            try {
                setLoading(true);
                const data = await fetchAllFavoriteAlbums();
                setAlbums(Array.isArray(data) ? data : []);
                setError(null);
            } catch (err) {
                console.error('Error loading favorite albums:', err);
                setError(err.message);
                setAlbums([]);
            } finally {
                setLoading(false);
            }
        }
        loadAlbums();
    }, []);

    return (
        <section className='favorite-albums-page container section'>
            <Sidebar />

            <div className="favorite-albums-page__inner section__inner">
                <Header
                    icon={library}
                    title='Library'
                />
                
                {loading && (
                    <div className="favorite-albums-page__loading">
                        <p>Loading albums...</p>
                    </div>
                )}

                {error && (
                    <div className="favorite-albums-page__error">
                        <p>Error: {error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <SectionBlock className='liked-albums section__block-last' title='Liked Albums' isLink={false}>
                        <AlbumList albums={albums} className='liked-albums__list' classNameItem={'liked-albums__item'} />
                    </SectionBlock>
                )}
            </div>
        </section>
    )
}

