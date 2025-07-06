import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post("/users/login", form, {
                withCredentials: true
            });

            alert("Login successful!");
            navigate("/products");
        } catch (err) {
            setError(err?.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
            >
                <h2 className="text-2xl font-bold text-center">Login</h2>

                {error && (
                    <div className="text-red-600 text-sm text-center">{error}</div>
                )}

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Login
                </button>

                <button
                    onClick={() => navigate("/register")}
                    className="mt-3 text-sm text-center text-blue-600 hover:underline w-full"
                >
                    Don't have an account? Register
                </button>

            </form>
        </div>
    );
}
