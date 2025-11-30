import ButtonLink from "../Button/ButtonLink.jsx";
import play from "../../assets/images/artist-profile/play.svg";
import favoriteIcon from "../../assets/images/artist-profile/favorite.svg";
import favoriteFullIcon from "../../assets/images/artist-profile/favorite-full.svg";
import pinIcon from '../../assets/images/artist-profile/pin.svg';
import pinFullIcon from '../../assets/images/artist-profile/pin-full.svg';
import settings from "../../assets/images/artist-profile/settings.svg";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    addArtistToFavorites,
    removeArtistFromFavorites,
    addAlbumToFavorites,
    removeAlbumFromFavorites,
    pinArtist,
    unpinArtist,
    pinAlbum,
    unpinAlbum,
    pinPlaylist,
    unpinPlaylist,
    deletePlaylist,
} from "../../api/musicAPI.js";

import { usePinned } from "../../context/PinnedContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { usePlayer } from "../../context/PlayerContext.jsx";
import { fetchPlaylistDetail, fetchAlbumDetail } from "../../api/musicAPI.js";


export default function Card({
    type = 'artist',
    albumType,
    image,
    title,
    author,
    releaseDate,
    trackCount,
    className,
    fullName,
    id,
    is_favorite
                             }) {

    const [favorite, setFavorite] = useState(
        type === 'artist' ? (author?.is_favorite || false) : (is_favorite || false)
    );
    const [isPinned, setIsPinned] = useState(false);
    const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
    const { refreshPinned, pinnedArtists, pinnedAlbums, pinnedPlaylists } = usePinned();
    const { showError, showSuccess } = useToast();
    const { playFromQueue } = usePlayer();
    const navigate = useNavigate();
    const menuRef = useRef(null);

    useEffect(() => {
        if (type === 'artist' && author?.id) {
            setIsPinned(pinnedArtists.some(a => a.id === author.id));
        } else if (type === 'album' && id) {
            setIsPinned(pinnedAlbums.some(a => a.id === id));
        } else if (type === 'playlist' && id) {
            setIsPinned(pinnedPlaylists.some(p => p.id === id));
        }
    }, [type, author?.id, id, pinnedArtists, pinnedAlbums, pinnedPlaylists]);

    useEffect(() => {
        if (type === 'artist') {
            setFavorite(author?.is_favorite || false);
        } else if (type === 'album') {
            setFavorite(is_favorite || false);
        }
    }, [author?.is_favorite, is_favorite, type]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowPlaylistMenu(false);
            }
        };

        if (showPlaylistMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPlaylistMenu]);

    const handleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (type === 'artist') {
            if (!author?.id) return;
            try {
                if (favorite) {
                    await removeArtistFromFavorites(author.id);
                    setFavorite(false);
                } else {
                    await addArtistToFavorites(author.id);
                    setFavorite(true);
                }
            } catch (error) {
                console.error('Error toggling favorite:', error);
            }
        } else if (type === 'album') {
            if (!id) return;
            try {
                if (favorite) {
                    await removeAlbumFromFavorites(id);
                    setFavorite(false);
                } else {
                    await addAlbumToFavorites(id);
                    setFavorite(true);
                }
            } catch (error) {
                console.error('Error toggling favorite:', error);
            }
        }
    };

    const handlePin = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (type === 'artist') {
            if (!author?.id) return;
            try {
                if (isPinned) {
                    await unpinArtist(author.id);
                    setIsPinned(false);
                } else {
                    await pinArtist(author.id);
                    setIsPinned(true);
                }
                refreshPinned();
            } catch (error) {
                console.error('Error toggling pin:', error);
                showError(error.message || 'Не удалось закрепить артиста');
            }
        } else if (type === 'album') {
            if (!id) return;
            try {
                if (isPinned) {
                    await unpinAlbum(id);
                    setIsPinned(false);
                } else {
                    await pinAlbum(id);
                    setIsPinned(true);
                }
                refreshPinned();
            } catch (error) {
                console.error('Error toggling pin:', error);
                showError(error.message || 'Error');
            }
        } else if (type === 'playlist') {
            if (!id) return;
            try {
                if (isPinned) {
                    await unpinPlaylist(id);
                    setIsPinned(false);
                } else {
                    await pinPlaylist(id);
                    setIsPinned(true);
                }
                refreshPinned();
            } catch (error) {
                console.error('Error toggling pin:', error);
                showError(error.message || 'Не удалось закрепить плейлист');
            }
        }
    };

    const handleSettingsClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (type === 'playlist') {
            setShowPlaylistMenu(!showPlaylistMenu);
        }
    };

    const handleEditPlaylist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (id) {
            navigate(`/playlist/${id}/update`);
        }
        setShowPlaylistMenu(false);
    };

    const handleDeletePlaylist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!id) return;

        if (window.confirm('Are you sure you want to delete this playlist?')) {
            try {
                await deletePlaylist(id);
                showSuccess('Playlist deleted successfully');
                setShowPlaylistMenu(false);
                navigate('/library');
            } catch (error) {
                console.error('Error deleting playlist:', error);
                showError(error.message || 'Failed to delete playlist');
            }
        }
    };

    const handlePlay = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (type === 'playlist') {
            if (!id) return;
            try {
                const playlistData = await fetchPlaylistDetail(id);
                const tracks = playlistData.playlist_tracks?.map(pt => pt.track) || [];
                if (tracks.length > 0) {
                    playFromQueue(tracks, 0);
                }
            } catch (error) {
                console.error('Error loading playlist:', error);
                showError(error.message || 'Failed to load playlist');
            }
        } else if (type === 'album') {
            if (!id) return;
            try {
                const albumData = await fetchAlbumDetail(id);
                const tracks = albumData.tracks || [];
                if (tracks.length > 0) {
                    playFromQueue(tracks, 0);
                }
            } catch (error) {
                console.error('Error loading album:', error);
                showError(error.message || 'Failed to load album');
            }
        }
    };

    return (
        <div className="card__body">
            <img src={image} width={300} height={300} loading='lazy' alt="" className="card__avatar"/>
            <div className="card__info">
                {type === "artist" &&
                    <span className="card__fullname card__subtitle">{fullName}</span>
                }

                { type === "album" &&
                    <span className="card__artist card__subtitle"><img src={author.avatar} loading='lazy' width={24} height={24} alt="" className="card__artist-avatar"/> <ButtonLink to={'/'} className="card__artist-name">{author.stage_name}</ButtonLink> <span className="card__artist-type">• {albumType.charAt(0).toUpperCase() + albumType.slice(1)}</span> </span>
                }

                { type === "playlist" &&
                    <span className="card__playlist card__subtitle">Your playlist</span>
                }

                { type === 'artist' ?
                    <h1 className="card__stage-name title--accent">{ author.stage_name }</h1> :
                    <h1 className="card__stage-name card__title title--accent">{ title }</h1>
                }

                { type === 'artist' ?
                    <span className="card__listeners">
                        <span className="card__listeners--accent">
                            {author?.plays_count_30_days !== undefined && author?.plays_count_30_days !== null
                                ? author.plays_count_30_days.toLocaleString('en-US')
                                : '0'
                            }
                        </span> listeners <span className="card__listeners--hidden">per month</span>
                    </span> :
                    <div className="card__album-info">
                        <span className="card__release-date">{new Date(releaseDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                        <span className="card__track-count">{trackCount} tracks</span>
                    </div>
                }

                <div className="card__buttons">
                    <ButtonLink onClick={handlePlay} className="card__play card__button">
                        <img src={play} width={52} height={52} loading='lazy' alt="" className="card__button-icon card__button-icon--play"/>
                    </ButtonLink>
                    {(type === 'artist' || type === 'album') && (
                        <ButtonLink onClick={handleFavorite} className="card__favorite card__button">
                            {favorite ?
                                <img src={favoriteFullIcon} width={52} height={52} loading='lazy' alt="" className="card__button-icon"/> :
                                <img src={favoriteIcon} width={52} height={52} loading='lazy' alt="" className="card__button-icon"/>
                            }
                        </ButtonLink>
                    )}

                    {(type === 'artist' || type === 'album' || type === 'playlist') && (
                        <ButtonLink onClick={handlePin} className="card__pin card__button">
                            { isPinned ?
                                <img src={pinFullIcon} width={52} height={52} loading='lazy' alt="" className="card__button-icon"/> :
                                <img src={pinIcon} width={52} height={52} loading='lazy' alt="" className="card__button-icon"/>
                            }
                        </ButtonLink>
                    )}
                    <div className="card__settings-wrapper" ref={menuRef}>
                        {type === 'playlist' ? (
                            <ButtonLink onClick={handleSettingsClick} className="card__settings card__button">
                                <img src={settings} width={52} height={52} loading='lazy' alt="" className="card__button-icon"/>
                            </ButtonLink>
                        ) : (
                            <ButtonLink to={'/'} className="card__settings card__button">
                                <img src={settings} width={52} height={52} loading='lazy' alt="" className="card__button-icon"/>
                            </ButtonLink>
                        )}
                        {type === 'playlist' && showPlaylistMenu && (
                            <div className="card__popup">
                                <button
                                    onClick={handleEditPlaylist}
                                    className="card__popup-button"
                                >
                                    Edit playlist
                                </button>
                                <button
                                    onClick={handleDeletePlaylist}
                                    className="card__popup-button"
                                >
                                    Delete playlist
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}