import axios from "axios";
import { API_BASE_URL } from "./config";

const getAuthTokenFromCookies = () => {
    const cookieString = document.cookie;
    const cookies = cookieString.split("; ");
    const authTokenCookie = cookies.find((row) => row.startsWith("token"));
    return authTokenCookie ? authTokenCookie.split("=")[1] : null;
};

export const getPaymentsByApartmentId = async (apartmentId) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.get(`${API_BASE_URL}/payment/history/${apartmentId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching payments:", error);
        throw error;
    }
};

export const getBalanceByApartmentId = async (apartmentId) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.get(`${API_BASE_URL}/payment/apartment/${apartmentId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching payments:", error);
        throw error;
    }
};

export const createPayment = async (paymentData) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.post(`${API_BASE_URL}/payment`, paymentData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating payment:", error);
        throw error;
    }
};

export const deleteBalance = async (paymentId) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.delete(`${API_BASE_URL}/payment/${paymentId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting payment:", error);
        throw error;
    }
};


export const deletePayment = async (paymentId) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.delete(`${API_BASE_URL}/payment/history/${paymentId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting payment:", error);
        throw error;
    }
};

export const getDebt = async (apartmentId) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.get(`${API_BASE_URL}/payment/debt/${apartmentId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting payment:", error);
        throw error;
    }
};

export const pay = async (paymentData) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.post(`${API_BASE_URL}/payment/history`,paymentData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting payment:", error);
        throw error;
    }
};
