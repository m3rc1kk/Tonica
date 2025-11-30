import Track from "../Track/Track.jsx";

export default function TrackList({tracks = [], className='', classNameItem=''}) {
    return (
            <ul className={`track__list ${className}`}>
                {tracks.map((track) => (
                    <li key={track.id} className={`track__item ${classNameItem}`}>
                        <Track
                            {...track}
                            chartPosition={track.chart_position || null}
                        />
                    </li>
                ))}
            </ul>
    )

}