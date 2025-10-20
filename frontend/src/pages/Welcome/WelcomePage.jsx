import Logo from "../../components/Logo/Logo.jsx";
import ButtonLink from "../../components/Button/ButtonLink.jsx";
import welcomeImage  from '../../assets/images/welcome/welcome-image.png';

export default function WelcomePage() {
    return (
        <div className="welcome container">
            <div className="welcome__header">
                <Logo/>
                <div className="welcome__header-sign">
                    <ButtonLink to={'/login'} className={'welcome__header-sign-in button--transparent'}>Sign In</ButtonLink>
                    <ButtonLink to={'/register'} className={'welcome__header-sign-up'}>Sign Up</ButtonLink>
                </div>
            </div>

            <div className="welcome__hero">
                <img src={welcomeImage} width={1246} height={762} loading='lazy' alt='WelcomeImage' className="welcome__image" />
                <div className="welcome__body">
                    <h1 className="welcome__title"><span className="welcome__title-white">Listen With</span> <span className="welcome__title-accent">Tonica</span> </h1>

                    <div className="welcome__description">
                        <p>Discover a world of endless music with Tonica. Millions of tracks, personalized recommendations, and the best sound – all in one app.</p>
                    </div>

                    <div className="welcome__buttons">
                        <ButtonLink to={'/login'} className={'welcome__button'}>Start listening</ButtonLink>
                        <ButtonLink to={'/login'} className={'welcome__button welcome__button--transparent button--transparent'}>View more</ButtonLink>

                        {/*<ButtonLink to={'/reset-password'} className={'welcome__button welcome__button--transparent button--transparent'}>View more</ButtonLink>
                        <ButtonLink to={'/reset-password-done'} className={'welcome__button welcome__button--transparent button--transparent'}>View more</ButtonLink>
                        <ButtonLink to={'/reset-password-confirm'} className={'welcome__button welcome__button--transparent button--transparent'}>View more</ButtonLink>
                        <ButtonLink to={'/reset-password-complete'} className={'welcome__button welcome__button--transparent button--transparent'}>View more</ButtonLink> */}
                    </div>
                </div>
            </div>
        </div>
    )
}