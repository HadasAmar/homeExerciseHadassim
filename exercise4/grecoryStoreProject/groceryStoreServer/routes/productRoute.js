import { Router } from "express";
import {  addProduct, getProducts } from "../controllers/productController.js";
import { authenticateToken, authorizeSupplier } from "../middleware/auth.js";

const productRoute = Router();

productRoute.get('/getProducts', authenticateToken, authorizeSupplier, getProducts);
productRoute.post('/addProduct', authenticateToken, authorizeSupplier, addProduct);

export default productRoute;
