import ButtonLink from "../Button/ButtonLink.jsx";
import trackImage from '../../assets/images/track/track-image.png'
import favorite from '../../assets/images/track/favorite.svg'
import settings from '../../assets/images/track/settings.svg'

export default function Track({
    id,
    chartPosition=null,
    title,
    album_cover,
    artist_name,
}) {
    return (
        <div className="track">
            <div className="track__inner">
                <div className="track__info">
                    <ButtonLink to={'/'} className="track__image-link">
                        <img src={album_cover} height={44} width={44} loading='lazy' alt="" className="track__image"/>
                    </ButtonLink>
                    <div className="track__body">
                        <h3 className="track__title">
                            {title}
                            {chartPosition !== null && (
                                <span className="track__chart">{chartPosition} place in charts</span>
                            )}
                        </h3>
                        <ButtonLink to={'/'} className="track__author">{artist_name}</ButtonLink>
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