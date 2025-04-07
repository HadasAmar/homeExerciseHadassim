import { copyWithStructuralSharing } from "@reduxjs/toolkit/query";
import axios from "axios";

const API_URL = "http://localhost:8080/orders"; 

// function to get all orders by supplier id
export const getOrdersBySupplierApi = async (token) => {
    console.log("token", token); 
    try {
        const response = await axios.get(`${API_URL}/getOrdersSupplier`, {
            headers: { Authorization: `Bearer ${token}` } 
        });
        console.log("API response:", response); 
        return response.data;
    } catch (error) {
        console.error("Error fetching orders sss:", error); 
        throw error; 
    }
};

// function to get all orders by store owner
export const getOrdersByStoreOwnerApi = async (token) => {
    try {
        console.log("getOrdersByStoreOwnerApi:", token); 
        const response = await axios.get(`${API_URL}/getOrdersOwner`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching orders owner:", error); 
        throw error;
    }
};

// function to create a new order
export const createOrderApi = async ({ orderData, token }) => {
    try {
        console.log("token",token); 
        const response = await axios.post(`${API_URL}/newOrder`,
            orderData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error; 
    };
}

// function to update the order status by supplier
export const updateOrderStatusApi = async ({orderId, status, token}) => {
    try {
        console.log("orderId:", orderId, "status:", status, "token:", token); 
        const response = await axios.put(
            `${API_URL}/confirm/${orderId}`,
            { status }, 
            {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            }
        );
        return response.data; 
    } catch (error) {
        console.error("an error in update order status", error); 
        throw error; 
    }
};


// function to update the order status by store owner
export const completeOrderApi = async ({orderId, status, token}) => {
    try {
        console.log("Completing order:", orderId, "token:", token);
        const response = await axios.put(
            `${API_URL}/complete/${orderId}`,
            {status},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error completing order:", error);
        throw error;
    }
};



