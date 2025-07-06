🛒 Full-Stack E-Commerce Cart System
This is a full-stack e-commerce application built with Node.js, Express, MongoDB, React.js, and Tailwind CSS, supporting:

✅ User & Admin authentication

🛍️ Product listing and cart management

🧾 Order placement and checkout

🛠️ Admin product and order control

---

📁 Project Structure

/project-root
│
├── /backend   → Node.js + Express + MongoDB
└── /frontend  → React.js + Tailwind CSS (Vite)  

----  

🚀 Features

  
  
👤 User  

Register/Login (JWT Auth)

View available products (productQuantity > 0)

Add, update, and delete items in cart

Checkout with total amount and quantity

View order receipt after checkout

  

🛠️ Admin 

Add, update, delete products

Update order status (e.g., pending → delivered)

🧰 Tech Stack  

Frontend: React, Vite, Axios, Tailwind CSS

Backend: Node.js, Express.js, Mongoose (MongoDB)

Authentication: JWT, Cookies

Database: MongoDB (Mongoose ODM)


⚙️ Getting Started  

📦 Prerequisites
Node.js & npm

MongoDB Atlas account or local MongoDB

Vite (optional for dev)


🔧 Backend Setup

cd backend
npm install
# Add .env with MongoDB URI and JWT secrets
npm run dev



Your .env should include:

MONGODB_URL=mongodb+srv://...
ACCESS_TOKEN_SECRET=yourSecret
REFRESH_TOKEN_SECRET=yourOtherSecret
CORS_ORIGIN=http://localhost:5173


💻 Frontend Setup

cd frontend
npm install
npm run dev


🔑 API Routes Overview

| Route                       | Method | Description         |
| --------------------------- | ------ | ------------------- |
| `/users/register`           | POST   | Register user       |
| `/users/login`              | POST   | Login and get token |
| `/users/logout`             | POST   | Logout user         |
| `/users/current-user`       | GET    | Get current user    |




| Route                          | Method | Description                                 |
| ------------------------------ | ------ | ------------------------------------------- |
| `/products`                    | GET    | Get all products (with pagination + search) |
| `/products/update-product/:id` | PATH   | Update product (admin only)                 |
| `/products/add-product/:id`    | POST   | ADD product (admin only)                    |
| `/products/delete-product/:id` | DELETE | Delete product (admin only)                 |




| Route                           | Method | Description           |
| ------------------------------- | ------ | --------------------- |
| `/carts`                        | GET    | Get user's cart       |
| `/carts/add-item/:productId`    | POST   | Add product to cart   |
| `/carts/update-item/:productId` | PATCH  | Update quantity       |
| `/carts/delete-item/:productId` | DELETE | Remove from cart      |
| `/carts/checkout`               | GET    | Place order from cart |




| Route                       | Method | Description                |
| --------------------------- | ------ | -------------------------- |
| `/orders/update-status/:id` | PATCH  | Admin: update order status |  

📌 Notes  
Admin access is determined via isAdmin field during registration.

All protected routes require accessToken via HTTP-only cookies.





