import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState("");
    const navigate = useNavigate(); // for navigation

    const fetchProducts = async () => {
        try {
            const res = await axios.get("/products", { withCredentials: true });
            const filtered = res.data.data.filter(p => p.productQuantity > 0);
            setProducts(filtered);
        } catch (err) {
            setFeedback("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId) => {
        const quantity = prompt("Enter quantity:");
        if (!quantity || isNaN(quantity) || quantity <= 0) {
            alert("Invalid quantity");
            return;
        }

        try {
            await axios.post(
                `/carts/add-item/${productId}`,
                { quantity: parseInt(quantity) },
                { withCredentials: true }
            );
            setFeedback("✅ Product added to cart!");
        } catch (err) {
            setFeedback(err?.response?.data?.message || "❌ Failed to add to cart");
        }

        setTimeout(() => setFeedback(""), 3000);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">🛍️ Available Products</h1>
                <button
                    onClick={() => navigate("/cart")}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    Go to Cart 🛒
                </button>
            </div>

            {feedback && (
                <p className="text-center text-blue-600 font-medium mb-4">{feedback}</p>
            )}
            {loading ? (
                <p className="text-center">Loading products...</p>
            ) : products.length === 0 ? (
                <p className="text-center text-gray-500">No products available.</p>
            ) : (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="border rounded p-4 shadow hover:shadow-lg transition"
                        >
                            <h2 className="text-lg font-semibold">{product.productName}</h2>
                            <p className="text-sm text-gray-600">Price: ₹{product.productPrice}</p>
                            <p className="text-sm text-gray-600">In Stock: {product.productQuantity}</p>

                            <button
                                onClick={() => addToCart(product._id)}
                                className="mt-4 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
