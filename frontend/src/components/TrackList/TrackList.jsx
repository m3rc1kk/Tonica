import Track from "../Track/Track.jsx";

export default function TrackList({tracks = [], className='', classNameItem=''}) {
    return (
            <ul className={`track__list ${className}`}>
                {tracks.map((track, index) => (
                    <li key={track.id} className={`track__item ${classNameItem}`}>
                        <Track
                            {...track}
                            chartPosition={track.chart_position || null}
                            queueTracks={tracks}
                            queueStartIndex={index}
                        />
                    </li>
                ))}
            </ul>
    )

}