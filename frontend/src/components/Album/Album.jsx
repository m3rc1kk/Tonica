import play from "../../assets/images/trend/play.svg";
import ButtonLink from "../Button/ButtonLink.jsx";
import favoriteIcon from '../../assets/images/artist-profile/favorite.svg';
import favoriteFullIcon from '../../assets/images/artist-profile/favorite-full.svg';
import { useState, useEffect } from "react";
import pinIcon from '../../assets/images/artist-profile/pin.svg';
import pinFullIcon from '../../assets/images/artist-profile/pin-full.svg';
import {
    addAlbumToFavorites,
    removeAlbumFromFavorites,
    pinAlbum,
    unpinAlbum,
} from "../../api/musicAPI.js";
import { usePinned } from "../../context/PinnedContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { usePlayer } from "../../context/PlayerContext.jsx";
import { fetchAlbumDetail } from "../../api/musicAPI.js";



export default function Album({
    album,
                              })  {

    const [favorite, setFavorite] = useState(album?.is_favorite || false);
    const [isPinned, setIsPinned] = useState(false);
    const { refreshPinned, pinnedAlbums } = usePinned();
    const { showError } = useToast();
    const { playFromQueue } = usePlayer();

    useEffect(() => {
        setFavorite(album?.is_favorite || false);
    }, [album?.is_favorite]);

    useEffect(() => {
        setIsPinned(pinnedAlbums.some(a => a.id === album?.id));
    }, [pinnedAlbums, album?.id]);

    const handleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!album?.id) return;

        try {
            if (favorite) {
                await removeAlbumFromFavorites(album.id);
                setFavorite(false);
            } else {
                await addAlbumToFavorites(album.id);
                setFavorite(true);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const bgStyle = {
        backgroundImage: `url(${album.cover})`,
    }

    const handlePin = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!album?.id) return;

        try {
            if (isPinned) {
                await unpinAlbum(album.id);
                setIsPinned(false);
            } else {
                await pinAlbum(album.id);
                setIsPinned(true);
            }
            refreshPinned();
        } catch (error) {
            console.error('Error toggling pin:', error);
            showError(error.message || 'Error');
        }
    };

    const handlePlay = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!album?.id) return;

        try {
            const albumData = await fetchAlbumDetail(album.id);
            const tracks = albumData.tracks || [];
            if (tracks.length > 0) {
                playFromQueue(tracks, 0);
            }
        } catch (error) {
            console.error('Error loading album:', error);
            showError(error.message || 'Failed to load album');
        }
    };


    
    return (
        <div className="album" style={bgStyle}>
            <ButtonLink onClick={handleFavorite} className="album__favorite">
                {favorite ?
                    <img src={favoriteFullIcon} width={42} height={42} loading='lazy' alt="" className="album__favorite-icon"/> :
                    <img src={favoriteIcon} width={42} height={42} loading='lazy' alt="" className="album__favorite-icon"/>
                }
            </ButtonLink>
            <ButtonLink onClick={handlePin} className="album__pin">
                { isPinned ?
                    <img src={pinFullIcon} width={42} height={42} loading='lazy' alt="" className="album__pin-icon"/> :
                    <img src={pinIcon} width={42} height={42} loading='lazy' alt="" className="album__pin-icon"/>
                }
            </ButtonLink>
            <div className="album__inner">
                <div className="album__info">
                    <ButtonLink to={`/album/${album.id}`} className="album__title">{album.title}</ButtonLink>
                    {album.artist && (
                        <ButtonLink to={`/artist/${album.artist.id}`} className="album__author">
                            {album.artist.stage_name}
                        </ButtonLink>
                    )}

                </div>
                <ButtonLink onClick={handlePlay} className="album__button"><img src={play} width={42} height={42} loading='lazy' alt="" className="album__button-icon"/></ButtonLink>
            </div>
        </div>
    )
}