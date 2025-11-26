import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import Header from "../../components/Header/Header.jsx";
import SectionBlock from "../../components/Section/SectionBlock.jsx";
import PlaylistList from "../../components/PlaylistList/PlaylistList.jsx";
import { fetchAllPlaylists } from "../../api/musicAPI.js";
import library from '../../assets/images/sidebar/library.svg'

export default function AllPlaylists() {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadPlaylists() {
            try {
                setLoading(true);
                const data = await fetchAllPlaylists();
                setPlaylists(Array.isArray(data) ? data : []);
                setError(null);
            } catch (err) {
                console.error('Error loading playlists:', err);
                setError(err.message);
                setPlaylists([]);
            } finally {
                setLoading(false);
            }
        }
        loadPlaylists();
    }, []);

    return (
        <section className='all-playlists-page container section'>
            <Sidebar />

            <div className="all-playlists-page__inner section__inner">
                <Header
                    icon={library}
                    title='Library'
                />
                
                {loading && (
                    <div className="all-playlists-page__loading">
                        <p>Loading playlists...</p>
                    </div>
                )}

                {error && (
                    <div className="all-playlists-page__error">
                        <p>Error: {error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <SectionBlock className='playlists section__block-last' title='Playlists' isLink={false}>
                        <PlaylistList playlists={playlists} className='playlist-favorite__list' classNameItem={'playlist-favorite__item'}/>
                    </SectionBlock>
                )}
            </div>
        </section>
    )
}

