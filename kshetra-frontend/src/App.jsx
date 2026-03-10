import { Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Explore from "./pages/Explore";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Account from "./pages/Account";
import Categories from "./pages/Categories";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

import AdminRoute from "./components/AdminRoute";
import Chatbot from "./components/Chatbot";

function App() {
  return (
    <>
      {/* Application Routes */}
      <Routes>
        {/* USER ROUTES */}
        <Route path="/" element={<Welcome />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/account" element={<Account />} />
        <Route path="/categories" element={<Categories />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>

      {/* GLOBAL AI CHATBOT (appears on all pages) */}
      <Chatbot />
    </>
  );
}

export default App;