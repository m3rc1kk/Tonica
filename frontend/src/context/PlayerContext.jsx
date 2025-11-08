import { createContext, useContext, useState, useRef, useEffect } from "react";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);
    const [volume, setVolume] = useState(1); // 1 = 100% громкости


    const changeVolume = (value) => {
        const v = Math.min(Math.max(value, 0), 1); // ограничиваем от 0 до 1
        setVolume(v);
        if (audioRef.current) {
            audioRef.current.volume = v;
        }
    };




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

    useEffect(() => {
        let animationFrame;

        const update = () => {
            if (audioRef.current && !isNaN(audioRef.current.duration)) {
                setProgress(audioRef.current.currentTime);
            }
            animationFrame = requestAnimationFrame(update);
        };

        if (isPlaying) {
            animationFrame = requestAnimationFrame(update);
        }

        return () => cancelAnimationFrame(animationFrame);
    }, [isPlaying]);



    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            setProgress(audio.currentTime);
            setDuration(audio.duration || 0);
        };

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("loadedmetadata", updateProgress);

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("loadedmetadata", updateProgress);
        };
    }, [audioRef]);


    const seekTo = (value) => {
        if (audioRef.current) {
            audioRef.current.currentTime = value;
            setProgress(value);
        }
    };

    return (
        <PlayerContext.Provider value={{
            currentTrack,
            isPlaying,
            playTrack,
            progress,
            duration,
            seekTo,
            audioRef,
            changeVolume,
            volume
        }}>
            {children}
            <audio ref={audioRef} src={currentTrack?.audio_file || ""} />
        </PlayerContext.Provider>
    );
}

export const usePlayer = () => useContext(PlayerContext);
