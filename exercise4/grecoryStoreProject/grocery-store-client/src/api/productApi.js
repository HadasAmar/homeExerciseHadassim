import axios from "axios";

const API_URL = "http://localhost:8080/products";  

// function to get products of the supplier
export const getProductsApi = async (token) => {
    try {
        console.log("getProductsApi:", token); 
        const response = await axios.get(`${API_URL}/getProducts`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("after getProductsApi:", response);
        return response.data;  
    } catch (error) {
        throw new Error(error.response?.data?.message || "error in loading products");
    }
};

// function to add a new product
export const addProductApi = async (productData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_URL}/addProduct`, productData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "שגיאה בהוספת המוצר");
    }
};
