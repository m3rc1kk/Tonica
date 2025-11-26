import api from "./axios.js";

export async function fetchTrendingArtists(limit=5) {
    try {
        const response = await api.get(`artists/?limit=${limit}`);
        return response.data.results || response.data || [];
    } catch(error) {
        if (error.response) {
            throw new Error(error.response.data?.detail || "Failed to load artists");
        }
        throw new Error("Network error");
    }
}

export async function fetchArtistDetail(id) {
    try {
        const response = await api.get(`artists/${id}/`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data?.detail || "Failed to load artists");
        }
        throw new Error("Network error");
    }
}

export async function fetchChartTracks(limit=9) {
    try {
        const response = await api.get(`tracks/?limit=${limit}`);
        return response.data.results || response.data || [];
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data?.detail || "Failed to load tracks");
        }
        throw new Error("Network error");
    }
}

export async function fetchNewReleases(limit=5) {
    try {
        const response = await api.get(`albums/?limit=${limit}`);
        return response.data.results || response.data || [];
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data?.detail || "Failed to load albums");
        }
        throw new Error("Network error");
    }
}

export async function fetchAllPublishedAlbums() {
    try {
        const response = await api.get(`albums/`);
        return response.data.results || response.data || [];
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data?.detail || "Failed to load albums");
        }
        throw new Error("Network error");
    }
}

export async function fetchTrendTracks(limit=4) {
    try {
        const response = await api.get(`tracks/?limit=${limit}`);
        return response.data.results || response.data || [];
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data?.detail || "Failed to load tracks");
        }
        throw new Error("Network error");
    }
}

export async function fetchTrendAlbum(limit=1) {
    try {
        const response = await api.get(`albums/?limit=${limit}`);
        const data = response.data.results || response.data || [];
        return Array.isArray(data) ? data : [data];
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data?.detail || "Failed to load albums");
        }
        throw new Error("Network error");
    }
}


export async function fetchArtistAlbums(artistId, limit=5) {
    try {
        const response = await api.get(`albums/?artist_id=${artistId}&limit=${limit}`);
        return response.data.results || response.data || [];
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data?.detail || "Failed to load albums");
        }
        throw new Error("Network error");
    }
}

export async function fetchArtistTracks(artistId, limit=9) {
    try {
        const response = await api.get(`tracks/?artist_id=${artistId}&limit=${limit}`);
        return response.data.results || response.data || [];
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data?.detail || "Failed to load tracks");
        }
        throw new Error("Network error");
    }
}

export async function submitArtistApplication(data) {
    try {
        const response = await api.post(`application/apply/`, data);
        return response.data
    } catch (error) {
        let message = "Unknown error";

        if (error.response?.data) {
            const data = error.response.data;

            if (data.detail) {
                // DRF возвращает detail при PermissionDenied и некоторых ValidationError
                message = data.detail;
            } else if (data.non_field_errors) {
                message = data.non_field_errors[0];
            } else {
                // любые поля
                const firstKey = Object.keys(data)[0];
                if (Array.isArray(data[firstKey])) {
                    message = data[firstKey][0];
                } else if (typeof data[firstKey] === "string") {
                    message = data[firstKey];
                }
            }
        }

        throw new Error(message);
    }
}

export async function fetchAlbumDetail(albumId) {
    try {
        const response = await api.get(`albums/${albumId}/`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data?.detail || "Failed to load album");
        }
        throw new Error("Network error");
    }
}

