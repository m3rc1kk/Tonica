import ButtonLink from "../Button/ButtonLink.jsx";
import avatar from '../../assets/images/trend/avatar.png'
import favorite from '../../assets/images/trend/favorite.svg'
import album from '../../assets/images/trend/album.png'
import play from '../../assets/images/trend/play.svg'
import {usePlayer} from "../../context/PlayerContext.jsx";



export default function Trend({
    id,
    isAlbum = false,
    title,
    album,
    cover,
    artist,
    audio_file
}) {

    const { currentTrack, isPlaying, playTrack } = usePlayer();

    const artistId = album?.artist?.id
    const artistName = isAlbum ? artist?.stage_name : album?.artist.stage_name
    const artistAvatar = isAlbum ? artist?.avatar : album?.artist.avatar
    const cov = isAlbum ? cover : album?.cover

    return (
        <div className={`trend ${isAlbum ? "trend--album" : ""}`}>
            <div className={`trend__inner ${isAlbum ? "trend__inner--album" : ""}`}>
            <div className={`trend__body ${isAlbum ? "trend__body--album" : ""}`}>
                <div className="trend__author">
                    <img src={artistAvatar || avatar} width={24} height={24} loading='lazy' alt="" className="trend__author-avatar"/>
                    <ButtonLink to={`/artist/${artistId}`} className={`trend__author-name ${isAlbum ? "trend__author-name--album" : ""}`}>{artistName}</ButtonLink>
                </div>
                {isAlbum ?
                    <ButtonLink to={`/album/${id}`} className={`trend__title title--accent ${isAlbum ? "trend__title--album" : ""}`}>{title}</ButtonLink> :
                    <ButtonLink to={`/album/${album?.id}`} className={`trend__title title--accent ${isAlbum ? "trend__title--album" : ""}`}>{title}</ButtonLink>
                }

                <div className={`trend__monthly-listeners ${isAlbum ? "trend__monthly-listeners--album" : ""}`}>
                    <p>564.034 monthly listeners </p>
                </div>
                <ButtonLink
                    onClick={() => playTrack({ id, title, album, audio_file })}
                    className="trend__button"><img src={play} width={32} height={32} loading='lazy' alt="" className="trend__button-icon"/> Play</ButtonLink>
                <ButtonLink to={'/'} className="trend__favorite">
                    <img src={favorite} width={24} height={24} loading='lazy' alt="" className="trend__favorite-icon"/>
                </ButtonLink>
            </div>
            <img src={cov} width={216} height={216} loading='lazy' alt="" className={`trend__image ${isAlbum ? "trend__image--album" : ""}`}/>
            </div>
        </div>
    )
}