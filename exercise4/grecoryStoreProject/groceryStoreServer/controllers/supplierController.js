import { Supplier } from "../models/Supplier.js";
import jwt from "jsonwebtoken";

//new supplier registration
export const registerSupplier = async (req, res) => {
    console.log("Registering supplier...");
    console.log(req.body);

    const { companyName, phoneNumber, representativeName, password, products } = req.body;
    const existingSupplier = await Supplier.findOne({ phoneNumber });
    if (existingSupplier) {
        return res.status(400).json({ message: "The phone number is already registered in the system" });
    }

    try {

        const newSupplier = new Supplier({
            companyName,
            phoneNumber,
            representativeName,
            password,
            products  
        });

        await newSupplier.save();

        //create a token for the new supplier
        const token = jwt.sign({ id: newSupplier._id, role: "supplier" }, process.env.JWT_SECRET, { expiresIn: "24h" });
        res.status(201).json({ token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// login supplier
export const loginSupplier = async (req, res) => {
    const { phoneNumber, password } = req.body;
    try {
        const supplier = await Supplier.findOne({ phoneNumber });
        if (!supplier || supplier.password !== password) {
            return res.status(400).json({ message: "One of the details is incorrect, please try again" });
        }
        const token = jwt.sign({ id: supplier._id, role: "supplier" }, process.env.JWT_SECRET, { expiresIn: "24h" });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get all suppliers
export const getSupplier = async (req, res) => {
    try {
        console.log("Getting suppliers...");
        const suppliers = await Supplier.find();
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

