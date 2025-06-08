import axios from "axios";
import { API_BASE_URL } from "./config";

const getAuthTokenFromCookies = () => {
    const cookieString = document.cookie;
    const cookies = cookieString.split("; ");
    const authTokenCookie = cookies.find((row) => row.startsWith("token"));
    return authTokenCookie ? authTokenCookie.split("=")[1] : null;
};


export const getApartmentByResidentId = async (residentId) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.get(`${API_BASE_URL}/apartment/resident/${residentId}`, {
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



export const getApartmentsByHouse = async (houseId) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.get(`${API_BASE_URL}/apartment/house/${houseId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching apartments for house:", error);
        throw error;
    }
};

export const createApartment = async (apartmentData) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.post(`${API_BASE_URL}/apartment`, apartmentData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating apartment:", error);
        throw error;
    }
};

export const updateApartment = async (apartmentId, updatedData) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.patch(`${API_BASE_URL}/apartment/${apartmentId}`, updatedData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating apartment:", error);
        throw error;
    }
};

export const deleteApartment = async (apartmentId) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.delete(`${API_BASE_URL}/apartment/${apartmentId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting apartment:", error);
        throw error;
    }
};

export const createResidentAccount = async (apartmentId, userData) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.post(
            `${API_BASE_URL}/apartment/${apartmentId}/createResidentAccount`,
            userData,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error creating resident account:", error);
        throw error;
    }
};
