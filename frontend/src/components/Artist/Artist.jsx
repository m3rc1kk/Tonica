import ButtonLink from "../Button/ButtonLink.jsx";
import defaultAvatar from '../../assets/images/artist/pepel.webp'

export default function Artist({
    id,
    stage_name,
    avatar,
                               })  {

    const bgStyle = {
        backgroundImage: `url(${avatar || defaultAvatar})`,
    }

    return (
        <div className="artist" style={bgStyle}>
            <div className="artist__inner">
                <div className="artist__info">
                    <ButtonLink to={`/artist/${id}`} className="artist__name">{stage_name}</ButtonLink>
                    <span className="artist__listeners"><span className="artist__listeners--accent">+1.123.272</span> plays in the last month</span>
                </div>
            </div>
        </div>
    )
}