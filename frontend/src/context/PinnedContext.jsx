import { createContext, useContext, useState, useEffect } from "react";
import { fetchPinnedArtists, fetchPinnedAlbums } from "../api/musicAPI.js";


const PinnedContext = createContext(null);

export function PinnedProvider({ children }) {

    const [pinnedArtists, setPinnedArtists] = useState([]);
    const [pinnedAlbums, setPinnedAlbums] = useState([]);

    const [loading, setLoading] = useState(true);

    const loadPinned = async () => {
        try {
            const [artists, albums] = await Promise.all([
                fetchPinnedArtists(),
                fetchPinnedAlbums()
            ]);
            setPinnedArtists(artists);
            setPinnedAlbums(albums);
        } catch (error) {
            console.error('Error loading pinned items:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPinned();
    }, []);


    const refreshPinned = () => {
        loadPinned();
    };

    return (
        <PinnedContext.Provider value={{
            pinnedArtists,
            pinnedAlbums,
            loading,
            refreshPinned
        }}>
            {children}
        </PinnedContext.Provider>
    );
}

export const usePinned = () => useContext(PinnedContext);

