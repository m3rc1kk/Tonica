import ButtonLink from "../Button/ButtonLink.jsx";
import favorite from '../../assets/images/track/favorite.svg'
import settings from '../../assets/images/track/settings.svg'
import { usePlayer } from '../../context/PlayerContext.jsx';

export default function Track({
    id,
    chartPosition=null,
    title,
    album,
    audio_file,
    className=''
}) {

    const { currentTrack, isPlaying, playTrack } = usePlayer();


    const trackCover = album?.cover
    const trackAuthor = album?.artist.stage_name

    return (
        <div className={`track ${className}`}>
            <div className="track__inner">
                <div className="track__info">
                    <ButtonLink
                        onClick={() => playTrack({ id, title, album, audio_file })}
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
                    <ButtonLink to={'/'} className="track__favorite track__control-button">
                        <img src={favorite} width={24} height={24} loading='lazy' alt="" className="track__favorite-icon"/>
                    </ButtonLink>
                    <ButtonLink to={'/'} className="track__settings track__control-button">
                        <img src={settings} width={24} height={24} loading='lazy' alt="" className="track__settings-icon"/>
                    </ButtonLink>
                </div>
            </div>
        </div>
    )
}