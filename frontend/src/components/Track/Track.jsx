import ButtonLink from "../Button/ButtonLink.jsx";
import favoriteIcon from '../../assets/images/track/favorite.svg'
import favoriteFullIcon from '../../assets/images/track/favorite-full.svg'
import settings from '../../assets/images/track/settings.svg'
import { usePlayer } from '../../context/PlayerContext.jsx';
import { useState, useEffect } from "react";
import {addTrackToFavorites, removeTrackFromFavorites} from "../../api/musicAPI.js";

export default function Track({
    id,
    chartPosition=null,
    title,
    album,
    audio_file,
    is_favorite,
    className=''
}) {

    const { currentTrack, setCurrentTrack, isPlaying, playTrack } = usePlayer();
    const [favorite, setFavorite] = useState(is_favorite || false);


    useEffect(() => {
        setFavorite(is_favorite || false);
    }, [is_favorite]);

    useEffect(() => {
        if (currentTrack?.id === id) {
            setFavorite(currentTrack.is_favorite || false);
        }
    }, [currentTrack?.id, currentTrack?.is_favorite, id]);

    const handleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            if (favorite) {
                await removeTrackFromFavorites(id)
                setFavorite(false);
                if (currentTrack?.id === id) {
                    setCurrentTrack({ ...currentTrack, is_favorite: false });
                }
            } else {
                await addTrackToFavorites(id)
                setFavorite(true);
                if (currentTrack?.id === id) {
                    setCurrentTrack({ ...currentTrack, is_favorite: true });
                }
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    }

    const trackCover = album?.cover
    const trackAuthor = album?.artist.stage_name

    return (
        <div className={`track ${className}`}>
            <div className="track__inner">
                <div className="track__info">
                    <ButtonLink
                        onClick={() => playTrack({ id, title, album, audio_file, is_favorite })}
                        className="track__image-link button__link">
                        <img src={trackCover} height={44} width={44} loading='lazy' alt="" className="track__image"/>
                    </ButtonLink>
                    <div className="track__body">
                        <h3 className="track__title">
                            {title}
                            {chartPosition !== null && (
                                <span className="track__chart">{chartPosition} place in charts</span>
                            )}
                        </h3>
                        <ButtonLink to={`/artist/${album.artist.id}`} className="track__author">{trackAuthor}</ButtonLink>
                    </div>
                </div>
                <div className="track__control">
                    <ButtonLink onClick={handleFavorite} className="track__favorite track__control-button">
                        { favorite ?
                            <img src={favoriteFullIcon} width={24} height={24} loading='lazy' alt="" className="track__favorite-icon"/> :
                            <img src={favoriteIcon} width={24} height={24} loading='lazy' alt="" className="track__favorite-icon"/>
                        }

                    </ButtonLink>
                    <ButtonLink to={'/'} className="track__settings track__control-button">
                        <img src={settings} width={24} height={24} loading='lazy' alt="" className="track__settings-icon"/>
                    </ButtonLink>
                </div>
            </div>
        </div>
    )
}