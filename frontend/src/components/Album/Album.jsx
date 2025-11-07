import play from "../../assets/images/trend/play.svg";
import ButtonLink from "../Button/ButtonLink.jsx";


export default function Album({
    album,
                              })  {

    const bgStyle = {
        backgroundImage: `url(${album.cover})`,
    }

    
    return (
        <div className="album" style={bgStyle}>
            <div className="album__inner">
                <div className="album__info">
                    <ButtonLink to={`/album/${album.id}`} className="album__title">{album.title}</ButtonLink>
                    {album.artist && (
                        <ButtonLink to={`/artist/${album.artist.id}`} className="album__author">
                            {album.artist.stage_name}
                        </ButtonLink>
                    )}

                </div>
                <ButtonLink to={`/`} className="album__button"><img src={play} width={42} height={42} loading='lazy' alt="" className="album__button-icon"/></ButtonLink>
            </div>
        </div>
    )
}