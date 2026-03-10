import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // password strength
  const getStrength = () => {
    if (form.password.length > 8) return "strong";
    if (form.password.length > 5) return "medium";
    if (form.password.length > 0) return "weak";
    return "";
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className={`auth-card ${error ? "shake" : ""}`}>
        <h2>Create Account</h2>
        <p className="subtitle">Join & start your luxury journey</p>

        <form onSubmit={handleSubmit}>

          <div className="floating-input">
            <input name="name" required onChange={handleChange} />
            <label>Full Name</label>
          </div>

          <div className="floating-input">
            <input type="email" name="email" required onChange={handleChange} />
            <label>Email</label>
          </div>

          <div className="floating-input">
            <input
              type={showPass ? "text" : "password"}
              name="password"
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

          {/* Password strength */}
          {form.password && (
            <div className={`strength ${getStrength()}`}>
              Password strength: {getStrength()}
            </div>
          )}

          <div className="floating-input">
            <input
              type="password"
              name="confirmPassword"
              required
              onChange={handleChange}
            />
            <label>Confirm Password</label>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="auth-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;