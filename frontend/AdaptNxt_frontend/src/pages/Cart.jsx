import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState("");
    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            const res = await axios.get("/carts", { withCredentials: true });
            setCart(res.data.data);
        } catch (err) {
            setFeedback("Failed to fetch cart");
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId) => {
        const newQty = prompt("Enter new quantity:");
        if (!newQty || isNaN(newQty) || newQty <= 0) return alert("Invalid quantity");

        try {
            await axios.patch(
                `/carts/update-item/${productId}`,
                { quantity: parseInt(newQty) },
                { withCredentials: true }
            );
            setFeedback("Quantity updated");
            fetchCart();
        } catch (err) {
            setFeedback("Failed to update quantity");
        }
    };

    const deleteItem = async (productId) => {
        try {
            await axios.delete(`/carts/delete-item/${productId}`, { withCredentials: true });
            setFeedback("Item removed");
            fetchCart();
        } catch (err) {
            setFeedback("Failed to remove item");
        }
    };

    const handleCheckout = async () => {
        try {
            const res = await axios.get("/carts/checkout", {}, { withCredentials: true });
            const order = res.data.data;
            navigate("/order", { state: order }); // 👈 pass order directly
        } catch (err) {
            setFeedback("❌ Checkout failed");
        }
    };


    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">🛒 Your Cart</h1>
                <button
                    onClick={() => navigate("/product")}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-1 rounded"
                >
                    ← Back to Products
                </button>
            </div>

            {feedback && <p className="text-center text-blue-600 mb-4">{feedback}</p>}

            {loading ? (
                <p className="text-center">Loading...</p>
            ) : !cart || cart.items.length === 0 ? (
                <p className="text-center text-gray-500">Your cart is empty.</p>
            ) : (
                <div className="space-y-4">
                    {cart.items.map((item) => (
                        <div
                            key={item._id}
                            className="flex justify-between items-center border rounded p-4 shadow"
                        >
                            <div>
                                <h2 className="text-lg font-semibold">{item.product.productName}</h2>
                                <p className="text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                            <div className="space-x-2">
                                <button
                                    onClick={() => updateQuantity(item.product._id)}
                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => deleteItem(item.product._id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-between mt-6 items-center border-t pt-4">
                        <h2 className="text-xl font-bold">Total: ₹{cart.totalAmount}</h2>
                        <button
                            onClick={handleCheckout}
                            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
