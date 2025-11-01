import Artist from "../Artist/Artist.jsx";

export default function ArtistList({artists = [], className=''}) {
    return (
        <ul className={`artist__list ${className}`}>
            {artists.map((artist) => (
                <li key={artist.id} className="artist__item">
                    <Artist
                        {...artist}
                    />
                </li>
            ))}
        </ul>
    )

}