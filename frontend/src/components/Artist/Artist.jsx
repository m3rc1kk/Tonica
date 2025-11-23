import ButtonLink from "../Button/ButtonLink.jsx";
import defaultAvatar from '../../assets/images/artist/pepel.webp'
import favoriteIcon from '../../assets/images/artist-profile/favorite.svg';
import favoriteFullIcon from '../../assets/images/artist-profile/favorite-full.svg';
import pinIcon from '../../assets/images/artist-profile/pin.svg';
import pinFullIcon from '../../assets/images/artist-profile/pin-full.svg';
import { useState, useEffect } from "react";
import {
    addArtistToFavorites,
    removeArtistFromFavorites,
    pinArtist,
    unpinArtist,
} from "../../api/musicAPI.js";

import { usePinned } from "../../context/PinnedContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

export default function Artist({
    id,
    stage_name,
    avatar,
    is_favorite,
                               })  {

    const [favorite, setFavorite] = useState(is_favorite || false);
    const [isPinned, setIsPinned] = useState(false);

    const { refreshPinned, pinnedArtists } = usePinned();
    const { showError } = useToast();

    useEffect(() => {
        setFavorite(is_favorite || false);
    }, [is_favorite]);


    useEffect(() => {
        setIsPinned(pinnedArtists.some(a => a.id === id));
    }, [pinnedArtists, id]);

    const handleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!id) return;

        try {
            if (favorite) {
                await removeArtistFromFavorites(id);
                setFavorite(false);
            } else {
                await addArtistToFavorites(id);
                setFavorite(true);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const bgStyle = {
        backgroundImage: `url(${avatar || defaultAvatar})`,
    }

    const handlePin = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!id) return;

        try {
            if (isPinned) {
                await unpinArtist(id);
                setIsPinned(false);
            } else {
                await pinArtist(id);
                setIsPinned(true);
            }
            refreshPinned();
        } catch (error) {
            console.error('Error toggling pin:', error);
            showError(error.message || 'Error');
        }
    };

    return (
        <div className="artist" style={bgStyle}>
            <ButtonLink onClick={handleFavorite} className="artist__favorite">
                {favorite ?
                    <img src={favoriteFullIcon} width={42} height={42} loading='lazy' alt="" className="artist__favorite-icon"/> :
                    <img src={favoriteIcon} width={42} height={42} loading='lazy' alt="" className="artist__favorite-icon"/>
                }
            </ButtonLink>
            <ButtonLink onClick={handlePin} className="artist__pin">
                { isPinned ?
                    <img src={pinFullIcon} width={42} height={42} loading='lazy' alt="" className="artist__pin-icon"/> :
                    <img src={pinIcon} width={42} height={42} loading='lazy' alt="" className="artist__pin-icon"/>
                }
            </ButtonLink>
            <div className="artist__inner">
                <div className="artist__info">
                    <ButtonLink to={`/artist/${id}`} className="artist__name">{stage_name}</ButtonLink>
                    <span className="artist__listeners"><span className="artist__listeners--accent">+1.123.272</span> plays in the last month</span>
                </div>
            </div>
        </div>
    )
}