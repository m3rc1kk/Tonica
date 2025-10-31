import play from "../../assets/images/trend/play.svg";
import ButtonLink from "../Button/ButtonLink.jsx";

export default function Album()  {
    return (
        <div className="album">
            <div className="album__inner">
                <div className="album__info">
                    <h2 className="album__title">Want you</h2>
                    <span className="album__author">lil Kidd</span>
                </div>
                <ButtonLink to={'/'} className="album__button"><img src={play} width={42} height={42} loading='lazy' alt="" className="album__button-icon"/></ButtonLink>
            </div>
        </div>
    )
}