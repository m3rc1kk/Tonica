export default function Header({icon, title, avatar}) {
    return (
        <header className='header'>
            <div className="header__inner">
                <div className="header__page">
                    <img src={icon} width={16} height={16} loading='lazy' alt="Icon" className="header__page-icon"/>
                    <h3 className="header__page-title">{title}</h3>
                </div>

                <a className="header__profile">
                    <img src={avatar} width={36} height={36} loading='lazy' alt="" className="header__avatar"/>
                    <div className="header__profile-info">
                        <h3 className="header__profile-username">m3rc1k</h3>
                        <span className="header__profile-subscribe">Premium</span>
                    </div>
                </a>
            </div>
        </header>
    )
}