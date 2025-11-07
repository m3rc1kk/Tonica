import { createContext, useContext, useState, useRef } from "react";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const playTrack = (track) => {


        if (currentTrack?.id !== track.id) {
            setCurrentTrack(track);
            setIsPlaying(true);
            setTimeout(() => audioRef.current?.play(), 100);
        } else {
            if (isPlaying) {
                audioRef.current?.pause();
            } else {
                audioRef.current?.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <PlayerContext.Provider value={{ currentTrack, isPlaying, playTrack, audioRef }}>
            {children}
            <audio ref={audioRef} src={currentTrack?.audio_file || ""} />
        </PlayerContext.Provider>
    );
}

export const usePlayer = () => useContext(PlayerContext);
