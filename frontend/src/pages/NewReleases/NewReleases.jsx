import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import Header from "../../components/Header/Header.jsx";
import SectionBlock from "../../components/Section/SectionBlock.jsx";
import AlbumList from "../../components/AlbumList/AlbumList.jsx";
import { fetchAllPublishedAlbums } from "../../api/musicAPI.js";
import home from '../../assets/images/header/home.svg'

export default function NewReleases() {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadAlbums() {
            try {
                setLoading(true);
                const data = await fetchAllPublishedAlbums();
                
                const twoWeeksAgo = new Date();
                twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
                twoWeeksAgo.setHours(0, 0, 0, 0);
                
                const today = new Date();
                today.setHours(23, 59, 59, 999);
                
                const filteredAlbums = Array.isArray(data) ? data.filter(album => {
                    if (!album.release_date) return false;
                    
                    const releaseDate = new Date(album.release_date);
                    return releaseDate >= twoWeeksAgo && releaseDate <= today;
                }) : [];
                
                setAlbums(filteredAlbums);
                setError(null);
            } catch (err) {
                console.error('Error loading albums:', err);
                setError(err.message);
                setAlbums([]);
            } finally {
                setLoading(false);
            }
        }
        loadAlbums();
    }, []);

    return (
        <section className='new-releases-page container section'>
            <Sidebar />

            <div className="new-releases-page__inner section__inner">
                <Header
                    icon={home}
                    title='Home'
                />
                
                {loading && (
                    <div className="new-releases-page__loading">
                        <p>Loading albums...</p>
                    </div>
                )}

                {error && (
                    <div className="new-releases-page__error">
                        <p>Error: {error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <SectionBlock className='new-releases section__block-last' title='New Releases' isLink={false}>
                        <AlbumList albums={albums} className='new-releases__list' />
                    </SectionBlock>
                )}
            </div>
        </section>
    )
}
