import { usePlayer } from "../../context/PlayerContext";
import ButtonLink from "../Button/ButtonLink.jsx";
import play from '../../assets/images/player/play.svg'
import pause from '../../assets/images/player/pause.svg'
import prev from '../../assets/images/player/prev.svg'
import next from '../../assets/images/player/next.svg'
import settings from '../../assets/images/player/settings.svg'
import volumeIcon from '../../assets/images/player/volume.svg'
import text from '../../assets/images/player/text.svg'
import { useState } from 'react'
import { addTrackToFavorites, removeTrackFromFavorites } from '../../api/musicAPI'
import favoriteFullIcon from "../../assets/images/player/favorite-full.svg";
import favoriteIcon from "../../assets/images/player/favorite.svg";

export default function Player() {
    const { currentTrack, setCurrentTrack, isPlaying, playTrack, progress, duration, seekTo, changeVolume, volume } = usePlayer();
    const [showVolumeControl, setShowVolumeControl] = useState(false);

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
                        <img src={currentTrack.album.cover} width={60} height={60} loading='lazy' alt="" className="player__track-image"/>
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

                    <ButtonLink className="player__settings-button">
                        <img src={settings} alt="" className="player__settings-button-icon"/>
                    </ButtonLink>

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
