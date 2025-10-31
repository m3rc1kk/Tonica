import ButtonLink from "../Button/ButtonLink.jsx";


export default function Genre()  {
    return (
        <ButtonLink to={'/'} className="genre">
            <div className="genre__inner">
                <h2 className="genre__title">Jazz / Blues</h2>
            </div>
        </ButtonLink>
    )
}