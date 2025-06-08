import axios from "axios";
import { API_BASE_URL } from "./config";

const getAuthTokenFromCookies = () => {
    const cookieString = document.cookie;
    const cookies = cookieString.split("; ");
    const authTokenCookie = cookies.find((row) => row.startsWith("token"));
    return authTokenCookie ? authTokenCookie.split("=")[1] : null;
};



export const approveToPay = async (apartmentId, meterIds) => {
    try {
        const authToken = getAuthTokenFromCookies();

        const approveData = {
            apartmentId,
            meterIds
        };
        console.log(approveData)
        const response = await axios.post(`${API_BASE_URL}/meter/approveToPay`, approveData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error approving payment for the meters:", error);
        throw error;
    }
};




export const getMetersByApartment = async (apartmentId) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.get(`${API_BASE_URL}/meter/apartment/${apartmentId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching meters for apartment:", error);
        throw error;
    }
};

export const createMeter = async (meterData) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.post(`${API_BASE_URL}/meter`, meterData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating meter:", error);
        throw error;
    }
};



export const updateMeter = async (meterId, updatedData) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.patch(`${API_BASE_URL}/meter/${meterId}`, updatedData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating meter:", error);
        throw error;
    }
};

export const deleteMeter = async (meterIds) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.delete(`${API_BASE_URL}/meter`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            data: { meterIds }
        });

        return response.data;
    } catch (error) {
        console.error("Error deleting meters:", error);
        throw error;
    }
};
