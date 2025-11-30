import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import search from "../../assets/images/search/search.svg";
import searchButton from "../../assets/images/search/search-icon.svg";
import avatar from "../../assets/images/header/avatar.png";
import Header from "../../components/Header/Header.jsx";
import ButtonLink from "../../components/Button/ButtonLink.jsx";
import SectionBlock from "../../components/Section/SectionBlock.jsx";
import TrackList from "../../components/TrackList/TrackList.jsx";
import AlbumList from "../../components/AlbumList/AlbumList.jsx";
import ArtistList from "../../components/ArtistList/ArtistList.jsx";
import { searchArtists, searchTracks, searchAlbums } from "../../api/search.js";

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const queryParam = searchParams.get('q') || '';

    const [searchQuery, setSearchQuery] = useState(queryParam);
    const [artists, setArtists] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (queryParam) {
            performSearch(queryParam);
        }
    }, [queryParam]);

    const performSearch = async (query) => {
        if (!query.trim()) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const [artistsData, tracksData, albumsData] = await Promise.all([
                searchArtists(query, 4),
                searchTracks(query, 9),
                searchAlbums(query, 5)
            ]);

            setArtists(Array.isArray(artistsData) ? artistsData : []);
            setTracks(Array.isArray(tracksData) ? tracksData : []);
            setAlbums(Array.isArray(albumsData) ? albumsData : []);
        } catch (err) {
            console.error('Search error:', err);
            setError(err.message);
            setArtists([]);
            setTracks([]);
            setAlbums([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const query = searchQuery.trim();

        if (!query) {
            return;
        }

        navigate(`/search/results?q=${encodeURIComponent(query)}`);
    };

    const hasResults = artists.length > 0 || tracks.length > 0 || albums.length > 0;

    return (
        <>
            <section className="search-results container section">
                <Sidebar />
                <div className="search-results__inner section__inner">
                    <Header
                        icon={search}
                        avatar={avatar}
                        title='Search Results'
                    />

                    <div className="search-results__body">
                        <h2 className="search-results__title">Find music to your taste</h2>
                        <form onSubmit={handleSearch} className="search-results__form">
                            <input
                                type="search"
                                id="search-input"
                                placeholder='Search'
                                className="search-results__input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <ButtonLink
                                className={'search-results__button'}
                                type={'submit'}
                            >
                                <img src={searchButton} width={55} height={55} loading='lazy' alt="" className="search-results__button-icon"/>
                            </ButtonLink>
                        </form>
                    </div>

                    {loading && (
                        <div className="search-results__loading">
                            <p>Searching...</p>
                        </div>
                    )}

                    {error && (
                        <div className="search-results__error">
                            <p>Error: {error}</p>
                        </div>
                    )}

                    {!loading && !error && queryParam && (
                        <>
                            {!hasResults ? (
                                <div className="search-results__no-results">
                                    <p>No results found for "{queryParam}"</p>
                                </div>
                            ) : (
                                <>
                                    {tracks.length > 0 && (
                                        <SectionBlock className='search-tracks' title='Tracks' isLink={false}>
                                            <TrackList tracks={tracks} className='search-tracks__list' />
                                        </SectionBlock>
                                    )}

                                    {albums.length > 0 && (
                                        <SectionBlock className='search-albums' title='Albums' isLink={false}>
                                            <AlbumList albums={albums} className='search-albums__list' />
                                        </SectionBlock>
                                    )}

                                    {artists.length > 0 && (
                                        <SectionBlock className='search-artists section__block-last' title='Artists' isLink={false}>
                                            <ArtistList artists={artists} className='search-artists__list' />
                                        </SectionBlock>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </section>
        </>
    )
}