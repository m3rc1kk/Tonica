import Album from "../Album/Album.jsx";

export default function AlbumList({albums = [], className=''}) {
    return (
        <ul className={`album__list ${className}`}>
            {albums.map((album) => (
                <li key={album.id} className="album__item">
                    <Album
                        id={album.id}
                    />
                </li>
            ))}
        </ul>
    )

}