import play from "../../assets/images/trend/play.svg";
import ButtonLink from "../Button/ButtonLink.jsx";
import favoriteIcon from '../../assets/images/artist-profile/favorite.svg';
import favoriteFullIcon from '../../assets/images/artist-profile/favorite-full.svg';




export default function Album({
    playlist,
})  {

    const bgStyle = {
        backgroundImage: `url(${playlist.cover})`,
    }

    return (
        <div className="playlist" style={bgStyle}>
            {/*<ButtonLink onClick={} className="album__favorite">*/}
            {/*    {favorite ?*/}
            {/*        <img src={favoriteFullIcon} width={42} height={42} loading='lazy' alt="" className="album__favorite-icon"/> :*/}
            {/*        <img src={favoriteIcon} width={42} height={42} loading='lazy' alt="" className="album__favorite-icon"/>*/}
            {/*    }*/}
            {/*</ButtonLink>*/}
            <div className="playlist__inner">
                <div className="playlist__info">
                    <ButtonLink to={`/playlist/${playlist.id}`} className="playlist__title">{playlist.title}</ButtonLink>
                    <span className="playlist__tracks-count">{playlist.tracks_count} tracks</span>

                </div>
                <ButtonLink to={`/`} className="album__button"><img src={play} width={42} height={42} loading='lazy' alt="" className="album__button-icon"/></ButtonLink>
            </div>
        </div>
    )
}