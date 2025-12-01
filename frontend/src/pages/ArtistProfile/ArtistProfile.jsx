import SectionBlock from "../../components/Section/SectionBlock.jsx";
import TrackList from "../../components/TrackList/TrackList.jsx";
import AlbumList from "../../components/AlbumList/AlbumList.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import HeaderSmall from "../../components/HeaderSmall/HeaderSmall.jsx";
import avatar from '../../assets/images/artist/pepel.webp'
import { useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import {fetchArtistAlbums, fetchArtistDetail, fetchArtistTracks, fetchNewReleases} from "../../api/musicAPI.js";
import Card from "../../components/Card/Card.jsx";

export default function ArtistProfile() {
    const {id} = useParams();
    const [artist, setArtist] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadArtistDetail() {
            try {
                const artistData = await fetchArtistDetail(id);
                setArtist(artistData);

                const albumsData = await fetchArtistAlbums(id, 5)
                setAlbums(albumsData)

                const tracksData = await fetchArtistTracks(id, 9);
                setTracks(tracksData)
            } catch (error) {
                console.error('Error loading artist detail:', error);
                setError(error.message);
            }
        }
        loadArtistDetail();
    }, [id])

    useEffect(() => {
        if (error) {
            console.error('ArtistProfile error:', error);
        }
    }, [error]);

    if (!artist) return null;

    const fullName = `${artist.first_name} ${artist.last_name}`.trim();

    return (
        <section className="artist-profile section container">
            <Sidebar />
            <div className="artist-profile__inner section__inner">
                <HeaderSmall />
                <Card
                    type="artist"
                    image={artist.avatar || avatar}
                    author={artist}
                    fullName={fullName}
                />
                <SectionBlock className='tracks' title='Tracks' link={`/artist/${id}/tracks`}>
                    <TrackList tracks={tracks} className='chart__list' />
                </SectionBlock>

                <SectionBlock className='albums' title='Albums' link={`/artist/${id}/albums`}>
                    <AlbumList albums={albums} className='new-releases__list section__block-last' />
                </SectionBlock>


            </div>
        </section>
    )
}