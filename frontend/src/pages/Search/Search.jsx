import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import search from "../../assets/images/search/search.svg";
import searchButton from "../../assets/images/search/search-icon.svg";
import avatar from "../../assets/images/header/avatar.png";
import Header from "../../components/Header/Header.jsx";
import ButtonLink from "../../components/Button/ButtonLink.jsx";

export default function Search() {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        const query = searchQuery.trim();

        if (!query) {
            return;
        }

        navigate(`/search/results?q=${encodeURIComponent(query)}`);
    };

    return (
        <>
            <section className="search container section">
                <Sidebar />
                <div className="search__inner section__inner">
                    <Header
                        icon={search}
                        avatar={avatar}
                        title='Search'
                    />

                    <div className="search__body">
                        <h2 className="search__title">Find music to your taste</h2>
                        <form onSubmit={handleSearch} className="search__form">
                            <input
                                type="search"
                                id="search-input"
                                placeholder='Search'
                                className="search__input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <ButtonLink
                                className={'search__button'}
                                type={'submit'}
                            >
                                <img src={searchButton} width={55} height={55} loading='lazy' alt="" className="search__button-icon"/>
                            </ButtonLink>
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}