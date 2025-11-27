import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import HeaderSmall from "../../components/HeaderSmall/HeaderSmall.jsx";
import SectionBlock from "../../components/Section/SectionBlock.jsx";
import AlbumList from "../../components/AlbumList/AlbumList.jsx";
import { fetchAllArtistAlbums, fetchArtistDetail } from "../../api/musicAPI.js";
import { useParams } from "react-router-dom";
import Card from "../../components/Card/Card.jsx";
import avatar from '../../assets/images/artist/pepel.webp'

export default function ArtistAlbums() {
    const { id } = useParams();
    const [albums, setAlbums] = useState([]);
    const [artist, setArtist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadAlbums() {
            try {
                setLoading(true);
                const [albumsData, artistData] = await Promise.all([
                    fetchAllArtistAlbums(id),
                    fetchArtistDetail(id)
                ]);
                setAlbums(Array.isArray(albumsData) ? albumsData : []);
                setArtist(artistData);
                setError(null);
            } catch (err) {
                console.error('Error loading artist albums:', err);
                setError(err.message);
                setAlbums([]);
            } finally {
                setLoading(false);
            }
        }
        if (id) {
            loadAlbums();
        }
    }, [id]);

    if (!artist && !loading) return null;

    const fullName = artist ? `${artist.first_name} ${artist.last_name}`.trim() : '';

    return (
        <section className='artist-albums-page container section'>
            <Sidebar />

            <div className="artist-albums-page__inner section__inner">
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
                    <div className="artist-albums-page__loading">
                        <p>Loading albums...</p>
                    </div>
                )}

                {error && (
                    <div className="artist-albums-page__error">
                        <p>Error: {error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <SectionBlock className='albums section__block-last' title='Albums' isLink={false}>
                        <AlbumList albums={albums} className='artist-albums__list' classNameItem={'artist-albums__item'} />
                    </SectionBlock>
                )}
            </div>
        </section>
    )
}

