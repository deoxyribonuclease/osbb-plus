import axios from "axios";
import { API_BASE_URL } from "./config";

const getAuthTokenFromCookies = () => {
    const cookieString = document.cookie;
    const cookies = cookieString.split("; ");
    const authTokenCookie = cookies.find((row) => row.startsWith("token"));
    return authTokenCookie ? authTokenCookie.split("=")[1] : null;
};

export const getAllOSBBs = async () => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.get(`${API_BASE_URL}/osbb`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching OSBBs:", error);
        throw error;
    }
};

export const getOSBBById = async (osbbId) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.get(`${API_BASE_URL}/osbb/${osbbId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching OSBB:", error);
        throw error;
    }
};

export const getOSBBbyResidentId = async (residentId) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.get(`${API_BASE_URL}/osbb/resident/${residentId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching OSBBs:", error);
        throw error;
    }
};

export const getOSBBsByUserId = async (userId) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.get(`${API_BASE_URL}/osbb/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching OSBBs by userId:", error);
        throw error;
    }
};

export const updateOSBB = async (osbbId, updatedData) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.patch(`${API_BASE_URL}/osbb/${osbbId}`, updatedData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating OSBB:", error);
        throw error;
    }
};
