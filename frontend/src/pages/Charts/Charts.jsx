import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import Header from "../../components/Header/Header.jsx";
import SectionBlock from "../../components/Section/SectionBlock.jsx";
import TrackList from "../../components/TrackList/TrackList.jsx";
import { fetchChartTracks } from "../../api/musicAPI.js";
import home from '../../assets/images/header/home.svg'

export default function Charts() {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadCharts() {
            try {
                setLoading(true);
                const data = await fetchChartTracks(30);
                setTracks(Array.isArray(data) ? data : []);
                setError(null);
            } catch (err) {
                console.error('Error loading charts:', err);
                setError(err.message);
                setTracks([]);
            } finally {
                setLoading(false);
            }
        }
        loadCharts();
    }, []);

    return (
        <section className='charts-page container section'>
            <Sidebar />

            <div className="charts-page__inner section__inner">
                <Header
                    icon={home}
                    title='Home'
                />
                
                {loading && (
                    <div className="charts-page__loading">
                        <p>Loading charts...</p>
                    </div>
                )}

                {error && (
                    <div className="charts-page__error">
                        <p>Error: {error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <SectionBlock className='charts section__block-last' title='Charts' isLink={false}>
                        <TrackList tracks={tracks} className='charts__list' classNameItem='charts__item' />
                    </SectionBlock>
                )}
            </div>
        </section>
    )
}

