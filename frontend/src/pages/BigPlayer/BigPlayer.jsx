import { usePlayer } from "../../context/PlayerContext";
import ButtonLink from "../../components/Button/ButtonLink.jsx";
import play from '../../assets/images/player/play.svg'
import pause from '../../assets/images/player/pause.svg'
import prev from '../../assets/images/player/prev.svg'
import next from '../../assets/images/player/next.svg'
import settings from '../../assets/images/player/settings.svg'
import volumeIcon from '../../assets/images/player/volume.svg'
import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { addTrackToFavorites, removeTrackFromFavorites, fetchTrackDetail, fetchPlaylists, addTrackToPlaylist } from '../../api/musicAPI'
import { useToast } from '../../context/ToastContext.jsx'
import favoriteFullIcon from "../../assets/images/player/favorite-full.svg";
import favoriteIcon from "../../assets/images/player/favorite.svg";
import HeaderSmall from "../../components/HeaderSmall/HeaderSmall.jsx";

export default function BigPlayer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentTrack, setCurrentTrack, isPlaying, playTrack, progress, duration, seekTo, changeVolume, volume, nextTrack, prevTrack, hasNextTrack, hasPrevTrack } = usePlayer();
    const { showSuccess, showError } = useToast();
    const [showVolumeControl, setShowVolumeControl] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAddToPlaylistMenu, setShowAddToPlaylistMenu] = useState(false);
    const [showPlaylistsList, setShowPlaylistsList] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [loadingPlaylists, setLoadingPlaylists] = useState(false);
    const popupRef = useRef(null);

    useEffect(() => {
        const loadTrack = async () => {
            if (!id) return;

            if (currentTrack?.id === parseInt(id)) {
                return;
            }

            setLoading(true);
            try {
                const track = await fetchTrackDetail(id);
                setCurrentTrack(track);
                playTrack(track);
            } catch (error) {
                console.error('Error loading track:', error);
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };

        loadTrack();
    }, [id, currentTrack?.id, setCurrentTrack, playTrack, navigate]);

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

        setLoadingPlaylists(true);
        try {
            const playlistsData = await fetchPlaylists(100);
            setPlaylists(Array.isArray(playlistsData) ? playlistsData : []);
            setShowPlaylistsList(true);
        } catch (error) {
            console.error('Error fetching playlists:', error);
        } finally {
            setLoadingPlaylists(false);
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

    if (loading) {
        return (
            <div className="big-player">
                <div className="big-player_inner">
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-white)' }}>
                        Loading...
                    </div>
                </div>
            </div>
        );
    }

    if (!currentTrack) return null;


    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    const artists = (currentTrack.artists && currentTrack.artists.length > 0)
        ? currentTrack.artists
        : (currentTrack.album?.artist ? [currentTrack.album.artist] : [])

    return (
        <div className="big-player-wrapper container">
            <HeaderSmall />
        <div className="big-player container">
            <div className="big-player_inner">
                <div className="big-player__track">
                    <img src={currentTrack.album.cover} width={400} height={400} loading='lazy' alt="" className="big-player__track-image"/>
                    <div className="big-player__track-info">
                        <h3 className="big-player__track-title title--accent">{currentTrack.title}</h3>
                        <div className={`big-player__track-artists ${artists.length > 1 ? 'big-player__track-artists--multiple' : ''}`}>
                            {artists.map((artist, index) => (
                                <React.Fragment key={artist.id}>
                                    {index > 0 && <span className="big-player__track-artist-separator">, </span>}
                                    <ButtonLink to={`/artist/${artist.id}`} className="big-player__track-artist">
                                        {artist.stage_name}
                                    </ButtonLink>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="big-player__body">
                    <div className="big-player__actions">
                        <ButtonLink className="big-player__track-favorite" onClick={handleFavorite}>
                            { currentTrack?.is_favorite ?
                                <img src={favoriteFullIcon} width={52} height={52} loading='lazy' alt="" className="big-player__track-favorite-icon"/> :
                                <img src={favoriteIcon} width={52} height={52} loading='lazy' alt="" className="big-player__track-favorite-icon"/>
                            }
                        </ButtonLink>
                        <div className="big-player__track-placeholder" style={{ width: '52px', height: '52px' }}></div>
                    </div>

                    <div className="big-player__control">
                        <span className="big-player__timing-now big-player__timing">{formatTime(progress)}</span>
                        <div className="big-player__control-buttons">
                            <ButtonLink 
                                onClick={(e) => {
                                    e.preventDefault();
                                    prevTrack();
                                }}
                                className={`big-player__control-button big-player__control-prev ${!hasPrevTrack() ? 'big-player__control-button--disabled' : ''}`}
                                disabled={!hasPrevTrack()}
                            >
                                <img src={prev} loading='lazy' width={52} height={52} alt="" className="big-player__control-icon"/>
                            </ButtonLink>

                            <ButtonLink onClick={() => playTrack(currentTrack)} className="big-player__control-button big-player__control-play">
                                {isPlaying ? (
                                    <img src={pause} loading='lazy' width={52} height={52} alt="" className="big-player__control-icon big-player__control-icon--accent"/>
                                ) : (
                                    <img src={play} loading='lazy' width={52} height={52} alt="" className="big-player__control-icon big-player__control-icon--accent"/>
                                )}
                            </ButtonLink>

                            <ButtonLink 
                                onClick={(e) => {
                                    e.preventDefault();
                                    nextTrack();
                                }}
                                className={`big-player__control-next big-player__control-button ${!hasNextTrack() ? 'big-player__control-button--disabled' : ''}`}
                                disabled={!hasNextTrack()}
                            >
                                <img src={next} loading='lazy' width={52} height={52} alt="" className="big-player__control-icon"/>
                            </ButtonLink>
                        </div>

                        <span className="big-player__timing-end big-player__timing">{formatTime(duration)}</span>
                    </div>


                    <div className="big-player__progress-wrapper">
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={progress}
                            onChange={(e) => seekTo(Number(e.target.value))}
                            className="big-player__progress"
                            style={{
                                background: `linear-gradient(to right, #AAFF7C ${(progress / duration) * 100 || 0}%, #333 ${(progress / duration) * 100 || 0}%)`
                            }}
                        />
                    </div>


                    <div className="big-player__settings">
                        <div className="big-player__settings-wrapper" ref={popupRef}>
                            <ButtonLink onClick={handleSettingsClick} className="big-player__settings-button">
                                <img src={settings} width={52} height={52} loading='lazy' alt="" className="big-player__settings-button-icon"/>
                            </ButtonLink>
                            {showAddToPlaylistMenu && !showPlaylistsList && (
                                <div className="big-player__popup">
                                    <button
                                        onClick={handleShowPlaylists}
                                        className="big-player__popup-button"
                                    >
                                        Add to playlist
                                    </button>
                                </div>
                            )}

                            {showPlaylistsList && (
                                <div className="big-player__playlists-popup">
                                    {loadingPlaylists ? (
                                        <div className="big-player__playlists-loading">Loading...</div>
                                    ) : playlists.length === 0 ? (
                                        <div className="big-player__playlists-empty">No playlists found</div>
                                    ) : (
                                        <ul className="big-player__playlists-list">
                                            {playlists.map(playlist => (
                                                <li key={playlist.id} className="big-player__playlists-item">
                                                    <button
                                                        onClick={(e) => handleAddToPlaylist(playlist.id, e)}
                                                        className="big-player__playlists-button"
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

                        <ButtonLink onClick={toggleVolumePopup} className="big-player__settings-button big-player__settings-button-volume">
                            <img src={volumeIcon} width={52} height={52} loading='lazy' alt="" className="big-player__settings-button-icon"/>
                        </ButtonLink>
                        {showVolumeControl && (
                            <div className="big-player__volume-popup">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={(e) => changeVolume(Number(e.target.value))}
                                    className="big-player__volume-slider"
                                    style={{
                                        background: `linear-gradient(to right, #AAFF7C ${volume * 100}%, #333 ${volume * 100}%)`
                                    }}
                                />
                            </div>
                        )}


                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}
