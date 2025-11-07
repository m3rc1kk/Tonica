import avatar from "../../assets/images/artist/pepel.webp";
import ButtonLink from "../Button/ButtonLink.jsx";
import play from "../../assets/images/artist-profile/play.svg";
import favorite from "../../assets/images/artist-profile/favorite.svg";
import pin from "../../assets/images/artist-profile/pin.svg";
import settings from "../../assets/images/artist-profile/settings.svg";

export default function Card({
    type = 'artist', // artist | playlist | album
    albumType,
    image,
    title,
    author,
    releaseDate,
    trackCount,
    className,
    fullName
                             }) {
    return (
        <div className="card__body">
            <img src={image} width={300} height={300} loading='lazy' alt="" className="card__avatar"/>
            <div className="card__info">
                {type === "artist" &&
                    <span className="card__fullname card__subtitle">{fullName}</span>
                }

                { type === "album" &&
                    <span className="card__artist card__subtitle"><img src={author.avatar} loading='lazy' width={24} height={24} alt="" className="card__artist-avatar"/> <ButtonLink to={'/'} className="card__artist-name">{author.stage_name}</ButtonLink> <span className="card__artist-type">• {albumType}</span> </span>
                }

                { type === "playlist" &&
                    <span className="card__playlist card__subtitle">Your playlist</span>
                }

                { type === 'artist' ?
                    <h1 className="card__stage-name title--accent">{ author.stage_name }</h1> :
                    <h1 className="card__stage-name card__title title--accent">{ title }</h1>
                }

                { type === 'artist' ?
                    <span className="card__listeners"><span className="card__listeners--accent">22.542.342</span>  listeners <span className="card__listeners--hidden">per month</span> </span> :
                    <div className="card__album-info">
                        <span className="card__release-date">Release: {releaseDate}</span>
                        <span className="card__track-count">{trackCount} tracks</span>
                    </div>
                }

                <div className="card__buttons">
                    <ButtonLink to={'/'} className="card__play card__button">
                        <img src={play} width={52} height={52} loading='lazy' alt="" className="card__button-icon card__button-icon--play"/>
                    </ButtonLink>
                    <ButtonLink to={'/'} className="card__favorite card__button">
                        <img src={favorite} width={52} height={52} loading='lazy' alt="" className="card__button-icon"/>
                    </ButtonLink>
                    <ButtonLink to={'/'} className="card__pin card__button">
                        <img src={pin} width={52} height={52} loading='lazy' alt="" className="card__button-icon"/>
                    </ButtonLink>
                    <ButtonLink to={'/'} className="card__settings card__button">
                        <img src={settings} width={52} height={52} loading='lazy' alt="" className="card__button-icon"/>
                    </ButtonLink>
                </div>
            </div>
        </div>
    )
}