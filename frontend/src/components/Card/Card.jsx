import ButtonLink from "../Button/ButtonLink.jsx";
import play from "../../assets/images/artist-profile/play.svg";
import favoriteIcon from "../../assets/images/artist-profile/favorite.svg";
import favoriteFullIcon from "../../assets/images/artist-profile/favorite-full.svg";
import pinIcon from '../../assets/images/artist-profile/pin.svg';
import pinFullIcon from '../../assets/images/artist-profile/pin-full.svg';
import settings from "../../assets/images/artist-profile/settings.svg";
import { useState, useEffect } from "react";
import {
    addArtistToFavorites,
    removeArtistFromFavorites,
    addAlbumToFavorites,
    removeAlbumFromFavorites,
    pinArtist,
    unpinArtist,
    pinAlbum,
    unpinAlbum,
} from "../../api/musicAPI.js";

import { usePinned } from "../../context/PinnedContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";


export default function Card({
    type = 'artist', // artist | playlist | album
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
    const { refreshPinned, pinnedArtists, pinnedAlbums } = usePinned();
    const { showError } = useToast();

    useEffect(() => {
        if (type === 'artist' && author?.id) {
            setIsPinned(pinnedArtists.some(a => a.id === author.id));
        } else if (type === 'album' && id) {
            setIsPinned(pinnedAlbums.some(a => a.id === id));
        }
    }, [type, author?.id, id, pinnedArtists, pinnedAlbums]);

    useEffect(() => {
        if (type === 'artist') {
            setFavorite(author?.is_favorite || false);
        } else if (type === 'album') {
            setFavorite(is_favorite || false);
        }
    }, [author?.is_favorite, is_favorite, type]);

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
                // Показываем красивое уведомление вместо alert
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
                    <span className="card__listeners"><span className="card__listeners--accent">22.542.342</span>  listeners <span className="card__listeners--hidden">per month</span> </span> :
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
                    <ButtonLink to={'/'} className="card__play card__button">
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
                    {type === 'playlist' && (
                        <ButtonLink to={'/'} className="card__favorite card__button">
                            <img src={favoriteIcon} width={52} height={52} loading='lazy' alt="" className="card__button-icon"/>
                        </ButtonLink>
                    )}
                    {(type === 'artist' || type === 'album') && (
                        <ButtonLink onClick={handlePin} className="card__pin card__button">
                            { isPinned ?
                                <img src={pinFullIcon} width={52} height={52} loading='lazy' alt="" className="card__button-icon"/> :
                                <img src={pinIcon} width={52} height={52} loading='lazy' alt="" className="card__button-icon"/>
                            }
                        </ButtonLink>
                    )}
                    {type === 'playlist' && (
                        <ButtonLink to={'/'} className="card__pin card__button">
                            <img src={pinIcon} width={52} height={52} loading='lazy' alt="" className="card__button-icon"/>
                        </ButtonLink>
                    )}
                    <ButtonLink to={'/'} className="card__settings card__button">
                        <img src={settings} width={52} height={52} loading='lazy' alt="" className="card__button-icon"/>
                    </ButtonLink>
                </div>
            </div>
        </div>
    )
}