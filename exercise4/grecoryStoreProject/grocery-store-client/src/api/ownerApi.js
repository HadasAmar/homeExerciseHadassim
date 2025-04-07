import axios from "axios";

const API_URL = "http://localhost:8080/owner";

// Function to login the owner
export const loginOwnerApi = async (OwnerData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, OwnerData);
        console.log("Login owner:", response.data); 
        return response.data; 
    } catch (error) {
        throw error.response?.data?.message || "Login failed";
    }
};

