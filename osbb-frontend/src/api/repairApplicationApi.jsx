import axios from "axios";
import { API_BASE_URL } from "./config";

const getAuthTokenFromCookies = () => {
    const cookieString = document.cookie;
    const cookies = cookieString.split("; ");
    const authTokenCookie = cookies.find((row) => row.startsWith("token"));
    return authTokenCookie ? authTokenCookie.split("=")[1] : null;
};


export const getRepairApplicationsByApartment = async (apartmentId) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.get(`${API_BASE_URL}/rep-apl/apartment/${apartmentId}`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching repair applications by apartment:", error);
        throw error;
    }
};

export const getRepairApplicationsByOsbb = async (osbbId) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.get(`${API_BASE_URL}/rep-apl/osbb/${osbbId}`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching repair applications by osbb:", error);
        throw error;
    }
};


export const createRepairApplication = async (applicationData) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.post(`${API_BASE_URL}/rep-apl`, applicationData, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating repair application:", error);
        throw error;
    }
};

export const updateRepairApplication = async (id, updatedData) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.patch(`${API_BASE_URL}/rep-apl/${id}`, updatedData, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating repair application:", error);
        throw error;
    }
};

export const deleteRepairApplication = async (id) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.delete(`${API_BASE_URL}/rep-apl/${id}`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting repair application:", error);
        throw error;
    }
};
