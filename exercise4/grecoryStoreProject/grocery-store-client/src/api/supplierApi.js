import axios from "axios";

const API_URL = "http://localhost:8080/suppliers";

// Function to register a new supplier
export const registerSupplierApi = async (supplierData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, supplierData);
        console.log("Registration response:", response.data); 
        return response.data; 
    } catch (error) {
        throw error.response?.data?.message || "Registration failed";
    }
};

// Function to login the supplier
export const loginSupplierApi = async (supplierData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, supplierData);
        console.log("Login response:", response.data); 
        return response.data; 
    } catch (error) {
        throw error.response?.data?.message || "Login failed";
    }
};

// Function to get all suppliers
export const getSuppliersApi = async (token) => {
    try {
        console.log("Get suppliers:", token); 
        const response = await axios.get(`${API_URL}/getSupplier`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data; //returns the list of suppliers
    } catch (error) {
        throw error.response?.data?.message || "get failed";
    }
};
