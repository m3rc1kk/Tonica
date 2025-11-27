import ButtonLink from "../Button/ButtonLink.jsx";


export default function Genre({id, title, slug})  {
    return (
        <ButtonLink to={`/genres/${slug || id}`} className="genre">
            <div className="genre__inner">
                <h2 className="genre__title">{title || 'Genre'}</h2>
            </div>
        </ButtonLink>
    )
}