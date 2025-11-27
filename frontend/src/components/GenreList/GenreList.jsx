import Genre from "../Genre/Genre.jsx";

export default function GenreList({genres = [], className=''}) {
    return (
        <ul className={`genre__list ${className}`}>
            {genres.map((genre) => (
                <li key={genre.id} className="genre__item">
                    <Genre
                        id={genre.id}
                        title={genre.title}
                        slug={genre.slug}
                    />
                </li>
            ))}
        </ul>
    )

}