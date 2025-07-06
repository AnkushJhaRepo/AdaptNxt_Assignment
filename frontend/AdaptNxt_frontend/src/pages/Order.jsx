import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Order() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const order = state;

    useEffect(() => {
        if (!order) {
            navigate("/"); 
        }
    }, [order]);

    if (!order) return null;

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">🧾 Order Receipt</h1>
            <div className="border rounded shadow p-4 space-y-4">
                <div>
                    <p><strong>Order ID:</strong> {order._id}</p>
                    <p><strong>User:</strong> {order.user.username}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Ordered On:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-2">Items:</h2>
                    {order.items.map((item) => (
                        <div key={item._id} className="flex justify-between mb-1">
                            <span>{item.product.productName} (x{item.quantity})</span>
                            <span>₹{item.product.productPrice * item.quantity}</span>
                        </div>
                    ))}
                </div>

                <div className="text-right font-bold text-lg">
                    Total: ₹{order.totalAmount}
                </div>

                <div className="text-center mt-4">
                    <button
                        onClick={() => navigate("/")}
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                    >
                        🛒 Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
}
