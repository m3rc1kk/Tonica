import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import Trend from "../../components/Trend/Trend.jsx";
import Header from "../../components/Header/Header.jsx";
import avatar from '../../assets/images/header/avatar.png'
import home from '../../assets/images/header/home.svg'
import ButtonLink from "../../components/Button/ButtonLink.jsx";

export default function Home() {
    const trends = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
    ];


    return (
        <section className='home container section'>
            <Sidebar />

            <div className="home__inner section__inner">
                <Header
                    icon={home}
                    avatar={avatar}
                    title='Home'
                />
                <div className="home__trend">
                    <ul className="home__trend-list">
                        {trends.map((trend) => (
                            <li key={trend.id} className="home__trend-item">
                                <Trend />
                            </li>
                        ))}

                        <li className="home__trend-item home__trend-item--album">
                            <Trend isAlbum />
                        </li>

                    </ul>
                </div>


                {/*
                <div className="section__block charts">
                    <header className="section__block-header charts__header">
                        <ButtonLink to={'/'} className="section__block-link">
                            Charts
                        </ButtonLink>
                    </header>
                    <div className="section__body charts__body">

                    </div>
                </div>
                */}
            </div>
        </section>
    )
}