import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/account.css";

/* ✅ API INSTANCE */
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

const Account = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  const emptyAddress = {
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  };

  const [newAddress, setNewAddress] = useState(emptyAddress);

  /* ================= FETCH USER ================= */
  const fetchUser = async () => {
    const res = await API.get("/users/me");

    setUser(res.data);
    setForm({
      name: res.data.name || "",
      email: res.data.email || "",
    });

    setAddresses(res.data.addresses || []);
    setWallet(res.data.wallet || 0);
  };

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/my-orders");

      // force React to detect new state
      setOrders([...res.data]);
    } catch (err) {
      console.log("Orders fetch failed", err);
      setOrders([]);
    }
  };

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchUser();
        await fetchOrders();
      } catch (err) {
        localStorage.clear();
        window.location.href = "/login";
      }
      setLoading(false);
    };

    loadData();

    // auto refresh orders every 5 sec
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);

  }, []);

  /* 🔥 FETCH ORDERS WHEN TAB OPENS */
  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  /* ================= UPDATE PROFILE ================= */
  const updateProfile = async () => {
    try {
      const res = await API.put("/users/update", form);
      setUser(res.data);
      setEditing(false);
      alert("Profile updated ✅");
    } catch {
      alert("Update failed");
    }
  };

  /* ================= ADD ADDRESS ================= */
  const addAddress = async () => {
    const { name, phone, street, city, state, pincode } = newAddress;

    if (!name || !phone || !street || !city || !state || !pincode) {
      return alert("Please fill all fields");
    }

    try {
      const res = await API.post("/users/address", newAddress);
      setAddresses(res.data.addresses);
      setNewAddress(emptyAddress);
      alert("Address added ✅");
    } catch {
      alert("Failed to add address");
    }
  };

  /* ================= DELETE ADDRESS ================= */
  const deleteAddress = async (id) => {
    try {
      const res = await API.delete(`/users/address/${id}`);
      setAddresses(res.data.addresses);
    } catch {
      alert("Delete failed");
    }
  };

  /* ================= DELETE ORDER ================= */
  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    try {
      await API.delete(`/orders/${id}`);
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) return <div className="account-loading shimmer"></div>;

  return (
    <div className="account-page">

      {/* SIDEBAR */}
      <div className="account-sidebar">
        <div className="avatar">{user?.name?.charAt(0) || "U"}</div>
        <h3>{user?.name}</h3>

        <nav>
          <button onClick={() => setActiveTab("profile")}>Profile</button>
          <button onClick={() => setActiveTab("orders")}>Orders</button>
          <button onClick={() => setActiveTab("address")}>Addresses</button>
          <button onClick={() => setActiveTab("wallet")}>Wallet</button>
          <button onClick={logout} className="logout">Logout</button>
        </nav>
      </div>

      {/* CONTENT */}
      <div className="account-content">

        {/* PROFILE */}
        {activeTab === "profile" && (
          <div className="card fade-in">
            <h2>Profile</h2>

            {editing ? (
              <>
                <input
                  value={form.name}
                  placeholder="Name"
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
                <input
                  value={form.email}
                  placeholder="Email"
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
                <button className="primary-btn" onClick={updateProfile}>
                  Save
                </button>
              </>
            ) : (
              <>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p>
                  <strong>Member Since:</strong>{" "}
                  {user.createdAt &&
                    new Date(user.createdAt).toDateString()}
                </p>

                <button
                  className="primary-btn"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        )}

        {/* ORDERS */}
        {activeTab === "orders" && (
          <div className="card fade-in">
            <h2>My Orders</h2>

            {orders.length === 0 && <p>No orders yet.</p>}

            {orders.map((order) => {
              const deliveryDate = new Date(order.createdAt);
              deliveryDate.setDate(deliveryDate.getDate() + 5);

              const status = order.status || "Placed";

              return (
                <div key={order._id} className="order-card">

                  <div className="order-header">
                    <div>
                      <strong>Order ID:</strong>
                      <span className="order-id">{order._id}</span>
                    </div>

                    <span className={`status ${status.toLowerCase()}`}>
                      {status}
                    </span>
                  </div>

                  <p className="order-date">
                    Placed on {new Date(order.createdAt).toDateString()}
                  </p>

                  <p className="delivery">
                    Estimated Delivery: {deliveryDate.toDateString()}
                  </p>

                  {order.items?.map((item, i) => (
                    <div key={i} className="order-item">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        onError={(e) => (e.target.src = "/placeholder.png")}
                      />

                      <div className="item-info">
                        <p>{item.name}</p>
                        <small>Qty: {item.quantity}</small>
                      </div>

                      <div className="item-price">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}

                  <div className="order-footer">
                    <div className="order-total">
                      Total: ₹{order.totalAmount}
                    </div>

                    <div className="shipping-preview">
                      Deliver to: {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state}
                    </div>

                    <button
                      className="delete-btn"
                      onClick={() => deleteOrder(order._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ADDRESSES */}
        {activeTab === "address" && (
          <div className="card fade-in">
            <h2>Saved Addresses</h2>

            {addresses.length === 0 && <p>No saved addresses.</p>}

            {addresses.map((addr) => (
              <div key={addr._id} className="address-item">
                <div>
                  <b>{addr.name}</b> — {addr.phone}
                  <p>{addr.street}, {addr.city}</p>
                  <p>{addr.state} - {addr.pincode}</p>
                </div>
                <button onClick={() => deleteAddress(addr._id)}>
                  Delete
                </button>
              </div>
            ))}

            <h3>Add New Address</h3>

            {Object.keys(emptyAddress).map((field) => (
              <input
                key={field}
                placeholder={field}
                value={newAddress[field]}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, [field]: e.target.value })
                }
              />
            ))}

            <button className="primary-btn" onClick={addAddress}>
              Add Address
            </button>
          </div>
        )}

        {/* WALLET */}
        {activeTab === "wallet" && (
          <div className="card fade-in">
            <h2>Wallet</h2>
            <h1>₹{wallet}</h1>
            <p>Wallet balance available for purchases.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Account;