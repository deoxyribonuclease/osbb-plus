import axios from "axios";
import { API_BASE_URL } from "./config";

const getAuthTokenFromCookies = () => {
    const cookieString = document.cookie;
    const cookies = cookieString.split("; ");
    const authTokenCookie = cookies.find((row) => row.startsWith("token"));
    return authTokenCookie ? authTokenCookie.split("=")[1] : null;
};

export const getExpensesByOsbbId = async (osbbId) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.get(`${API_BASE_URL}/expense/osbb/${osbbId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching expenses:", error);
        throw error;
    }
};

export const createExpense = async (expenseData) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.post(`${API_BASE_URL}/expense`, expenseData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating expense:", error);
        throw error;
    }
};

export const updateExpense = async (expenseId, updatedData) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.patch(`${API_BASE_URL}/expense/${expenseId}`, updatedData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating expense:", error);
        throw error;
    }
};

export const deleteExpense = async (expenseId) => {
    try {
        const authToken = getAuthTokenFromCookies();
        const response = await axios.delete(`${API_BASE_URL}/expense/${expenseId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting expense:", error);
        throw error;
    }
};
