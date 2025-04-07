import { reactHooksModuleName } from "@reduxjs/toolkit/query/react";
import jwt from "jsonwebtoken";

// login owner
export const loginOwner = async (req, res) => {
    const { name, password } = req.body;

    try {
        if (name !== process.env.OWNER_NAME || password !== process.env.OWNER_PASSWORD) {
            return res.status(400).json({ message: "One of the details is incorrect, please try again" });
        }

        //create a token for the owner
        const token = jwt.sign({ role: "owner" }, process.env.JWT_SECRET, { expiresIn: "24h" });
        res.status(200).json({ token, role: "owner" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

