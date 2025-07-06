import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [query, setQuery] = useState(""); // what we actually search

    const navigate = useNavigate();

    const fetchProducts = async (pageNumber = 1, q = "") => {
        setLoading(true);
        try {
            const res = await axios.get(
                `/products?page=${pageNumber}&limit=6&search=${q}`,
                { withCredentials: true }
            );
            setProducts(res.data.data);
            setTotalPages(res.data.totalPages);
            setPage(res.data.page);
        } catch {
            setFeedback("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId) => {
        const quantity = prompt("Enter quantity:");
        if (!quantity || isNaN(quantity) || quantity <= 0) return alert("Invalid quantity");

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
        fetchProducts(page, query);
    }, [page, query]);

    const handleSearch = (e) => {
        e.preventDefault();
        setQuery(searchTerm); // trigger search
        setPage(1); // reset to first page
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">🛍️ Available Products</h1>
                <div className="space-x-4">
                    <button
                        onClick={() => navigate("/cart")}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Go to Cart 🛒
                    </button>
                    <button
                        onClick={async () => {
                            await axios.post("/users/logout", {}, { withCredentials: true });
                            navigate("/login");
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Logout 🔒
                    </button>
                </div>
            </div>

            {/* 🔍 Search Bar */}
            <form onSubmit={handleSearch} className="mb-6 flex gap-2">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search product name..."
                    className="border px-4 py-2 w-full rounded"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Search
                </button>
            </form>

            {feedback && (
                <p className="text-center text-blue-600 font-medium mb-4">{feedback}</p>
            )}

            {loading ? (
                <p className="text-center">Loading products...</p>
            ) : products.length === 0 ? (
                <p className="text-center text-gray-500">No products found.</p>
            ) : (
                <>
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                        {products.map((product) => (
                            <div key={product._id} className="border rounded p-4 shadow">
                                <h2 className="text-lg font-semibold">{product.productName}</h2>
                                <p className="text-sm text-gray-600">Price: ₹{product.productPrice}</p>
                                <p className="text-sm text-gray-600">In Stock: {product.productQuantity}</p>
                                <button
                                    onClick={() => addToCart(product._id)}
                                    className="mt-4 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex justify-center items-center space-x-4">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                            className="px-4 py-1 bg-gray-300 rounded disabled:opacity-50"
                        >
                            ⬅ Prev
                        </button>
                        <span>
                            Page {page} of {totalPages}
                        </span>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                            className="px-4 py-1 bg-gray-300 rounded disabled:opacity-50"
                        >
                            Next ➡
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
