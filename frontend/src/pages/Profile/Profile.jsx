import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import HeaderSmall from "../../components/HeaderSmall/HeaderSmall.jsx";
import ButtonLink from "../../components/Button/ButtonLink.jsx";
import subscribeIcon from "../../assets/images/profile/subscribe.svg";
import artistIcon from "../../assets/images/profile/artist.svg";
import logoutIcon from "../../assets/images/profile/logout.svg";
import settingsIcon from "../../assets/images/profile/settings.svg";
import userAvatar from "../../assets/images/profile/user-avatar.png";
import {useEffect, useState} from "react";
import {fetchUserProfile, logoutUser} from "../../api/auth.js";
import {useNavigate} from "react-router-dom";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadUser() {
            try {
                const data = await fetchUserProfile();
                console.log(data);
                setUser(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        loadUser();
    }, [])

    if (loading) return <p>Loading profile...</p>
    if (error) return <p>Error: {error}</p>;


    const handleLogout = async() => {
        try {
            await logoutUser();
            navigate("/auth/login");
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <>
            <section className="profile container section">
                <Sidebar />
                <div className="profile__inner section__inner">
                    <HeaderSmall />

                    <div className="profile__body">
                        <header className="profile__body-header">
                            <div className="profile__body-title">Your Profile</div>

                            <ButtonLink to={'/'} className='profile__body-update'>
                                <img src={settingsIcon} width={24} height={24} loading='lazy' alt="Update" className="profile__update-icon"/>
                            </ButtonLink>
                        </header>


                        <div className="profile__info">
                            <div className="profile__avatar">
                                <img src={user.avatar} width={52} height={52} loading='lazy' alt="" className="profile__avatar-image"/>
                            </div>

                            <div className="profile__info-text">
                                <h3 className="profile__username">{user.username}</h3>
                                <span className="profile__subscribe">
                                    Premium Subscribe <span className="profile__subscribe-opacity">(24 days left)</span>
                                </span>
                            </div>
                        </div>

                        <div className="profile__buttons">
                            <ul className="profile__buttons-list">
                                <li className="profile__buttons-item">
                                    <ButtonLink to={'/'} className='profile__button'>
                                        Subscription Management
                                        <img src={subscribeIcon} width={16} height={16} loading='lazy' alt="Subscribe" className="profile__button-icon"/>
                                    </ButtonLink>
                                </li>
                                <li className="profile__buttons-item">
                                    {user.is_artist ?
                                        <ButtonLink to={`/artist/${user.artist.id}`} className='profile__button'>
                                            Your Artist Profile
                                            <img src={artistIcon} width={16} height={16} loading='lazy' alt="Artist" className="profile__button-icon"/>
                                        </ButtonLink> :
                                    <ButtonLink to={'/application/apply/'} className='profile__button'>
                                        Become Artist
                                        <img src={artistIcon} width={16} height={16} loading='lazy' alt="Artist" className="profile__button-icon"/>
                                    </ButtonLink>
                                    }
                                </li>
                                <li className="profile__buttons-item">
                                    <ButtonLink onClick={handleLogout} className='profile__button profile__button-logout'>
                                        Logout
                                        <img src={logoutIcon} width={16} height={16} loading='lazy' alt="Logout" className="profile__button-icon"/>
                                    </ButtonLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}