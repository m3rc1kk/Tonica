import logo from '../../assets/images/logo.svg';

export default function Logo({className='header__logo'}) {
    return (
     <div className={`logo ${className}`}>
         <img src={logo} alt="Logo" width="90" height="18" loading="lazy" className="logo__image" />
     </div>
    )
}