import ButtonLink from "../../components/Button/ButtonLink.jsx";
import SectionBlock from "../../components/Section/SectionBlock.jsx";
import TrackList from "../../components/TrackList/TrackList.jsx";
import AlbumList from "../../components/AlbumList/AlbumList.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import HeaderSmall from "../../components/HeaderSmall/HeaderSmall.jsx";
import avatar from '../../assets/images/artist/pepel.webp'
import play from '../../assets/images/artist-profile/play.svg'
import favorite from '../../assets/images/artist-profile/favorite.svg'
import pin from '../../assets/images/artist-profile/pin.svg'
import settings from '../../assets/images/artist-profile/settings.svg'

import { useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import {fetchArtistAlbums, fetchArtistDetail, fetchArtistTracks, fetchNewReleases} from "../../api/musicAPI.js";

export default function ArtistProfile() {
    const {id} = useParams();
    const [artist, setArtist] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
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
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        loadArtistDetail();
    }, [id])

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const fullName = `${artist.first_name} ${artist.last_name}`.trim();

    return (
        <section className="artist-profile section container">
            <Sidebar />
            <div className="artist-profile__inner section__inner">
                <HeaderSmall />
                <div className="artist-profile__body">
                    <img src={artist.avatar || avatar} width={300} height={300} loading='lazy' alt="" className="artist-profile__avatar"/>
                    <div className="artist-profile__info">
                        <span className="artist-profile__fullname ">{fullName}</span>
                        <h1 className="artist-profile__stage-name title--accent">{ artist.stage_name }</h1>
                        <span className="artist-profile__listeners"><span className="artist-profile__listeners--accent">22.542.342</span>  listeners <span className="artist-profile__listeners--hidden">per month</span> </span>
                        <div className="artist-profile__buttons">
                            <ButtonLink to={'/'} className="artist-profile__play artist-profile__button">
                                <img src={play} width={52} height={52} loading='lazy' alt="" className="artist-profile__button-icon artist-profile__button-icon--play"/>
                            </ButtonLink>
                            <ButtonLink to={'/'} className="artist-profile__favorite artist-profile__button">
                                <img src={favorite} width={52} height={52} loading='lazy' alt="" className="artist-profile__button-icon"/>
                            </ButtonLink>
                            <ButtonLink to={'/'} className="artist-profile__pin artist-profile__button">
                                <img src={pin} width={52} height={52} loading='lazy' alt="" className="artist-profile__button-icon"/>
                            </ButtonLink>
                            <ButtonLink to={'/'} className="artist-profile__settings artist-profile__button">
                                <img src={settings} width={52} height={52} loading='lazy' alt="" className="artist-profile__button-icon"/>
                            </ButtonLink>
                        </div>
                    </div>
                </div>
                <SectionBlock className='tracks' title='Tracks'>
                    <TrackList tracks={tracks} className='charts__list' />
                </SectionBlock>

                <SectionBlock className='albums' title='Albums'>
                    <AlbumList albums={albums} className='new-releases__list section__block-last' />
                </SectionBlock>


            </div>
        </section>
    )
}