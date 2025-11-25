import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import Header from "../../components/Header/Header.jsx";
import SectionBlock from "../../components/Section/SectionBlock.jsx";
import TrackList from "../../components/TrackList/TrackList.jsx";
import AlbumList from "../../components/AlbumList/AlbumList.jsx";
import ArtistList from "../../components/ArtistList/ArtistList.jsx";
import library from '../../assets/images/sidebar/library.svg'
import { fetchFavoriteTracks, fetchFavoriteAlbums, fetchFavoriteArtists, fetchPlaylists } from "../../api/musicAPI.js";
import PlaylistList from "../../components/PlaylistList/PlaylistList.jsx";


export default function Library() {
    const [tracks, setTracks] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const [tracksData, albumsData, artistsData, playlistsData] = await Promise.all([
                    fetchFavoriteTracks(),
                    fetchFavoriteAlbums(),
                    fetchFavoriteArtists(),
                    fetchPlaylists()
                ]);
                setTracks(tracksData || []);
                setAlbums(albumsData || []);
                setArtists(artistsData || []);
                setPlaylists(playlistsData || []);
            } catch (error) {
                console.error('Error loading favorites:', error);
                setTracks([]);
                setAlbums([]);
                setArtists([]);
                setPlaylists([]);
            }
        };

        loadFavorites();
    }, []);

    return (
        <section className='library container section'>
            <Sidebar />

            <div className="library__inner section__inner">
                <Header
                    icon={library}
                    title='Library'
                />

                <SectionBlock className='favorites' title="Favorites">
                    <TrackList tracks={tracks} className='favorites__list' />
                </SectionBlock>

                <SectionBlock className='playlists' title='Playlists'>
                    <PlaylistList playlists={playlists} className='playlists__list' />
                </SectionBlock>

                <SectionBlock className='liked-albums' title='Liked Albums'>
                    <AlbumList albums={albums} className='liked-albums__list' />
                </SectionBlock>

                <SectionBlock className='liked-artists section__block-last' title='Liked Artists'>
                    <ArtistList artists={artists} className='liked-artists__list' />
                </SectionBlock>
            </div>
        </section>
    )
}