import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [feedback, setFeedback] = useState("");
    const [newProduct, setNewProduct] = useState({ productName: "", productPrice: "", productQuantity: "" });
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const res = await axios.get("/products", { withCredentials: true });
            setProducts(res.data.data);
        } catch (err) {
            setFeedback("Failed to fetch products");
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const { productName, productPrice, productQuantity } = newProduct;
        if (!productName || !productPrice || !productQuantity) {
            return setFeedback("All fields are required");
        }

        try {
            await axios.post("/products/add-product", newProduct, { withCredentials: true });
            setFeedback("✅ Product added");
            setNewProduct({ productName: "", productPrice: "", productQuantity: "" });
            fetchProducts();
        } catch (err) {
            setFeedback("❌ Failed to add product");
        }
    };

    const handleDelete = async (productId) => {
        try {
            await axios.delete(`/products/delete-product/${productId}`, { withCredentials: true });
            setFeedback("🗑️ Product deleted");
            fetchProducts();
        } catch (err) {
            setFeedback("❌ Failed to delete");
        }
    };

    const handleUpdate = async (product) => {
        const newPrice = prompt("Enter new price:", product.productPrice);
        const newQty = prompt("Enter new quantity:", product.productQuantity);

        if (!newPrice || !newQty || isNaN(newPrice) || isNaN(newQty)) {
            return alert("Invalid input");
        }

        try {
            await axios.patch(`/products/update-product/${product._id}`, {
                productPrice: newPrice,
                productQuantity: newQty,
            }, { withCredentials: true });

            setFeedback("✅ Product updated");
            fetchProducts();
        } catch (err) {
            setFeedback("❌ Update failed");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">🛠️ Admin Dashboard</h1>

            {feedback && <p className="text-center text-blue-600 mb-4">{feedback}</p>}

            {/* Add Product Form */}
            <form onSubmit={handleAddProduct} className="mb-6 space-y-3 bg-gray-100 p-4 rounded shadow">
                <h2 className="text-lg font-semibold">➕ Add New Product</h2>
                <input
                    type="text"
                    placeholder="Product Name"
                    className="w-full p-2 rounded border"
                    value={newProduct.productName}
                    onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Price"
                    className="w-full p-2 rounded border"
                    value={newProduct.productPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, productPrice: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    className="w-full p-2 rounded border"
                    value={newProduct.productQuantity}
                    onChange={(e) => setNewProduct({ ...newProduct, productQuantity: e.target.value })}
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Add Product
                </button>
            </form>

            {/* Product List */}
            <h2 className="text-xl font-semibold mb-2">📦 Products</h2>
            {products.length === 0 ? (
                <p>No products available.</p>
            ) : (
                <div className="space-y-4">
                    {products.map((product) => (
                        <div key={product._id} className="border p-4 rounded flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{product.productName}</p>
                                <p>₹{product.productPrice}</p>
                                <p>Qty: {product.productQuantity}</p>
                            </div>
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleUpdate(product)}
                                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                >
                                    ✏️ Update
                                </button>
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-6">
                <button
                    onClick={() => navigate("/")}
                    className="bg-gray-300 hover:bg-gray-400 px-4 py-1 rounded"
                >
                    ← Back to Products
                </button>
            </div>
        </div>
    );
}
