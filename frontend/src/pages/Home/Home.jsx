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
import {fetchTrendingArtists, fetchChartTracks, fetchNewReleases} from "../../api/artists.js";

export default function Home() {

    const [artists, setArtists] = useState([]);
    const [artistLoading, setArtistLoading] = useState(true);
    const [artistError, setArtistError] = useState(null);

    const [tracks, setTracks] = useState([]);
    const [tracksLoading, setTracksLoading] = useState(true);
    const [tracksError, setTracksError] = useState(null);

    const [albums, setAlbums] = useState([]);
    const [albumsLoading, setAlbumsLoading] = useState(true);
    const [albumsError, setAlbumsError] = useState(null);

    useEffect(() => {
        async function loadArtists() {
            try {
                const data = await fetchTrendingArtists(5);
                setArtists(data);
            } catch(error) {
                setArtistError(error.message);
            } finally {
                setArtistLoading(false);
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
                setTracksError(error.message);
            } finally {
                setTracksLoading(false);
            }
        }
        loadTracks();
    }, [])

    useEffect(() => {
        async function loadNewReleases() {
            try {
                const data = await fetchNewReleases(9);
                setAlbums(data);
            } catch(error) {
                setAlbumsError(error.message);
            } finally {
                setAlbumsLoading(false);
            }
        }
        loadNewReleases();
    }, [])

    if (tracksLoading) return <p>Loading artists...</p>
    if (tracksError) return <p>Error: {tracksError}</p>;

    if (artistLoading) return <p>Loading artists...</p>
    if (artistError) return <p>Error: {artistError}</p>;

    if (albumsLoading) return <p>Loading artists...</p>
    if (albumsError) return <p>Error: {albumsError}</p>;

    const trends = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
    ];

    const genres = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
    ];


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
                        {trends.map((trend) => (
                            <li key={trend.id} className="home__trend-item">
                                <Trend />
                            </li>
                        ))}

                        <li className="home__trend-item home__trend-item--album">
                            <Trend isAlbum />
                        </li>

                    </ul>
                </div>

                <SectionBlock className='charts' title='Charts'>
                    <TrackList tracks={tracks} className='charts__list' />
                </SectionBlock>

                <SectionBlock className='new-releases' title='New Releases'>
                    <AlbumList albums={albums} className='new-releases__list' />
                </SectionBlock>

                <SectionBlock className='genres' title='Genres'>
                    <GenreList genres={genres} className='genres__list' />
                </SectionBlock>

                <SectionBlock className='artists section__block-last' title='Trending Artists'>
                    <ArtistList artists={artists} className='artists__list' />
                </SectionBlock>
            </div>
        </section>
    )
}