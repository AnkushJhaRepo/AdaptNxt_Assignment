import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    fullname: "",
    password: "",
    isAdmin: false,
    isCustomer: true, // default to true for normal users
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/users/register", form);
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>

        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />

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
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={form.fullname}
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

        <div className="flex flex-col text-sm gap-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isAdmin"
              checked={form.isAdmin}
              onChange={handleChange}
            />
            Register as Admin
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isCustomer"
              checked={form.isCustomer}
              onChange={handleChange}
              disabled={form.isAdmin} // optional UX choice
            />
            Register as Customer
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
