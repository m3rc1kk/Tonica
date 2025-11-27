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
                {/*<div className="artist-profile__body">*/}
                {/*    <img src={artist.avatar || avatar} width={300} height={300} loading='lazy' alt="" className="artist-profile__avatar"/>*/}
                {/*    <div className="artist-profile__info">*/}
                {/*        <span className="artist-profile__fullname ">{fullName}</span>*/}
                {/*        <h1 className="artist-profile__stage-name title--accent">{ artist.stage_name }</h1>*/}
                {/*        <span className="artist-profile__listeners"><span className="artist-profile__listeners--accent">22.542.342</span>  listeners <span className="artist-profile__listeners--hidden">per month</span> </span>*/}
                {/*        <div className="artist-profile__buttons">*/}
                {/*            <ButtonLink to={'/'} className="artist-profile__play artist-profile__button">*/}
                {/*                <img src={play} width={52} height={52} loading='lazy' alt="" className="artist-profile__button-icon artist-profile__button-icon--play"/>*/}
                {/*            </ButtonLink>*/}
                {/*            <ButtonLink to={'/'} className="artist-profile__favorite artist-profile__button">*/}
                {/*                <img src={favorite} width={52} height={52} loading='lazy' alt="" className="artist-profile__button-icon"/>*/}
                {/*            </ButtonLink>*/}
                {/*            <ButtonLink to={'/'} className="artist-profile__pin artist-profile__button">*/}
                {/*                <img src={pin} width={52} height={52} loading='lazy' alt="" className="artist-profile__button-icon"/>*/}
                {/*            </ButtonLink>*/}
                {/*            <ButtonLink to={'/'} className="artist-profile__settings artist-profile__button">*/}
                {/*                <img src={settings} width={52} height={52} loading='lazy' alt="" className="artist-profile__button-icon"/>*/}
                {/*            </ButtonLink>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                <Card
                    type="artist"
                    image={artist.avatar || avatar}
                    author={artist}
                    fullName={fullName}
                />
                <SectionBlock className='tracks' title='Tracks' link={`/artist/${id}/tracks`}>
                    <TrackList tracks={tracks} className='charts__list' />
                </SectionBlock>

                <SectionBlock className='albums' title='Albums' link={`/artist/${id}/albums`}>
                    <AlbumList albums={albums} className='new-releases__list section__block-last' />
                </SectionBlock>


            </div>
        </section>
    )
}