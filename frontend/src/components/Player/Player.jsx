import { usePlayer } from "../../context/PlayerContext";
import ButtonLink from "../Button/ButtonLink.jsx";
import play from '../../assets/images/player/play.svg'
import pause from '../../assets/images/player/pause.svg'
import prev from '../../assets/images/player/prev.svg'
import next from '../../assets/images/player/next.svg'
import settings from '../../assets/images/player/settings.svg'
import volumeIcon from '../../assets/images/player/volume.svg'
import text from '../../assets/images/player/text.svg'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { addTrackToFavorites, removeTrackFromFavorites, fetchPlaylists, addTrackToPlaylist } from '../../api/musicAPI'
import { useToast } from '../../context/ToastContext.jsx'
import favoriteFullIcon from "../../assets/images/player/favorite-full.svg";
import favoriteIcon from "../../assets/images/player/favorite.svg";

export default function Player() {
    const navigate = useNavigate();
    const { currentTrack, setCurrentTrack, isPlaying, playTrack, progress, duration, seekTo, changeVolume, volume } = usePlayer();
    const { showSuccess, showError } = useToast();
    const [showVolumeControl, setShowVolumeControl] = useState(false);
    const [showAddToPlaylistMenu, setShowAddToPlaylistMenu] = useState(false);
    const [showPlaylistsList, setShowPlaylistsList] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(false);
    const popupRef = useRef(null);

    const handleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation()

        try {
            if (currentTrack.is_favorite) {
                await removeTrackFromFavorites(currentTrack.id);
                setCurrentTrack({ ...currentTrack, is_favorite: false });
            } else {
                await addTrackToFavorites(currentTrack.id);
                setCurrentTrack({ ...currentTrack, is_favorite: true });
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };


    const toggleVolumePopup = () => {
        setShowVolumeControl(!showVolumeControl);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowAddToPlaylistMenu(false);
                setShowPlaylistsList(false);
            }
        };

        if (showAddToPlaylistMenu || showPlaylistsList) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showAddToPlaylistMenu, showPlaylistsList]);

    useEffect(() => {
        // Закрываем список плейлистов только если закрыт и первый попап
        if (!showAddToPlaylistMenu && !showPlaylistsList) {
            setShowPlaylistsList(false);
        }
    }, [showAddToPlaylistMenu]);

    const handleSettingsClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (showPlaylistsList) {
            setShowPlaylistsList(false);
            setShowAddToPlaylistMenu(false);
            return;
        }

        if (showAddToPlaylistMenu) {
            setShowAddToPlaylistMenu(false);
            return;
        }

        setShowAddToPlaylistMenu(true);
        setShowPlaylistsList(false);
    };

    const handleShowPlaylists = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        setLoading(true);
        try {
            const playlistsData = await fetchPlaylists(100);
            setPlaylists(Array.isArray(playlistsData) ? playlistsData : []);
            // Показываем список плейлистов, первый попап закроется автоматически через стили (не показываем его когда открыт список)
            setShowPlaylistsList(true);
        } catch (error) {
            console.error('Error fetching playlists:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToPlaylist = async (playlistId, e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await addTrackToPlaylist(playlistId, currentTrack.id);
            const playlist = playlists.find(p => p.id === playlistId);
            const playlistName = playlist?.title || 'playlist';
            showSuccess(`Track added to ${playlistName}`);
            setShowPlaylistsList(false);
            setShowAddToPlaylistMenu(false);
        } catch (error) {
            console.error('Error adding track to playlist:', error);
            const errorMessage = error.message || '';
            
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
    };

    if (!currentTrack) return null;


    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    return (
        <div className="player">
            <div className="player__inner">
                <div className="player__track-wrapper">
                    <div className="player__track">
                        <ButtonLink 
                            to={`/big-player/${currentTrack.id}`}
                            className="player__track-image-link"
                        >
                            <img src={currentTrack.album.cover} width={60} height={60} loading='lazy' alt="" className="player__track-image"/>
                        </ButtonLink>
                        <div className="player__track-info">
                            <h3 className="player__track-title">{currentTrack.title}</h3>
                            <ButtonLink to={`/artist/${currentTrack.album.artist.id}`} className="player__track-artist">
                                {currentTrack.album.artist.stage_name}
                            </ButtonLink>
                        </div>
                    </div>
                    <ButtonLink className="player__track-favorite" onClick={handleFavorite}>
                        { currentTrack?.is_favorite ?
                            <img src={favoriteFullIcon} width={36} height={36} loading='lazy' alt="" className="player__track-favorite-icon"/> :
                            <img src={favoriteIcon} width={36} height={36} loading='lazy' alt="" className="player__track-favorite-icon"/>
                        }
                    </ButtonLink>
                </div>

                <div className="player__control">
                    <span className="player__timing-now player__timing">{formatTime(progress)}</span>

                    <div className="player__control-buttons">
                        <ButtonLink className="player__control-button player__control-prev">
                            <img src={prev} loading='lazy' width={36} height={36} alt="" className="player__control-icon"/>
                        </ButtonLink>

                        <ButtonLink onClick={() => playTrack(currentTrack)} className="player__control-button player__control-play">
                            {isPlaying ? (
                                <img src={pause} loading='lazy' width={52} height={52} alt="" className="player__control-icon player__control-icon--accent"/>
                            ) : (
                                <img src={play} loading='lazy' width={52} height={52} alt="" className="player__control-icon player__control-icon--accent"/>
                            )}
                        </ButtonLink>

                        <ButtonLink className="player__control-next player__control-button">
                            <img src={next} loading='lazy' width={36} height={36} alt="" className="player__control-icon"/>
                        </ButtonLink>
                    </div>

                    <span className="player__timing-end player__timing">{formatTime(duration)}</span>
                </div>


                <div className="player__progress-wrapper">
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={progress}
                        onChange={(e) => seekTo(Number(e.target.value))}
                        className="player__progress"
                        style={{
                            background: `linear-gradient(to right, #AAFF7C ${(progress / duration) * 100 || 0}%, #333 ${(progress / duration) * 100 || 0}%)`
                        }}
                    />
                </div>


                <div className="player__settings">
                    <ButtonLink className="player__settings-button">
                        <img src={text} alt="" className="player__settings-button-icon"/>
                    </ButtonLink>

                    <div className="player__settings-wrapper" ref={popupRef}>
                        <ButtonLink onClick={handleSettingsClick} className="player__settings-button">
                            <img src={settings} alt="" className="player__settings-button-icon"/>
                        </ButtonLink>
                        {showAddToPlaylistMenu && !showPlaylistsList && (
                            <div className="player__popup">
                                <button
                                    onClick={handleShowPlaylists}
                                    className="player__popup-button"
                                >
                                    Add to playlist
                                </button>
                            </div>
                        )}

                        {showPlaylistsList && (
                            <div className="player__playlists-popup">
                                {loading ? (
                                    <div className="player__playlists-loading">Loading...</div>
                                ) : playlists.length === 0 ? (
                                    <div className="player__playlists-empty">No playlists found</div>
                                ) : (
                                    <ul className="player__playlists-list">
                                        {playlists.map(playlist => (
                                            <li key={playlist.id} className="player__playlists-item">
                                                <button
                                                    onClick={(e) => handleAddToPlaylist(playlist.id, e)}
                                                    className="player__playlists-button"
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

                    <ButtonLink onClick={toggleVolumePopup} className="player__settings-button player__settings-button-volume">
                        <img src={volumeIcon} alt="" className="player__settings-button-icon"/>
                    </ButtonLink>
                    {showVolumeControl && (
                        <div className="player__volume-popup">
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={(e) => changeVolume(Number(e.target.value))}
                                className="player__volume-slider"
                                style={{
                                    background: `linear-gradient(to right, #AAFF7C ${volume * 100}%, #333 ${volume * 100}%)`
                                }}
                            />
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
}
