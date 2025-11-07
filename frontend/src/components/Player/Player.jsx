import { usePlayer } from "../../context/PlayerContext";
import ButtonLink from "../Button/ButtonLink.jsx";
import favorite from '../../assets/images/artist-profile/favorite.svg'
import play from '../../assets/images/Player/play.svg'
import prev from '../../assets/images/Player/prev.svg'
import next from '../../assets/images/Player/next.svg'
import settings from '../../assets/images/Player/settings.svg'
import volume from '../../assets/images/Player/volume.svg'
import text from '../../assets/images/Player/text.svg'


export default function Player() {
    const { currentTrack, isPlaying, playTrack } = usePlayer();

    if (!currentTrack) return null;


    return (
        <div className="player">
            <div className="player__inner">
                <div className="player__track-wrapper">
                    <div className="player__track">
                        <img src={currentTrack.album.cover} width={60} height={60} loading='lazy' alt="" className="player__track-image"/>
                        <div className="player__track-info">
                            <h3 className="player__track-title">{currentTrack.title}</h3>
                            <ButtonLink to={`/artist/${currentTrack.album.artist.id}`} className="player__track-artist">{currentTrack.album.artist.stage_name}</ButtonLink>
                        </div>
                    </div>
                    <ButtonLink className="player__track-favorite">
                        <img src={favorite} width={36} height={36} loading='lazy' alt="" className="player__track-favorite-icon"/>
                    </ButtonLink>
                </div>

                <div className="player__control">
                    <span className="player__timing-now player__timing">1:43</span>

                    <div className="player__control-buttons">
                        <ButtonLink className="player__control-button player__control-prev">
                            <img src={prev} loading='lazy' width={36} height={36} alt="" className="player__control-icon"/>
                        </ButtonLink>

                        <ButtonLink onClick={() => playTrack(currentTrack)} className="player__control-button player__control-play">
                            <img src={play} loading='lazy' width={52} height={52} alt="" className="player__control-icon"/>
                        </ButtonLink>

                        <ButtonLink className="player__control-next player__control-button">
                            <img src={next} loading='lazy' width={36} height={36} alt="" className="player__control-icon"/>
                        </ButtonLink>
                    </div>

                    <span className="player__timing-end player__timing">1:43</span>
                </div>

                <div className="player__settings">
                    <ButtonLink className="player__settings-button">
                        <img src={text} alt="" className="player__settings-button-icon"/>
                    </ButtonLink>

                    <ButtonLink className="player__settings-button">
                        <img src={settings} alt="" className="player__settings-button-icon"/>
                    </ButtonLink>

                    <ButtonLink className="player__settings-button">
                        <img src={volume} alt="" className="player__settings-button-icon"/>
                    </ButtonLink>
                </div>
            </div>
        </div>
    );
}