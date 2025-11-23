import { useEffect, useState } from "react";
import { fetchUserProfile } from "../../api/auth.js";
import ButtonLink from "../Button/ButtonLink.jsx";

export default function Header({icon, title}) {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadUser() {
            try {
                const data = await fetchUserProfile();
                setUser(data);
            } catch (error) {
                console.error('Error loading user profile:', error);
                setError(error.message);
            }
        }
        loadUser();
    }, [])

    useEffect(() => {
        if (error) {
            console.error('Header error:', error);
        }
    }, [error]);

    if (!user) return null;

    return (
        <header className='header'>
            <div className="header__inner">
                <div className="header__page">
                    <img src={icon} width={16} height={16} loading='lazy' alt="Icon" className="header__page-icon"/>
                    <h3 className="header__page-title">{title}</h3>
                </div>

                <ButtonLink to={'/profile'} className="header__profile">
                    <img src={user.avatar} width={36} height={36} loading='lazy' alt="" className="header__avatar"/>
                    <div className="header__profile-info">
                        <h3 className="header__profile-username">{user.username}</h3>
                        <span className="header__profile-subscribe">Premium</span>
                    </div>
                </ButtonLink>
            </div>
        </header>
    )
}