export async function fetchFavoriteTracks(limit=9) {
    try {
        const response = await api.get(`favorites/tracks/?limit=${limit}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to load favorite tracks");
    }
}

export async function fetchAllFavoriteTracks() {
    try {
        const response = await api.get(`favorites/tracks/`);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to load favorite tracks");
    }
}

export async function addTrackToFavorites(trackId) {
    try {
        const response = await api.post(`favorites/tracks/${trackId}/add/`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to add track to favorites");
    }
}

export async function removeTrackFromFavorites(trackId) {
    try {
        const response = await api.delete(`favorites/tracks/${trackId}/remove/`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to remove track from favorites");
    }
}

export async function fetchFavoriteAlbums(limit=5) {
    try {
        const response = await api.get(`favorites/albums/?limit=${limit}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to load favorite albums");
    }
}

export async function fetchAllFavoriteAlbums() {
    try {
        const response = await api.get(`favorites/albums/`);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to load favorite albums");
    }
}

export async function addAlbumToFavorites(albumId) {
    try {
        const response = await api.post(`favorites/albums/${albumId}/add/`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to add album to favorites");
    }
}

export async function removeAlbumFromFavorites(albumId) {
    try {
        const response = await api.delete(`favorites/albums/${albumId}/remove/`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to remove album from favorites");
    }
}

export async function fetchFavoriteArtists(limit=4) {
    try {
        const response = await api.get(`favorites/artists/?limit=${limit}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to load favorite artists");
    }
}

export async function fetchAllFavoriteArtists() {
    try {
        const response = await api.get(`favorites/artists/`);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to load favorite artists");
    }
}

export async function addArtistToFavorites(artistId) {
    try {
        const response = await api.post(`favorites/artists/${artistId}/add/`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to add artist to favorites");
    }
}

export async function removeArtistFromFavorites(artistId) {
    try {
        const response = await api.delete(`favorites/artists/${artistId}/remove/`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to remove artist from favorites");
    }
}



export async function fetchPinnedArtists() {
    try {
        const response = await api.get('pins/artists/');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to load pinned artists");
    }
}

export async function pinArtist(artistId) {
    try {
        const response = await api.post(`pins/artists/${artistId}/add/`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to pin artist");
    }
}

export async function unpinArtist(artistId) {
    try {
        const response = await api.delete(`pins/artists/${artistId}/remove/`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to unpin artist");
    }
}

export async function fetchPinnedAlbums() {
    try {
        const response = await api.get('pins/albums/');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to load pinned albums");
    }
}

export async function pinAlbum(albumId) {
    try {
        const response = await api.post(`pins/albums/${albumId}/add/`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to pin album");
    }
}

export async function unpinAlbum(albumId) {
    try {
        const response = await api.delete(`pins/albums/${albumId}/remove/`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to unpin album");
    }
}


export async function fetchPinnedPlaylists() {
    try {
        const response = await api.get('pins/playlists/');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to load pinned playlists");
    }
}

export async function pinPlaylist(playlistId) {
    try {
        const response = await api.post(`pins/playlists/${playlistId}/add/`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to pin playlist");
    }
}

export async function unpinPlaylist(playlistId) {
    try {
        const response = await api.delete(`pins/playlists/${playlistId}/remove/`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to unpin playlist");
    }
}


export async function fetchPlaylists(limit=4) {
    try {
        const response = await api.get(`playlists/?limit=${limit}`);
        const data = response.data.results || response.data;
        const playlists = Array.isArray(data) ? data : [];
        // Ограничиваем на клиенте, если бэкенд не обработал limit
        return playlists.slice(0, limit);
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data?.detail || "Failed to load playlists");
        }
        throw new Error("Network error");
    }
}

export async function fetchAllPlaylists() {
    try {
        const response = await api.get(`playlists/`);
        const data = response.data.results || response.data;
        return Array.isArray(data) ? data : [];
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data?.detail || "Failed to load playlists");
        }
        throw new Error("Network error");
    }
}

export async function fetchPlaylistDetail(playlistId) {
    try {
        const response = await api.get(`playlists/${playlistId}/`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data?.detail || "Failed to load playlist");
        }
        throw new Error("Network error");
    }
}

export async function createPlaylist(data) {
    try {
        // Если data - это FormData, используем multipart/form-data заголовок
        const config = data instanceof FormData ? {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        } : {};
        
        const response = await api.post('playlists/', data, config);
        return response.data;
    } catch (error) {
        if (error.response) {
            const errorData = error.response.data;
            if (errorData.detail) {
                throw new Error(errorData.detail);
            } else if (errorData.non_field_errors) {
                throw new Error(errorData.non_field_errors[0]);
            } else {
                const firstKey = Object.keys(errorData)[0];
                if (Array.isArray(errorData[firstKey])) {
                    throw new Error(errorData[firstKey][0]);
                } else if (typeof errorData[firstKey] === "string") {
                    throw new Error(errorData[firstKey]);
                }
            }
        }
        throw new Error("Network error");
    }
}

export async function updatePlaylist(playlistId, data) {
    try {
        // Если data - это FormData, используем multipart/form-data заголовок
        const config = data instanceof FormData ? {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        } : {};
        
        const response = await api.patch(`playlists/${playlistId}/`, data, config);
        return response.data;
    } catch (error) {
        if (error.response) {
            const errorData = error.response.data;
            if (errorData.detail) {
                throw new Error(errorData.detail);
            } else if (errorData.non_field_errors) {
                throw new Error(errorData.non_field_errors[0]);
            } else {
                const firstKey = Object.keys(errorData)[0];
                if (Array.isArray(errorData[firstKey])) {
                    throw new Error(errorData[firstKey][0]);
                } else if (typeof errorData[firstKey] === "string") {
                    throw new Error(errorData[firstKey]);
                }
            }
            throw new Error(error.response.data?.detail || "Failed to update playlist");
        }
        throw new Error("Network error");
    }
}

export async function deletePlaylist(playlistId) {
    try {
        const response = await api.delete(`playlists/${playlistId}/`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data?.detail || "Failed to delete playlist");
        }
        throw new Error("Network error");
    }
}

export async function addTrackToPlaylist(playlistId, trackId, order = null) {
    try {
        const data = { track_id: trackId };
        if (order !== null) {
            data.order = order;
        }
        const response = await api.post(`playlists/${playlistId}/add_track/`, data);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data?.error || error.response.data?.detail || "Failed to add track to playlist");
        }
        throw new Error("Network error");
    }
}

export async function removeTrackFromPlaylist(playlistId, trackId) {
    try {
        const response = await api.delete(`playlists/${playlistId}/remove_track/?track_id=${trackId}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data?.error || error.response.data?.detail || "Failed to remove track from playlist");
        }
        throw new Error("Network error");
    }
}


