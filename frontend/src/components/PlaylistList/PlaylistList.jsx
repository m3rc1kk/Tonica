import Playlist from "../Playlist/Playlist.jsx";
import ButtonLink from "../Button/ButtonLink.jsx";

export default function PlaylistList({playlists = [], className='', onCreatePlaylist, classNameItem=''}) {
    const handleCreatePlaylist = () => {
        if (onCreatePlaylist) {
            onCreatePlaylist();
        }
    };

    return (
        <ul className={`playlist__list ${className}`}>
            <li className="playlist__item playlist__item-button">
                <ButtonLink
                    to="/playlist/create"
                    onClick={handleCreatePlaylist}
                    className="playlist__create-button"
                >
                    <div className="playlist__create-body">
                        <span className="playlist__create-icon">+</span>
                        <span className="playlist__create-text">New Playlist</span>
                    </div>
                </ButtonLink>
            </li>
            {playlists.map((playlist) => (
                <li key={playlist.id} className={`playlist__item ${classNameItem}`}>
                    <Playlist
                        playlist={playlist}
                    />
                </li>
            ))}
        </ul>
    )

}