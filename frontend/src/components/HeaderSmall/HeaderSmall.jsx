import backIcon from '../../assets/images/header/back.svg'
import ButtonLink from "../Button/ButtonLink.jsx";

export default function HeaderSmall() {
    return (
        <header className='header'>
            <div className="header__inner">
                <ButtonLink to={'/'} className="header__back">
                    <img src={backIcon} width={36} height={36} loading='lazy' alt="Back" className="header__back-icon"/>
                </ButtonLink>
            </div>
        </header>
    )
}