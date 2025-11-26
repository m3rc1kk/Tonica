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
                    fetchFavoriteTracks(9),
                    fetchFavoriteAlbums(5),
                    fetchFavoriteArtists(4),
                    fetchPlaylists(4)
                ]);
                setTracks(tracksData || []);
                setAlbums(albumsData || []);
                setArtists(artistsData || []);
                setPlaylists(Array.isArray(playlistsData) ? playlistsData.slice(0, 4) : []);
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

                <SectionBlock className='favorites' title="Favorites" link='/favorites/tracks/'>
                    <TrackList tracks={tracks} className='favorites__list' />
                </SectionBlock>

                <SectionBlock className='playlists' title='Playlists' link='/playlists/'>
                    <PlaylistList playlists={playlists} className='playlists__list'/>
                </SectionBlock>

                <SectionBlock className='liked-album' title='Liked Albums' link='/favorites/albums/'>
                    <AlbumList albums={albums} className='liked-album__list'/>
                </SectionBlock>

                <SectionBlock className='liked-artist section__block-last' title='Liked Artists' link='/favorites/artists/'>
                    <ArtistList artists={artists} className='liked-artist__list'/>
                </SectionBlock>
            </div>
        </section>
    )
}