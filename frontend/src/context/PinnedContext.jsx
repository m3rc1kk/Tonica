import { createContext, useContext, useState, useEffect } from "react";
import { fetchPinnedArtists, fetchPinnedAlbums, fetchPinnedPlaylists } from "../api/musicAPI.js";


const PinnedContext = createContext(null);

export function PinnedProvider({ children }) {

    const [pinnedArtists, setPinnedArtists] = useState([]);
    const [pinnedAlbums, setPinnedAlbums] = useState([]);
    const [pinnedPlaylists, setPinnedPlaylists] = useState([]);

    const [loading, setLoading] = useState(true);

    const loadPinned = async () => {
        // Проверяем наличие токена перед загрузкой закрепленных элементов
        const token = localStorage.getItem("access");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const [artists, albums, playlists] = await Promise.all([
                fetchPinnedArtists(),
                fetchPinnedAlbums(),
                fetchPinnedPlaylists()
            ]);
            setPinnedArtists(artists);
            setPinnedAlbums(albums);
            setPinnedPlaylists(playlists);
        } catch (error) {
            // Игнорируем ошибки 401 (Unauthorized) - это нормально для неавторизованных пользователей
            if (error.response?.status !== 401) {
                console.error('Error loading pinned items:', error);
            }
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
            pinnedPlaylists,
            loading,
            refreshPinned
        }}>
            {children}
        </PinnedContext.Provider>
    );
}

export const usePinned = () => useContext(PinnedContext);

