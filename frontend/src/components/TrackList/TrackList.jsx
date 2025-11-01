import Track from "../Track/Track.jsx";

export default function TrackList({tracks = [], className=''}) {
    return (
            <ul className={`track__list ${className}`}>
                {tracks.map((track) => (
                    <li key={track.id} className="track__item">
                        <Track
                            {...track}
                        />
                    </li>
                ))}
            </ul>
    )

}