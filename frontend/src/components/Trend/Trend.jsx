import ButtonLink from "../Button/ButtonLink.jsx";
import avatar from '../../assets/images/trend/avatar.png'
import favoriteIcon from '../../assets/images/trend/favorite.svg'
import favoriteFullIcon from '../../assets/images/trend/favorite-full.svg'
import play from '../../assets/images/trend/play.svg'
import {usePlayer} from "../../context/PlayerContext.jsx";
import { useState, useEffect } from "react";
import {addTrackToFavorites, removeTrackFromFavorites, addAlbumToFavorites, removeAlbumFromFavorites} from "../../api/musicAPI.js";



export default function Trend({
    id,
    isAlbum = false,
    title,
    album,
    cover,
    artist,
    audio_file,
    is_favorite,
}) {

    const { currentTrack, setCurrentTrack, isPlaying, playTrack } = usePlayer();
    const [favorite, setFavorite] = useState(is_favorite || false);

    useEffect(() => {
        setFavorite(is_favorite || false);
    }, [is_favorite]);

    useEffect(() => {
        if (!isAlbum && currentTrack?.id === id) {
            setFavorite(currentTrack.is_favorite || false);
        }
    }, [currentTrack?.id, currentTrack?.is_favorite, id, isAlbum]);

    const handleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!id) return;

        try {
            if (isAlbum) {
                // Лайк для альбома
                if (favorite) {
                    await removeAlbumFromFavorites(id);
                    setFavorite(false);
                } else {
                    await addAlbumToFavorites(id);
                    setFavorite(true);
                }
            } else {
                // Лайк для трека
                if (favorite) {
                    await removeTrackFromFavorites(id);
                    setFavorite(false);
                    if (currentTrack?.id === id) {
                        setCurrentTrack({ ...currentTrack, is_favorite: false });
                    }
                } else {
                    await addTrackToFavorites(id);
                    setFavorite(true);
                    if (currentTrack?.id === id) {
                        setCurrentTrack({ ...currentTrack, is_favorite: true });
                    }
                }
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

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
                    onClick={() => !isAlbum && playTrack({ id, title, album, audio_file, is_favorite })}
                    className="trend__button"><img src={play} width={32} height={32} loading='lazy' alt="" className="trend__button-icon"/> Play</ButtonLink>
                <ButtonLink onClick={handleFavorite} className="trend__favorite">
                    {favorite ?
                        <img src={favoriteFullIcon} width={24} height={24} loading='lazy' alt="" className="trend__favorite-icon"/> :
                        <img src={favoriteIcon} width={24} height={24} loading='lazy' alt="" className="trend__favorite-icon"/>
                    }
                </ButtonLink>
            </div>
            <img src={cov} width={216} height={216} loading='lazy' alt="" className={`trend__image ${isAlbum ? "trend__image--album" : ""}`}/>
            </div>
        </div>
    )
}