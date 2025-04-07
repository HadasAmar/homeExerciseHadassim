import { Schema, model } from "mongoose";

const supplierSchema = new Schema({
    companyName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    representativeName: { type: String, required: true },
    password: { type: String, required: true },
    products: [{
        name: { type: String, required: true },
        price: { type: Number, required: true },
        minQuantity: { type: Number, required: true }
    }]
});

export const Supplier = model("Supplier", supplierSchema);