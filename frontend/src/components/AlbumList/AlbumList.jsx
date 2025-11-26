import Album from "../Album/Album.jsx";

export default function AlbumList({albums = [], className='', classNameItem=''}) {
    return (
        <ul className={`album__list ${className}`}>
            {albums.map((album) => (
                <li key={album.id} className={`album__item ${classNameItem}`}>
                    <Album
                        album={album}

                    />
                </li>
            ))}
        </ul>
    )

}