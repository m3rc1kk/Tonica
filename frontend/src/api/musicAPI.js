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
