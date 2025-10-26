import logo from '../../assets/images/logo.svg'
import shortLogo from '../../assets/images/short-logo.svg'
import homeIcon from '../../assets/images/sidebar/home.svg'
import searchIcon from '../../assets/images/sidebar/search.svg'
import libraryIcon from '../../assets/images/sidebar/library.svg'
import playlistIcon from '../../assets/images/sidebar/playlist.png'
import { Link, NavLink } from "react-router-dom";


export default function Sidebar() {
    return (
        <aside className='sidebar'>
            <div className="sidebar__inner">
                <div className="sidebar__logo logo">
                    <img width={90} height={18} loading='lazy' src={logo} alt="Logo"
                         className="logo__image hidden-tablet"/>
                    <img width={22} height={18} loading='lazy' src={shortLogo} alt="Logo"
                         className="short-logo__image hidden-mobile hidden-tablet-above"/>
                </div>

                <div className="sidebar__menu">
                    <h2 className="sidebar__menu-title hidden-tablet">Menu</h2>
                    <ul className="sidebar__menu-list">
                        <li className="sidebar__menu-item">
                            <NavLink to={'/home'} className={({ isActive }) =>
                                `sidebar__menu-link ${isActive ? '' : 'sidebar__menu-link--inactive'}`
                            }>
                                <img width={16} height={16} loading='lazy' src={homeIcon} alt=""
                                     className='sidebar__menu-link-icon' />
                                <span className="sidebar__menu-link-text hidden-tablet">Home</span>

                            </NavLink>
                        </li>
                        <li className="sidebar__menu-item">
                            <NavLink to={'/'} className={({ isActive }) =>
                                `sidebar__menu-link ${isActive ? '' : 'sidebar__menu-link--inactive'}`
                            }>
                                <img width={16} height={16} loading='lazy' src={searchIcon} alt=""
                                     className='sidebar__menu-link-icon'/>
                                <span className="sidebar__menu-link-text hidden-tablet">Search</span>
                            </NavLink>
                        </li>
                        <li className="sidebar__menu-item">
                            <NavLink to={'/'} className={({ isActive }) =>
                                `sidebar__menu-link ${isActive ? '' : 'sidebar__menu-link--inactive'}`
                            }>
                                <img width={16} height={16} loading='lazy' src={libraryIcon} alt=""
                                     className='sidebar__menu-link-icon'/>
                                <span className="sidebar__menu-link-text hidden-tablet">Library</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className="sidebar__playlist hidden-mobile">
                    <h2 className="sidebar__playlist-title hidden-tablet">Pinned</h2>
                    <ul className="sidebar__playlist-list">
                        <li className="sidebar__playlist-item">
                            <Link to={'/'} className="sidebar__playlist-link">
                                <img width={44} height={44} loading='lazy' src={playlistIcon} alt=""
                                     className="sidebar__playlist-image"/>

                                <div className="sidebar__playlist-body hidden-tablet">
                                    <h3 className="sidebar__playlist-name">My Music</h3>
                                    <span className="sidebar__playlist-count">32 tracks</span>
                                </div>
                            </Link>
                        </li>
                        <li className="sidebar__playlist-item">
                            <Link to={'/'} className="sidebar__playlist-link">
                                <img width={44} height={44} loading='lazy' src={playlistIcon} alt=""
                                     className="sidebar__playlist-image"/>

                                <div className="sidebar__playlist-body hidden-tablet">
                                    <h3 className="sidebar__playlist-name">My Music</h3>
                                    <span className="sidebar__playlist-count">32 tracks</span>
                                </div>
                            </Link>
                        </li>
                        <li className="sidebar__playlist-item">
                            <Link to={'/'} className="sidebar__playlist-link">
                                <img width={44} height={44} loading='lazy' src={playlistIcon} alt=""
                                     className="sidebar__playlist-image"/>

                                <div className="sidebar__playlist-body hidden-tablet">
                                    <h3 className="sidebar__playlist-name">My Music</h3>
                                    <span className="sidebar__playlist-count">32 tracks</span>
                                </div>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </aside>
    )
}