import { Router } from "express";
import { createOrder,getOrdersBySupplier, getOrdersByStoreOwner, confirmOrder, completeOrder } from "../controllers/orderController.js";
import { authenticateToken, authorizeOwner, authorizeSupplier } from "../middleware/auth.js";

const orderRoute = Router();

orderRoute.get("/getOrdersSupplier",authenticateToken, authorizeSupplier, getOrdersBySupplier);

orderRoute.get("/getOrdersOwner", authenticateToken, authorizeOwner, getOrdersByStoreOwner);

orderRoute.put("/confirm/:id", authenticateToken, authorizeSupplier,confirmOrder);

orderRoute.put("/complete/:id",authenticateToken, authorizeOwner, completeOrder);

orderRoute.post("/newOrder",authenticateToken, authorizeOwner, createOrder);


export default orderRoute;
