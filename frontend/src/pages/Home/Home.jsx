import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import Trend from "../../components/Trend/Trend.jsx";
import Header from "../../components/Header/Header.jsx";
import avatar from '../../assets/images/header/avatar.png'
import home from '../../assets/images/header/home.svg'
import SectionBlock from "../../components/Section/SectionBlock.jsx";
import Track from "../../components/Track/Track.jsx";
import TrackList from "../../components/TrackList/TrackList.jsx";
import AlbumList from "../../components/AlbumList/AlbumList.jsx";
import GenreList from "../../components/GenreList/GenreList.jsx";
import ArtistList from "../../components/ArtistList/ArtistList.jsx";

export default function Home() {
    const trends = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
    ];

    const albums = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
    ];

    const genres = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
    ];


    const artists = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
    ];

    const tracks = [
        { id: 1,
            position: 1
        },
        { id: 2,
            position: 2
        },
        { id: 3,
            position: 3
        },
        { id: 4,
            position: 4
        },
        { id: 5,
            position: 5
        },
        { id: 6,
            position: 6
        },
        { id: 7,
            position: 7
        },
        { id: 8,
            position: 8
        },
        { id: 9,
            position: 9
        }
    ]


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

                <SectionBlock className='charts' title='Charts'>
                    <TrackList tracks={tracks} className='charts__list' />
                </SectionBlock>

                <SectionBlock className='new-releases' title='New Releases'>
                    <AlbumList albums={albums} className='new-releases__list' />
                </SectionBlock>

                <SectionBlock className='genres' title='Genres'>
                    <GenreList genres={genres} className='genres__list' />
                </SectionBlock>

                <SectionBlock className='artists section__block-last' title='Trending Artists'>
                    <ArtistList artists={artists} className='artists__list' />
                </SectionBlock>
            </div>
        </section>
    )
}