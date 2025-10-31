import ButtonLink from "../Button/ButtonLink.jsx";
import avatar from '../../assets/images/trend/avatar.png'
import favorite from '../../assets/images/trend/favorite.svg'
import album from '../../assets/images/trend/album.png'
import play from '../../assets/images/trend/play.svg'

export default function Trend({isAlbum=false}) {
    return (
        <div className={`trend ${isAlbum ? "trend--album" : ""}`}>
            <div className={`trend__inner ${isAlbum ? "trend__inner--album" : ""}`}>
            <div className={`trend__body ${isAlbum ? "trend__body--album" : ""}`}>
                <div className="trend__author">
                    <img src={avatar} width={24} height={24} loading='lazy' alt="" className="trend__author-avatar"/>
                    <ButtonLink to={'/'} className={`trend__author-name ${isAlbum ? "trend__author-name--album" : ""}`}>NEWLIGHTCHILD</ButtonLink>
                </div>
                <h1 className={`trend__title ${isAlbum ? "trend__title--album" : ""}`}>AGENT P</h1>
                <div className={`trend__monthly-listeners ${isAlbum ? "trend__monthly-listeners--album" : ""}`}>
                    <p>564.034 monthly listeners </p>
                </div>
                <ButtonLink to={'/'} className="trend__button"><img src={play} width={32} height={32} loading='lazy' alt="" className="trend__button-icon"/> Play</ButtonLink>
                <ButtonLink to={'/'} className="trend__favorite">
                    <img src={favorite} width={24} height={24} loading='lazy' alt="" className="trend__favorite-icon"/>
                </ButtonLink>
            </div>
            <img src={album} width={216} height={216} loading='lazy' alt="" className={`trend__image ${isAlbum ? "trend__image--album" : ""}`}/>
            </div>
        </div>
    )
}