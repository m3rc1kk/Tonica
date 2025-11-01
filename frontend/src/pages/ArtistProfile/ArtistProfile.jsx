import ButtonLink from "../../components/Button/ButtonLink.jsx";
import SectionBlock from "../../components/Section/SectionBlock.jsx";
import TrackList from "../../components/TrackList/TrackList.jsx";
import AlbumList from "../../components/AlbumList/AlbumList.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import HeaderSmall from "../../components/HeaderSmall/HeaderSmall.jsx";
import avatar from '../../assets/images/artist/pepel.webp'
import play from '../../assets/images/artist-profile/play.svg'
import favorite from '../../assets/images/artist-profile/favorite.svg'
import pin from '../../assets/images/artist-profile/pin.svg'
import settings from '../../assets/images/artist-profile/settings.svg'

export default function ArtistProfile() {
    const albums = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
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
        <section className="artist-profile section container">
            <Sidebar />
            <div className="artist-profile__inner section__inner">
                <HeaderSmall />
                <div className="artist-profile__body">
                    <img src={avatar} width={300} height={300} loading='lazy' alt="" className="artist-profile__avatar"/>
                    <div className="artist-profile__info">
                        <span className="artist-profile__fullname ">Dmitry Artemyev</span>
                        <h1 className="artist-profile__stage-name title--accent">Pepel Nahudi</h1>
                        <span className="artist-profile__listeners"><span className="artist-profile__listeners--accent">22.542.342</span>  listeners <span className="artist-profile__listeners--hidden">per month</span> </span>
                        <div className="artist-profile__buttons">
                            <ButtonLink to={'/'} className="artist-profile__play artist-profile__button">
                                <img src={play} width={52} height={52} loading='lazy' alt="" className="artist-profile__button-icon artist-profile__button-icon--play"/>
                            </ButtonLink>
                            <ButtonLink to={'/'} className="artist-profile__favorite artist-profile__button">
                                <img src={favorite} width={52} height={52} loading='lazy' alt="" className="artist-profile__button-icon"/>
                            </ButtonLink>
                            <ButtonLink to={'/'} className="artist-profile__pin artist-profile__button">
                                <img src={pin} width={52} height={52} loading='lazy' alt="" className="artist-profile__button-icon"/>
                            </ButtonLink>
                            <ButtonLink to={'/'} className="artist-profile__settings artist-profile__button">
                                <img src={settings} width={52} height={52} loading='lazy' alt="" className="artist-profile__button-icon"/>
                            </ButtonLink>
                        </div>
                    </div>
                </div>
                <SectionBlock className='tracks' title='Tracks'>
                    <TrackList tracks={tracks} className='charts__list' />
                </SectionBlock>

                <SectionBlock className='albums' title='Albums'>
                    <AlbumList albums={albums} className='new-releases__list section__block-last' />
                </SectionBlock>


            </div>
        </section>
    )
}