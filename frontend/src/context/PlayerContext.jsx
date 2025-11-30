import { createContext, useContext, useState, useRef, useEffect } from "react";
import { registerTrackPlay } from "../api/musicAPI.js";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);
    const [volume, setVolume] = useState(1);
    const playRegisteredRef = useRef(false);
    const [queue, setQueue] = useState([]);
    const [currentQueueIndex, setCurrentQueueIndex] = useState(-1); 


    const changeVolume = (value) => {
        const v = Math.min(Math.max(value, 0), 1); 
        setVolume(v);
        if (audioRef.current) {
            audioRef.current.volume = v;
        }
    };




    const playTrack = (track, tracks = null, startIndex = 0) => {
        // Если передан массив треков, устанавливаем очередь
        if (tracks && Array.isArray(tracks) && tracks.length > 0) {
            setQueue(tracks);
            const index = tracks.findIndex(t => t.id === track.id);
            setCurrentQueueIndex(index >= 0 ? index : startIndex);
            const trackToPlay = tracks[index >= 0 ? index : startIndex];
            playRegisteredRef.current = false;
            setCurrentTrack(trackToPlay);
            setIsPlaying(true);
            setTimeout(() => audioRef.current?.play(), 100);
            return;
        }

        // Обычное воспроизведение одного трека
        if (currentTrack?.id !== track.id) {
            playRegisteredRef.current = false;
            setCurrentTrack(track);
            setIsPlaying(true);
            setTimeout(() => audioRef.current?.play(), 100);
        } else {
            setCurrentTrack(track);
            if (isPlaying) {
                audioRef.current?.pause();
            } else {
                audioRef.current?.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const playFromQueue = (tracks, startIndex = 0) => {
        if (!tracks || tracks.length === 0) return;
        
        setQueue(tracks);
        setCurrentQueueIndex(startIndex);
        const trackToPlay = tracks[startIndex];
        playRegisteredRef.current = false;
        setCurrentTrack(trackToPlay);
        setIsPlaying(true);
        setTimeout(() => audioRef.current?.play(), 100);
    };

    const nextTrack = () => {
        if (queue.length === 0 || currentQueueIndex < 0) return;
        
        const nextIndex = currentQueueIndex + 1;
        if (nextIndex < queue.length) {
            setCurrentQueueIndex(nextIndex);
            const track = queue[nextIndex];
            playRegisteredRef.current = false;
            setCurrentTrack(track);
            setIsPlaying(true);
            setTimeout(() => audioRef.current?.play(), 100);
        }
    };

    const prevTrack = () => {
        if (queue.length === 0 || currentQueueIndex < 0) return;
        
        const prevIndex = currentQueueIndex - 1;
        if (prevIndex >= 0) {
            setCurrentQueueIndex(prevIndex);
            const track = queue[prevIndex];
            playRegisteredRef.current = false;
            setCurrentTrack(track);
            setIsPlaying(true);
            setTimeout(() => audioRef.current?.play(), 100);
        }
    };

    const hasNextTrack = () => {
        return queue.length > 0 && currentQueueIndex >= 0 && currentQueueIndex < queue.length - 1;
    };

    const hasPrevTrack = () => {
        return queue.length > 0 && currentQueueIndex > 0;
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

        const checkPlayRegistration = () => {
            if (!currentTrack?.id || playRegisteredRef.current) return;
            
            const currentTime = audio.currentTime;
            const totalDuration = audio.duration;
            
            const minSeconds = 30;
            const minPercentage = 0.5;
            
            if (totalDuration > 0 && (
                currentTime >= minSeconds || 
                currentTime >= totalDuration * minPercentage
            )) {
                playRegisteredRef.current = true;
                registerTrackPlay(currentTrack.id).catch(err => {
                    console.error('Error registering track play:', err);
                    playRegisteredRef.current = false;
                });
            }
        };

        const handleTimeUpdate = () => {
            updateProgress();
            checkPlayRegistration();
        };

        const handleEnded = () => {
            // Автоматически переключаемся на следующий трек при завершении
            if (queue.length > 0 && currentQueueIndex >= 0 && currentQueueIndex < queue.length - 1) {
                const nextIndex = currentQueueIndex + 1;
                setCurrentQueueIndex(nextIndex);
                const track = queue[nextIndex];
                playRegisteredRef.current = false;
                setCurrentTrack(track);
                setIsPlaying(true);
                setTimeout(() => audioRef.current?.play(), 100);
            } else {
                setIsPlaying(false);
                setProgress(0);
                if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                }
            }
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", updateProgress);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", updateProgress);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [audioRef, currentTrack, queue, currentQueueIndex]);


    const seekTo = (value) => {
        if (audioRef.current) {
            audioRef.current.currentTime = value;
            setProgress(value);
        }
    };

    const resetPlayer = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setCurrentTrack(null);
        setIsPlaying(false);
        setProgress(0);
        setDuration(0);
        playRegisteredRef.current = false;
        setQueue([]);
        setCurrentQueueIndex(-1);
    }

    return (
        <PlayerContext.Provider value={{
            currentTrack,
            setCurrentTrack,
            isPlaying,
            playTrack,
            progress,
            duration,
            seekTo,
            audioRef,
            changeVolume,
            volume,
            resetPlayer,
            queue,
            setQueue,
            currentQueueIndex,
            playFromQueue,
            nextTrack,
            prevTrack,
            hasNextTrack,
            hasPrevTrack
        }}>
            {children}
            <audio ref={audioRef} src={currentTrack?.audio_file || ""} />
        </PlayerContext.Provider>
    );
}

export const usePlayer = () => useContext(PlayerContext);
