import play from "../../assets/images/trend/play.svg";
import ButtonLink from "../Button/ButtonLink.jsx";
import { useState, useEffect } from "react";
import {
    pinPlaylist,
    unpinPlaylist,
} from "../../api/musicAPI.js";
import { usePinned } from "../../context/PinnedContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import pinIcon from '../../assets/images/artist-profile/pin.svg';
import pinFullIcon from '../../assets/images/artist-profile/pin-full.svg';

export default function Playlist({
                                     playlist,
                                 })  {
    const [isPinned, setIsPinned] = useState(false);
    const { refreshPinned, pinnedPlaylists } = usePinned();
    const { showError } = useToast();

    useEffect(() => {
        setIsPinned(pinnedPlaylists.some(p => p.id === playlist?.id));
    }, [pinnedPlaylists, playlist?.id]);

    const handlePin = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!playlist?.id) return;

        try {
            if (isPinned) {
                await unpinPlaylist(playlist.id);
                setIsPinned(false);
            } else {
                await pinPlaylist(playlist.id);
                setIsPinned(true);
            }
            refreshPinned();
        } catch (error) {
            console.error('Error toggling pin:', error);
            showError(error.message || 'Не удалось закрепить плейлист');
        }
    };

    const bgStyle = {
        backgroundImage: `url(${playlist.cover})`,
    }

    return (
        <div className="playlist" style={bgStyle}>
            <ButtonLink onClick={handlePin} className="playlist__pin">
                { isPinned ?
                    <img src={pinFullIcon} width={42} height={42} loading='lazy' alt="" className="playlist__pin-icon"/> :
                    <img src={pinIcon} width={42} height={42} loading='lazy' alt="" className="playlist__pin-icon"/>
                }
            </ButtonLink>
            <div className="playlist__inner">
                <div className="playlist__info">
                    <ButtonLink to={`/playlist/${playlist.id}`} className="playlist__title">{playlist.title}</ButtonLink>
                    <span className="playlist__tracks-count">{playlist.tracks_count} tracks</span>
                </div>
                <ButtonLink to={`/`} className="album__button"><img src={play} width={42} height={42} loading='lazy' alt="" className="album__button-icon"/></ButtonLink>
            </div>
        </div>
    )
}