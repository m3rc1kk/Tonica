import ButtonLink from "../Button/ButtonLink.jsx";
import favoriteIcon from '../../assets/images/track/favorite.svg'
import favoriteFullIcon from '../../assets/images/track/favorite-full.svg'
import settings from '../../assets/images/track/settings.svg'
import { usePlayer } from '../../context/PlayerContext.jsx';
import { useTrackSettings } from '../../context/TrackSettingsContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useState, useEffect, useRef } from "react";
import { addTrackToFavorites, removeTrackFromFavorites, fetchPlaylists, addTrackToPlaylist, removeTrackFromPlaylist } from "../../api/musicAPI.js";



export default function Track({
    id,
    chartPosition=null,
    title,
    album,
    audio_file,
    is_favorite,
    className='',
    playlistId=null,
    onTrackRemoved=null
}) {

    const { currentTrack, setCurrentTrack, isPlaying, playTrack } = usePlayer();
    const { openTrackId, openTrackSettings, closeTrackSettings, isTrackOpen } = useTrackSettings();
    const { showSuccess, showError } = useToast();
    const [favorite, setFavorite] = useState(is_favorite || false);
    const [showAddToPlaylistMenu, setShowAddToPlaylistMenu] = useState(false);
    const [showPlaylistsList, setShowPlaylistsList] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(false);
    const popupRef = useRef(null);

    const isThisTrackOpen = isTrackOpen(id);


    useEffect(() => {
        setFavorite(is_favorite || false);
    }, [is_favorite]);

    useEffect(() => {
        if (currentTrack?.id === id) {
            setFavorite(currentTrack.is_favorite || false);
        }
    }, [currentTrack?.id, currentTrack?.is_favorite, id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowAddToPlaylistMenu(false);
                setShowPlaylistsList(false);
                closeTrackSettings();
            }
        };

        if (isThisTrackOpen && (showAddToPlaylistMenu || showPlaylistsList)) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isThisTrackOpen, showAddToPlaylistMenu, showPlaylistsList, closeTrackSettings]);

    useEffect(() => {
        if (!isThisTrackOpen) {
            setShowAddToPlaylistMenu(false);
            setShowPlaylistsList(false);
        }
    }, [isThisTrackOpen]);

    const handleSettingsClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (showPlaylistsList) {
            setShowPlaylistsList(false);
            setShowAddToPlaylistMenu(false);
            closeTrackSettings();
            return;
        }

        if (showAddToPlaylistMenu) {
            setShowAddToPlaylistMenu(false);
            closeTrackSettings();
            return;
        }

        openTrackSettings(id);
        setShowAddToPlaylistMenu(true);
        setShowPlaylistsList(false);
    }

    const handleShowPlaylists = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        setLoading(true);
        try {
            const playlistsData = await fetchPlaylists(100);
            setPlaylists(Array.isArray(playlistsData) ? playlistsData : []);
            setShowAddToPlaylistMenu(false);
            setShowPlaylistsList(true);
        } catch (error) {
            console.error('Error fetching playlists:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleAddToPlaylist = async (playlistId, e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await addTrackToPlaylist(playlistId, id);
            const playlist = playlists.find(p => p.id === playlistId);
            const playlistName = playlist?.title || 'playlist';
            showSuccess(`Track added to ${playlistName}`);
            setShowPlaylistsList(false);
            setShowAddToPlaylistMenu(false);
            closeTrackSettings();
        } catch (error) {
            console.error('Error adding track to playlist:', error);
            const errorMessage = error.message || '';
            
            // Проверяем, если трек уже есть в плейлисте
            if (errorMessage.toLowerCase().includes('already exists') || 
                errorMessage.toLowerCase().includes('already') ||
                errorMessage.toLowerCase().includes('уже существует')) {
                const playlist = playlists.find(p => p.id === playlistId);
                const playlistName = playlist?.title || 'playlist';
                showError(`Track is already in ${playlistName}`);
            } else {
                showError(errorMessage || 'Failed to add track to playlist');
            }
        }
    }

    const handleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            if (favorite) {
                await removeTrackFromFavorites(id)
                setFavorite(false);
                if (currentTrack?.id === id) {
                    setCurrentTrack({ ...currentTrack, is_favorite: false });
                }
            } else {
                await addTrackToFavorites(id)
                setFavorite(true);
                if (currentTrack?.id === id) {
                    setCurrentTrack({ ...currentTrack, is_favorite: true });
                }
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    }

    const handleRemoveFromPlaylist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!playlistId) return;

        try {
            await removeTrackFromPlaylist(playlistId, id);
            showSuccess('Track removed from playlist');
            setShowAddToPlaylistMenu(false);
            closeTrackSettings();
            if (onTrackRemoved) {
                onTrackRemoved(id);
            }
        } catch (error) {
            console.error('Error removing track from playlist:', error);
            showError(error.message || 'Failed to remove track from playlist');
        }
    }

    const trackCover = album?.cover
    const trackAuthor = album?.artist.stage_name

    return (
        <div className={`track ${className}`}>
            <div className="track__inner">
                <div className="track__info">
                    <ButtonLink
                        onClick={() => playTrack({ id, title, album, audio_file, is_favorite })}
                        className="track__image-link button__link">
                        <img src={trackCover} height={44} width={44} loading='lazy' alt="" className="track__image"/>
                    </ButtonLink>
                    <div className="track__body">
                        <h3 className="track__title">
                            {title}
                            {chartPosition !== null && (
                                <span className="track__chart">{chartPosition} place in charts</span>
                            )}
                        </h3>
                        <ButtonLink to={`/artist/${album?.artist.id}`} className="track__author">{trackAuthor}</ButtonLink>
                    </div>
                </div>
                <div className="track__control">
                    <ButtonLink onClick={handleFavorite} className="track__favorite track__control-button">
                        { favorite ?
                            <img src={favoriteFullIcon} width={24} height={24} loading='lazy' alt="" className="track__favorite-icon"/> :
                            <img src={favoriteIcon} width={24} height={24} loading='lazy' alt="" className="track__favorite-icon"/>
                        }
                    </ButtonLink>
                    <div className="track__settings-wrapper" ref={popupRef}>
                        <ButtonLink onClick={handleSettingsClick} className="track__settings track__control-button">
                            <img src={settings} width={24} height={24} loading='lazy' alt="" className="track__settings-icon"/>
                        </ButtonLink>
                        {isThisTrackOpen && showAddToPlaylistMenu && (
                            <div className="track__popup">
                                {playlistId && (
                                    <button
                                        onClick={handleRemoveFromPlaylist}
                                        className="track__popup-button"
                                    >
                                        Remove
                                    </button>
                                )}
                                <button
                                    onClick={handleShowPlaylists}
                                    className="track__popup-button"
                                >
                                    Add to playlist
                                </button>
                            </div>
                        )}

                        {isThisTrackOpen && showPlaylistsList && (
                            <div className="track__playlists-popup">
                                {loading ? (
                                    <div className="track__playlists-loading">Loading...</div>
                                ) : playlists.length === 0 ? (
                                    <div className="track__playlists-empty">No playlists found</div>
                                ) : (
                                    <ul className="track__playlists-list">
                                        {playlists.map(playlist => (
                                            <li key={playlist.id} className="track__playlists-item">
                                                <button
                                                    onClick={(e) => handleAddToPlaylist(playlist.id, e)}
                                                    className="track__playlists-button"
                                                >
                                                    {playlist.title}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}