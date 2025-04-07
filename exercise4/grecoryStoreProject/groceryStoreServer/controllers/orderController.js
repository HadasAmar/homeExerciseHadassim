import { Order } from "../models/Order.js";
import { Stock } from "../models/Stock.js";

// view orders by supplier
export const getOrdersBySupplier = async (req, res) => {
    try {
        const orders = await Order.find({ supplierId: req.user.id }) // מחפש רק הזמנות של הספק המחובר
        res.status(200).json(orders); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//view all orders by store owner
export const getOrdersByStoreOwner = async (req, res) => {
    try {
        console.log("Getting orders for store owner...");
        const orders = await Order.find()// כל ההזמנות
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//add new order
export const createOrder = async (req, res) => {
    const { supplierId, supplierName, items } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: "The order must include products" });
    }

    try {
        const newOrder = new Order({
            supplierId,
            supplierName,
            items,
            status: "pending",  // default status
        });

        await newOrder.save();

        for (const item of newOrder.items) {//תוספת לבונוס, עדכון המלאי
            const stockItem = await Stock.findOne({ name: item.productName });
            if (stockItem) {
                stockItem.quantity += item.quantity;
                await stockItem.save();
            }
        }

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// update order status to "completed"
export const completeOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.status = "completed"; 
        await order.save();
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// update order status to "in process"
export const confirmOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        console.log("order", order); 
        order.status = "in process"; 
        await order.save();
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
