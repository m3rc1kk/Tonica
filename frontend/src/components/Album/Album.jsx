import play from "../../assets/images/trend/play.svg";
import ButtonLink from "../Button/ButtonLink.jsx";


export default function Album({
    id,
    title,
    cover,
    artist
                              })  {

    const bgStyle = {
        backgroundImage: `url(${cover})`,
    }

    
    return (
        <div className="album" style={bgStyle}>
            <div className="album__inner">
                <div className="album__info">
                    <ButtonLink to={'/'} className="album__title">{title}</ButtonLink>
                    {artist && (
                        <ButtonLink to={`/artist/${artist.id}`} className="album__author">
                            {artist.stage_name}
                        </ButtonLink>
                    )}

                </div>
                <ButtonLink to={'/'} className="album__button"><img src={play} width={42} height={42} loading='lazy' alt="" className="album__button-icon"/></ButtonLink>
            </div>
        </div>
    )
}