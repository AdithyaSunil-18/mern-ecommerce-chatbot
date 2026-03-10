import { useState } from "react";
import axios from "axios";
import "../styles/adminLogin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", {
        email,
        password,
      });

      localStorage.setItem("adminToken", res.data.token);
      window.location.href = "/admin-dashboard";
    } catch (err) {
      alert("Invalid login");
    }
  };

  return (
    <div className="login-container">
      <h2>Admin Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button>Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;