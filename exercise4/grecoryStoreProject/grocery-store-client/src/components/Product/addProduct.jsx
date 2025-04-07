import { useState, useEffect } from "react";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { addProductApi, getProductsApi } from "../../api/productApi"; // פונקציות ה-API
import { useNavigate } from "react-router-dom";
import "../../styles/addProduct.css";

const AddProduct = () => {
    const queryClient = new QueryClient();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        minQuantity: ""
    });
    const token = localStorage.getItem("token");

    // go to the login page if the token is not exist
    useEffect(() => {
        console.log("❤️")

        if (!token) {
            navigate("/SupplierLogin");
        }
    }, [token, navigate]);


    const mutation = useMutation({
        mutationFn: addProductApi,
        onSuccess: () => {
            refetch(); // update the product list after adding a new product
        },
    });

    // get the products list
    const { data: products, isLoading, error, refetch } = useQuery({
        queryKey: ['products'],
        staleTime: Infinity,
        queryFn: () => getProductsApi(token),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage(""); // reset previous error
        mutation.reset();// reset the mutation state

        if (!formData.name || !formData.price || !formData.minQuantity) {
            setErrorMessage("Please fill in all the fields");
            return;
        }

        // check if the product name already exists
        const isDuplicate = products.some(
            (product) => product.name === formData.name
        );

        if (isDuplicate) {
            setErrorMessage("The product name already exists in the system");
            return;
        }

        mutation.mutate(formData);// call addProductApi with form data
        setFormData({
            name: "",
            price: "",
            minQuantity: ""
        });
    };



    if (isLoading) return <p>Loading products...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="add-product-container">

            <h2>Add product</h2>
            {mutation.isSuccess && <p className="success">The product was added successfully!</p>}
            {mutation.isError && <p className="error-message">Error: {mutation.error.message}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form className="add-product-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="product name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                />
                <input
                    type="number"
                    name="minQuantity"
                    placeholder="minimum quantity"
                    value={formData.minQuantity}
                    onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
                    required
                />
                <button type="submit" disabled={mutation.isLoading}>הוסף מוצר</button>

            </form>

            <h3>Your existing products:</h3>
            <table>
                <thead>
                    <tr>
                        <th>product name</th>
                        <th>price</th>
                        <th>minimum quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {products?.map((product) => (
                        <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.minQuantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AddProduct;
