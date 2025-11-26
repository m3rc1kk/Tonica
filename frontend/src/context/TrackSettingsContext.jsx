import { createContext, useContext, useState } from "react";

const TrackSettingsContext = createContext(null);

export function TrackSettingsProvider({ children }) {
    const [openTrackId, setOpenTrackId] = useState(null);

    const openTrackSettings = (trackId) => {
        setOpenTrackId(trackId);
    };

    const closeTrackSettings = () => {
        setOpenTrackId(null);
    };

    const isTrackOpen = (trackId) => {
        return openTrackId === trackId;
    };

    return (
        <TrackSettingsContext.Provider value={{
            openTrackId,
            openTrackSettings,
            closeTrackSettings,
            isTrackOpen
        }}>
            {children}
        </TrackSettingsContext.Provider>
    );
}

export const useTrackSettings = () => useContext(TrackSettingsContext);

