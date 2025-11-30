import ButtonLink from "../Button/ButtonLink.jsx";
import avatar from '../../assets/images/trend/avatar.png'
import favoriteIcon from '../../assets/images/trend/favorite.svg'
import favoriteFullIcon from '../../assets/images/trend/favorite-full.svg'
import play from '../../assets/images/trend/play.svg'
import {usePlayer} from "../../context/PlayerContext.jsx";
import { useState, useEffect } from "react";
import {addTrackToFavorites, removeTrackFromFavorites, addAlbumToFavorites, removeAlbumFromFavorites, fetchAlbumDetail} from "../../api/musicAPI.js";
import { useToast } from "../../context/ToastContext.jsx";



export default function Trend({
    id,
    isAlbum = false,
    title,
    album,
    artists,
    cover,
    artist,
    audio_file,
    is_favorite,
    plays_count_30_days,
    queueTracks = null,
    queueStartIndex = 0
}) {

    const { currentTrack, setCurrentTrack, isPlaying, playTrack, playFromQueue } = usePlayer();
    const [favorite, setFavorite] = useState(is_favorite || false);
    const { showError } = useToast();

    useEffect(() => {
        setFavorite(is_favorite || false);
    }, [is_favorite]);

    useEffect(() => {
        if (!isAlbum && currentTrack?.id === id) {
            setFavorite(currentTrack.is_favorite || false);
        }
    }, [currentTrack?.id, currentTrack?.is_favorite, id, isAlbum]);

    const handleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!id) return;

        try {
            if (isAlbum) {
                if (favorite) {
                    await removeAlbumFromFavorites(id);
                    setFavorite(false);
                } else {
                    await addAlbumToFavorites(id);
                    setFavorite(true);
                }
            } else {
                if (favorite) {
                    await removeTrackFromFavorites(id);
                    setFavorite(false);
                    if (currentTrack?.id === id) {
                        setCurrentTrack({ ...currentTrack, is_favorite: false });
                    }
                } else {
                    await addTrackToFavorites(id);
                    setFavorite(true);
                    if (currentTrack?.id === id) {
                        setCurrentTrack({ ...currentTrack, is_favorite: true });
                    }
                }
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const trackArtists = !isAlbum 
        ? ((artists && artists.length > 0) ? artists : (album?.artist ? [album.artist] : []))
        : (artist ? [artist] : [])
    
    const firstArtist = trackArtists[0]
    const artistId = firstArtist?.id
    const artistAvatar = firstArtist?.avatar
    const cov = isAlbum ? cover : album?.cover

    return (
        <div className={`trend ${isAlbum ? "trend--album" : ""}`}>
            <div className={`trend__inner ${isAlbum ? "trend__inner--album" : ""}`}>
            <div className={`trend__body ${isAlbum ? "trend__body--album" : ""}`}>
                <div className="trend__author">
                    {firstArtist && (
                        <img src={artistAvatar || avatar} width={24} height={24} loading='lazy' alt="" className="trend__author-avatar"/>
                    )}
                    <div className={`trend__author-names ${isAlbum ? "trend__author-names--album" : ""}`}>
                        <span className="trend__author-names-inner">
                            {trackArtists.map((artistItem, index) => (
                                <span key={artistItem.id}>
                                    {index > 0 && <span className="trend__author-separator">, </span>}
                                    <ButtonLink to={`/artist/${artistItem.id}`} className={`trend__author-name ${isAlbum ? "trend__author-name--album" : ""}`}>
                                        {artistItem.stage_name}
                                    </ButtonLink>
                                </span>
                            ))}
                        </span>
                    </div>
                </div>
                {isAlbum ?
                    <ButtonLink to={`/album/${id}`} className={`trend__title title--accent ${isAlbum ? "trend__title--album" : ""}`}>{title}</ButtonLink> :
                    <ButtonLink to={`/album/${album?.id}`} className={`trend__title title--accent ${isAlbum ? "trend__title--album" : ""}`}>{title}</ButtonLink>
                }

                <div className={`trend__monthly-listeners ${isAlbum ? "trend__monthly-listeners--album" : ""}`}>
                    <p>
                        {plays_count_30_days !== undefined && plays_count_30_days !== null
                            ? `${plays_count_30_days.toLocaleString('en-US')} plays per month`
                            : '0 plays per month'
                        }
                    </p>
                </div>
                <ButtonLink
                    onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        if (isAlbum) {
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
                        } else {
                            if (queueTracks && queueTracks.length > 0) {
                                const trackIndex = queueTracks.findIndex(t => t.id === id);
                                if (trackIndex >= 0) {
                                    playFromQueue(queueTracks, trackIndex);
                                } else {
                                    playTrack({ id, title, album, artists, audio_file, is_favorite }, queueTracks, queueStartIndex);
                                }
                            } else {
                                playTrack({ id, title, album, artists, audio_file, is_favorite });
                            }
                        }
                    }}
                    className="trend__button"><img src={play} width={32} height={32} loading='lazy' alt="" className="trend__button-icon"/> Play</ButtonLink>
                <ButtonLink onClick={handleFavorite} className="trend__favorite">
                    {favorite ?
                        <img src={favoriteFullIcon} width={24} height={24} loading='lazy' alt="" className="trend__favorite-icon"/> :
                        <img src={favoriteIcon} width={24} height={24} loading='lazy' alt="" className="trend__favorite-icon"/>
                    }
                </ButtonLink>
            </div>
            <img src={cov} width={216} height={216} loading='lazy' alt="" className={`trend__image ${isAlbum ? "trend__image--album" : ""}`}/>
            </div>
        </div>
    )
}