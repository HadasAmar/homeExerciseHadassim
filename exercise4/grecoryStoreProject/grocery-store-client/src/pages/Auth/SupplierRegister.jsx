import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerSupplierApi } from "../../api/supplierApi";

import "../../styles/SupplierRegister.css"
import { useNavigate } from "react-router-dom";


const SupplierRegister = () => {

    const navigate = useNavigate(); 
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        companyName: "",
        phoneNumber: "",
        representativeName: "",
        password: "",
        products: []
    });

    // add field to the formData
    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...formData.products];
        updatedProducts[index][field] = value;
        setFormData({ ...formData, products: updatedProducts });
    };

    // add product to the formData
    const addProduct = () => {
        setFormData({
            ...formData,
            products: [...formData.products, { name: "", price: "", minQuantity: "" }]
        });
    };

    const mutation = useMutation({
        mutationFn: registerSupplierApi,
        onSuccess: (response) => {
            localStorage.setItem("token", response.token); 
            localStorage.setItem("role", "supplier"); 
            window.location.href = "/ordersBySupplier";
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage(""); // reset previous error
    
        const { companyName, phoneNumber, representativeName, password, products } = formData;
        if (!companyName||!phoneNumber||!representativeName||!password) 
        {
            setErrorMessage("Please fill in all the registration fields");
            return;
        }
    
        // check if products is empty
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            if (!product.name||!product.price.toString() ||!product.minQuantity.toString()) 
            {
                setErrorMessage(`Please fill in all the product fields in row ${i + 1}.`);
                return;
            }
        }
    
        // check if there are duplicate product names
        const names = products.map(p => p.name);
        const hasDuplicates = names.some((name, index) => names.indexOf(name) !== index);
    
        if (hasDuplicates) {
            setErrorMessage("There are duplicate product names, Please ensure that each product is unique");
            return;
        }
    
        mutation.mutate(formData);// call registerSupplierApi with form data
    };
    

    return (
        <div className="supplier-container">
            <form className="supplier-form" onSubmit={handleSubmit}>
                <h2 className="supplier-title">Supplier registration</h2>
                {errorMessage && <p className="status-message error">{errorMessage}</p>}
                {mutation.isLoading && <p className="status-message loading">loading...</p>}
                {mutation.isError && <p className="status-message error">Error: {mutation.error}</p>}
                {mutation.isSuccess && <p className="status-message success">Registration successful!</p>}
                <input
                    type="text"
                    name="phoneNumber"
                    placeholder="phone number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    required
                />
                <input
                    type="text"
                    name="representativeName"
                    placeholder="representative name"
                    value={formData.representativeName}
                    onChange={(e) => setFormData({ ...formData, representativeName: e.target.value })}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />
                <input
                    type="text"
                    name="companyName"
                    placeholder="company name"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                />

                <h3 className="products-title">products</h3>
                {formData.products.map((product, index) => (
                    <div key={index} className="product-group">
                        <input
                            type="text"
                            placeholder="product name"
                            value={product.name}
                            onChange={(e) => handleProductChange(index, "name", e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="price"
                            value={product.price}
                            onChange={(e) => handleProductChange(index, "price", e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="minimum quantity"
                            value={product.minQuantity}
                            onChange={(e) => handleProductChange(index, "minQuantity", e.target.value)}
                            required
                        />
                    </div>
                ))}

                <button type="button" className="btn-add" onClick={addProduct}>➕ Add product</button>
                <button type="submit" className="btn-primary" disabled={mutation.isLoading}>Reguster</button>
                
            </form>


        </div>
    );
};

export default SupplierRegister;
