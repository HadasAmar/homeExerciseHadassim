import { Supplier } from "../models/Supplier.js";

//adding a product to the supplier's products array
export const addProduct = async (req, res) => {
    console.log("Adding product..."); 
    try {
        console.log("req",req)
        const supplier = await Supplier.findById(req.user.id);

        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        const { name, price, minQuantity } = req.body;

        const newProduct = {
            name,
            price,
            minQuantity
        };

        supplier.products.push(newProduct);

        await supplier.save();

        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};


//view all products of the supplier
export const getProducts = async (req, res) => {

    try {
        const supplier = await Supplier.findById(req.user.id);        
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        res.status(200).json(supplier.products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
