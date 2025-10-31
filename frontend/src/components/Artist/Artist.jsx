import ButtonLink from "../Button/ButtonLink.jsx";

export default function Artist()  {
    return (
        <div className="artist">
            <div className="artist__inner">
                <div className="artist__info">
                    <ButtonLink to={'/'} className="artist__name">Pepel Nahudi</ButtonLink>
                    <span className="artist__listeners"><span className="artist__listeners--accent">+1.123.272</span> plays in the last month</span>
                </div>
            </div>
        </div>
    )
}