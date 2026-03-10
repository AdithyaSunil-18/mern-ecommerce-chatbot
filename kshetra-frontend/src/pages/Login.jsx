import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/cart");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className={`auth-card ${error ? "shake" : ""}`}>
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to continue shopping</p>

        <form onSubmit={handleSubmit}>

          <div className="floating-input">
            <input
              name="email"
              type="email"
              required
              onChange={handleChange}
            />
            <label>Email</label>
          </div>

          <div className="floating-input">
            <input
              name="password"
              type={showPass ? "text" : "password"}
              required
              onChange={handleChange}
            />
            <label>Password</label>
            <span
              className="toggle-pass"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "Hide" : "Show"}
            </span>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="auth-btn" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/signup")}>
            Create one
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;