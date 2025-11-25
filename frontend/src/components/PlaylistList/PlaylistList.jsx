import Playlist from "../Playlist/Playlist.jsx";

export default function PlaylistList({playlists = [], className=''}) {
    return (
        <ul className={`playlist__list ${className}`}>
            {playlists.map((playlist) => (
                <li key={playlist.id} className="playlist__item">
                    <Playlist
                        playlist={playlist}
                    />
                </li>
            ))}
        </ul>
    )

}