import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import Trend from "../../components/Trend/Trend.jsx";
import Header from "../../components/Header/Header.jsx";
import avatar from '../../assets/images/header/avatar.png'
import home from '../../assets/images/header/home.svg'
import SectionBlock from "../../components/Section/SectionBlock.jsx";
import TrackList from "../../components/TrackList/TrackList.jsx";
import AlbumList from "../../components/AlbumList/AlbumList.jsx";
import GenreList from "../../components/GenreList/GenreList.jsx";
import ArtistList from "../../components/ArtistList/ArtistList.jsx";

import { useEffect, useState } from "react";
import {fetchTrendAlbum, fetchTrendTracks, fetchTrendingArtists, fetchChartTracks, fetchNewReleases, fetchTopGenres} from "../../api/musicAPI.js";

export default function Home() {

    const [artists, setArtists] = useState([]);
    const [artistError, setArtistError] = useState(null);

    const [tracks, setTracks] = useState([]);
    const [tracksError, setTracksError] = useState(null);

    const [albums, setAlbums] = useState([]);
    const [albumsError, setAlbumsError] = useState(null);

    const [trendTracks, setTrendTracks] = useState([]);
    const [trendAlbum, setTrendAlbum] = useState([]);
    const [trendError, setTrendError] = useState(null);

    const [genres, setGenres] = useState([]);
    const [genresError, setGenresError] = useState(null);


    useEffect(() => {
        async function loadTrends() {
            try {
                const [tracks, albums] = await Promise.all([
                    fetchTrendTracks(4),
                    fetchTrendAlbum(1)
                ]);
                setTrendTracks(Array.isArray(tracks) ? tracks : []);
                setTrendAlbum(Array.isArray(albums) && albums.length > 0 ? albums[0] : null);
            } catch(error) {
                console.error('Error loading trends:', error);
                setTrendError(error.message);
                setTrendTracks([]);
                setTrendAlbum(null);
            }
        }
        loadTrends();
    }, [])


    useEffect(() => {
        async function loadArtists() {
            try {
                const data = await fetchTrendingArtists(4);
                setArtists(data);
            } catch(error) {
                console.error('Error loading artists:', error);
                setArtistError(error.message);
            }
        }
        loadArtists();
    }, [])


    useEffect(() => {
        async function loadTracks() {
            try {
                const data = await fetchChartTracks(9);
                setTracks(data);
            } catch(error) {
                console.error('Error loading tracks:', error);
                setTracksError(error.message);
            }
        }
        loadTracks();
    }, [])

    useEffect(() => {
        async function loadNewReleases() {
            try {
                const data = await fetchNewReleases(5);
                
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
            } catch(error) {
                console.error('Error loading albums:', error);
                setAlbumsError(error.message);
            }
        }
        loadNewReleases();
    }, [])

    useEffect(() => {
        async function loadGenres() {
            try {
                const data = await fetchTopGenres(5);
                setGenres(data);
            } catch(error) {
                console.error('Error loading genres:', error);
                setGenresError(error.message);
                setGenres([]);
            }
        }
        loadGenres();
    }, [])

    useEffect(() => {
        if (tracksError) console.error('Home tracks error:', tracksError);
        if (artistError) console.error('Home artists error:', artistError);
        if (albumsError) console.error('Home albums error:', albumsError);
        if (trendError) console.error('Home trends error:', trendError);
        if (genresError) console.error('Home genres error:', genresError);
    }, [tracksError, artistError, albumsError, trendError, genresError]);


    return (
        <section className='home container section'>
            <Sidebar />

            <div className="home__inner section__inner">
                <Header
                    icon={home}
                    avatar={avatar}
                    title='Home'
                />
                <div className="home__trend">
                    <ul className="home__trend-list">
                        {trendTracks && trendTracks.map((trend) => (
                            <li key={trend.id} className="home__trend-item">
                                <Trend {...trend}/>
                            </li>
                        ))}

                        {trendAlbum && (
                            <li className="home__trend-item home__trend-item--album">
                                <Trend {...trendAlbum} isAlbum={true} />
                            </li>
                        )}

                    </ul>
                </div>

                <SectionBlock className='charts' title='Charts' link={'/charts'}>
                    <TrackList tracks={tracks} className='charts' />
                </SectionBlock>

                <SectionBlock className='new-releases' title='New Releases' link={'/new-releases'}>
                    <AlbumList albums={albums} className='new-releases__list' />
                </SectionBlock>

                <SectionBlock className='genres' title='Genres' isLink={false}>
                    <GenreList genres={genres} className='genres__list' />
                </SectionBlock>

                <SectionBlock className='artists section__block-last' title='Trending Artists' isLink={false}>
                    <ArtistList artists={artists} className='artists__list' />
                </SectionBlock>
            </div>
        </section>
    )
}