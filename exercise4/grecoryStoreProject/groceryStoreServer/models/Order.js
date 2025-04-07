import { Schema, model } from "mongoose";

const orderSchema = new Schema({
    supplierId: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
    supplierName: { type: String, required: true },
    items: [{
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        productName: { type: String, required: true }, 
        quantity: { type: Number, required: true }
    }],
    status: { type: String, enum: ["pending", "in process", "completed"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
});
export const Order = model("Order", orderSchema);