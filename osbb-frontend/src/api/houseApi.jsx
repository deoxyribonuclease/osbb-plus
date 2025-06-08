import axios from "axios";
import { API_BASE_URL } from "./config";

const getAuthTokenFromCookies = () => {
    const cookieString = document.cookie;
    const cookies = cookieString.split("; ");
    const authTokenCookie = cookies.find((row) => row.startsWith("token"));
    return authTokenCookie ? authTokenCookie.split("=")[1] : null;
};

export const getAllHouses = async () => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.get(`${API_BASE_URL}/house`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching houses:", error);
        throw error;
    }
};

export const getHousebyResidentId = async (residentId) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.get(`${API_BASE_URL}/house/resident/${residentId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching house:", error);
        throw error;
    }
};


export const getHouseByOSBBId = async (osbbId) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.get(`${API_BASE_URL}/house/osbb/${osbbId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching house:", error);
        throw error;
    }
};

export const createHouse = async (houseData) => {
    try {
        const authToken = getAuthTokenFromCookies();
        console.log(houseData)
        const response = await axios.post(`${API_BASE_URL}/house`, houseData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating house:", error);
        throw error;
    }
};

export const updateHouse = async (houseId, updatedData) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.patch(`${API_BASE_URL}/house/${houseId}`, updatedData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating house:", error);
        throw error;
    }
};

export const deleteHouse = async (houseId) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.delete(`${API_BASE_URL}/house/${houseId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting house:", error);
        throw error;
    }
};
