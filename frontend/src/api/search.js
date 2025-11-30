import api from "./axios.js";

export async function searchArtists(query, limit = 4) {
    try {
        const response = await api.get(`artists/?search=${encodeURIComponent(query)}&limit=${limit}`);
        return response.data.results || response.data || [];
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data?.detail || "Failed to search artists");
        }
        throw new Error("Network error");
    }
}

export async function searchTracks(query, limit = 9) {
    try {
        const response = await api.get(`tracks/?search=${encodeURIComponent(query)}&limit=${limit}`);
        return response.data.results || response.data || [];
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data?.detail || "Failed to search tracks");
        }
        throw new Error("Network error");
    }
}

export async function searchAlbums(query, limit = 5) {
    try {
        const response = await api.get(`albums/?search=${encodeURIComponent(query)}&limit=${limit}`);
        return response.data.results || response.data || [];
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data?.detail || "Failed to search albums");
        }
        throw new Error("Network error");
    }
}