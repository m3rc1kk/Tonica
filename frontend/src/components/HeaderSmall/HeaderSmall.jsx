import backIcon from '../../assets/images/header/back.svg'
import ButtonLink from "../Button/ButtonLink.jsx";
import { useNavigate } from "react-router-dom";

export default function HeaderSmall() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    }

    return (
        <header className='header'>
            <div className="header__inner">
                <ButtonLink onClick={handleBack} className="header__back">
                    <img src={backIcon} width={36} height={36} loading='lazy' alt="Back" className="header__back-icon"/>
                </ButtonLink>
            </div>
        </header>
    )
}