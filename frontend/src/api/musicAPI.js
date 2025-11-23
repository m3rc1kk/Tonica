import api from "./axios.js";

export async function fetchTrendingArtists(limit=5) {
    try {
        const response = await api.get(`artists/?limit=${limit}`);
        return response.data.results;
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
        return response.data.results;
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
        return response.data.results;
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
        return response.data.results;
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
        return response.data.results;
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
        return response.data.results;
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
        return response.data.results;
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

export async function fetchFavoriteTracks() {
    try {
        const response = await api.get('favorites/tracks/');
        return response.data;
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

export async function fetchFavoriteAlbums() {
    try {
        const response = await api.get('favorites/albums/');
        return response.data;
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

export async function fetchFavoriteArtists() {
    try {
        const response = await api.get('favorites/artists/');
        return response.data;
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

