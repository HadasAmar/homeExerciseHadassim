import { Schema, model } from "mongoose";

const stockSchema = new Schema({
    name: { type: String, required: true, unique: true }, 
    quantity: { type: Number, required: true },            //current quantity in stock
    minQuantity: { type: Number, required: true }          // minimum quantity in stock
});

export const Stock = model("Stock", stockSchema);
