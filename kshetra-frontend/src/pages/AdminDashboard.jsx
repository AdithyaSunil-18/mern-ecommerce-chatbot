import { useEffect, useState } from "react";
import axios from "axios";
import { FaBox, FaShoppingCart, FaUsers, FaBell, FaSearch } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import "../styles/adminDashboard.css";

function AdminDashboard() {
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("orders");
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState(false);
  const [formData, setFormData] = useState({});
  const [topProducts, setTopProducts] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    revenueTrend: [],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);

  const token = localStorage.getItem("adminToken") || "";

  /* AUTH CHECK */
  useEffect(() => {
    if (!token) window.location.href = "/admin-login";
    fetchAnalytics();
    fetchDashboard();
    fetchOrders();
    fetchProducts();
    fetchDeletedProducts();
  }, [token]);

  /* LOAD USERS WHEN TAB OPENS */
  useEffect(() => {
    if (activeTab === "users") fetchUsers();
  }, [activeTab]);

  /* CLOSE MODALS WITH ESC */
  useEffect(() => {
    const closeOnEsc = (e) => {
      if (e.key === "Escape") {
        setSelectedProduct(null);
        setEditingProduct(null);
        setNewProduct(false);
      }
    };
    window.addEventListener("keydown", closeOnEsc);
    return () => window.removeEventListener("keydown", closeOnEsc);
  }, []);

  /* DASHBOARD MESSAGE */
  const fetchDashboard = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/dashboard", {
      headers: { Authorization: token },
    });
    setMessage(res.data.message);
  };

  /* ANALYTICS */
  const fetchAnalytics = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/analytics", {
      headers: { Authorization: token },
    });
    setAnalytics(res.data);
  };

  /* ORDERS */
  const fetchOrders = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/orders", {
      headers: { Authorization: token },
    });
    setOrders(res.data);
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/orders/${id}/status`,
        { status },
        { headers: { Authorization: token } }
      );
      setOrders((prev) =>
        prev.map((order) => (order._id === id ? { ...order, status } : order))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    await axios.delete(`http://localhost:5000/api/admin/orders/${id}`, {
      headers: { Authorization: token },
    });
    fetchOrders();
  };

  /* USERS */
  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/users", {
      headers: { Authorization: token },
    });
    setUsers(res.data);
  };

  const promoteUser = async (id) => {
    await axios.put(
      `http://localhost:5000/api/admin/users/promote/${id}`,
      {},
      { headers: { Authorization: token } }
    );
    fetchUsers();
  };

  const demoteUser = async (id) => {
    await axios.put(
      `http://localhost:5000/api/admin/users/demote/${id}`,
      {},
      { headers: { Authorization: token } }
    );
    fetchUsers();
  };

  /* PRODUCTS */
  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/products");
    setProducts(res.data);
  };

  const fetchDeletedProducts = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/products/deleted",
      { headers: { Authorization: token } }
    );
    setDeletedProducts(res.data);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await axios.delete(`http://localhost:5000/api/admin/products/${id}`, {
      headers: { Authorization: token },
    });
    fetchProducts();
    fetchDeletedProducts();
  };

  const restoreProduct = async (id) => {
    await axios.put(
      `http://localhost:5000/api/admin/products/restore/${id}`,
      {},
      { headers: { Authorization: token } }
    );
    fetchProducts();
    fetchDeletedProducts();
  };

  const handleSaveProduct = async () => {
    await axios.post(
      "http://localhost:5000/api/admin/products",
      formData,
      { headers: { Authorization: token } }
    );
    setNewProduct(false);
    fetchProducts();
  };

  const handleUpdateProduct = async () => {
    await axios.put(
      `http://localhost:5000/api/admin/products/${editingProduct._id}`,
      formData,
      { headers: { Authorization: token } }
    );
    setEditingProduct(null);
    fetchProducts();
  };

  /* FILTERED DATA */
const filteredProducts = products.filter((p) =>
  (p.name || "").toLowerCase().includes((searchQuery || "").toLowerCase())
);

const filteredUsers = users.filter((u) =>
  (u.name || "").toLowerCase().includes((searchQuery || "").toLowerCase())
);

const filteredOrders = orders.filter((o) =>
  (o.user?.name || "").toLowerCase().includes((searchQuery || "").toLowerCase())
);
  /* Analytics chart data */
  const chartData = {
    labels: analytics.revenueTrend?.map((d) => d.date) || [],
    datasets: [
      {
        label: "Revenue",
        data: analytics.revenueTrend?.map((d) => d.amount) || [],
        borderColor: "#FFD700",
        backgroundColor: "rgba(255,215,0,0.2)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="dashboard-wrapper">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>KSHESTRA</h2>
        <ul>
          <li onClick={() => setActiveTab("products")}>
            <FaBox /> Products
          </li>
          <li onClick={() => setActiveTab("orders")}>
            <FaShoppingCart /> Orders
          </li>
          <li onClick={() => setActiveTab("users")}>
            <FaUsers /> Users
          </li>
          <li>
            <FaBell /> Notifications ({notifications.length})
          </li>
        </ul>
      </div>

      {/* MAIN CONTENT */}
      <div className="dashboard-content">
        <div className="top-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <h1 className="dashboard-title">Admin Dashboard</h1>
        <p className="dashboard-message">{message}</p>

        {/* Analytics */}
        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>Revenue</h3>
            <p>₹{analytics.totalRevenue}</p>
          </div>
          <div className="analytics-card">
            <h3>Orders</h3>
            <p>{analytics.totalOrders}</p>
          </div>
          <div className="analytics-card">
            <h3>Products</h3>
            <p>{analytics.totalProducts}</p>
          </div>
          <div className="analytics-card">
            <h3>Users</h3>
            <p>{analytics.totalUsers}</p>
          </div>
        </div>

        <div className="chart-container">
          <Line data={chartData} />
        </div>

        {/* ================= PRODUCTS ================= */}
        {activeTab === "products" && (
          <>
            <h2 className="section-title">Products</h2>
            <button
              className="add-btn"
              onClick={() => {
                setFormData({});
                setNewProduct(true);
              }}
            >
              + Add Product
            </button>

            {filteredProducts.map((p) => (
              <div key={p._id} className="card product-card">
                <img
                  src={
                    p.image
                      ? `http://localhost:5000/uploads/${p.image}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={p.name}
                  className="product-image"
                />
                <div className="product-info">
                  <h3>{p.name}</h3>
                  <p>₹{p.price}</p>
                  <p>{p.category}</p>
                  <p>Stock: {p.stock}</p>
                  <div className="product-actions">
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setEditingProduct(p);
                        setFormData(p);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteProduct(p._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <h2 className="section-title">Deleted Products</h2>
            {deletedProducts.map((p) => (
              <div key={p._id} className="card deleted">
                {p.name} — ₹{p.price}
                <button onClick={() => restoreProduct(p._id)}>Restore</button>
              </div>
            ))}
          </>
        )}

        {/* ADD PRODUCT MODAL */}
        {newProduct && (
          <div className="modal-overlay" onClick={() => setNewProduct(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h2>Add Product</h2>
              <input
                placeholder="Name"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                placeholder="Price"
                type="number"
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
              <input
                placeholder="Category"
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
              <input
                placeholder="Stock"
                type="number"
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
              />
              <textarea
                placeholder="Description"
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <button onClick={handleSaveProduct}>Save</button>
            </div>
          </div>
        )}

        {/* EDIT PRODUCT MODAL */}
        {editingProduct && (
          <div className="modal-overlay" onClick={() => setEditingProduct(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h2>Edit Product</h2>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                value={formData.price}
                type="number"
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
              <input
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
              <input
                value={formData.stock}
                type="number"
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
              />
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <button onClick={handleUpdateProduct}>Update</button>
            </div>
          </div>
        )}

        {/* ================= ORDERS ================= */}
        {activeTab === "orders" && (
          <>
            <h2 className="section-title">Orders</h2>
            {filteredOrders.length === 0 ? (
              <p className="empty-text">No orders yet</p>
            ) : (
              filteredOrders.map((order) => (
                <div key={order._id} className="card order-card">
                  <div className="order-section">
                    <h3>Customer</h3>
                    <p>
                      <strong>Name:</strong> {order.user?.name || "Guest"}
                    </p>
                    <p>
                      <strong>Email:</strong> {order.user?.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {order.user?.phone}
                    </p>
                  </div>

                  <div className="order-section">
                    <h3>Products</h3>
                    {order.items.map((item, i) => (
                      <div key={i} className="order-item">
                        <img
                          src={
                            item.image?.startsWith("http")
                              ? item.image
                              : `http://localhost:5000/uploads/${item.image}`
                          }
                          alt={item.name}
                          className="order-product-img"
                        />
                        <div>
                          <p>
                            <strong>{item.name}</strong>
                          </p>
                          <p>Qty: {item.qty}</p>
                          <p>Size: {item.size}</p>
                          <p>Color: {item.color}</p>
                          <p>₹{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-section">
                    <h3>Shipping Address</h3>
                    <p>{order.shippingAddress?.name}</p>
                    <p>{order.shippingAddress?.street}</p>
                    <p>
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state} -{" "}
                      {order.shippingAddress?.pincode}
                    </p>
                    <p>{order.shippingAddress?.phone}</p>
                  </div>

                  <div className="order-section">
                    <h3>Order Info</h3>
                    <p>
                      <strong>Total:</strong> ₹{order.totalAmount}
                    </p>
                    <p>
                      <strong>Payment:</strong> {order.paymentMethod}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order._id, e.target.value)
                      }
                    >
                      <option>Placed</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => deleteOrder(order._id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </>
        )}

        {/* ================= USERS ================= */}
        {activeTab === "users" && (
          <>
            <h2 className="section-title">Users</h2>
            {filteredUsers.length === 0 ? (
              <p className="empty-text">No users found</p>
            ) : (
              filteredUsers.map((user) => (
                <div key={user._id} className="card">
                  <h3>{user.name}</h3>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {user.phone || "N/A"}
                  </p>
                  <p>
                    <strong>Wallet:</strong> ₹{user.wallet}
                  </p>
                  <p>
                    <strong>Role:</strong> {user.role}
                  </p>
                  <p>
                    <strong>Joined:</strong>{" "}
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                  {user.addresses?.length > 0 && (
                    <div className="address-box">
                      <strong>Address:</strong>
                      <p>
                        {user.addresses[0].street}, {user.addresses[0].city},{" "}
                        {user.addresses[0].state} -{" "}
                        {user.addresses[0].pincode}
                      </p>
                    </div>
                  )}
                  <button
                    className="edit-btn"
                    onClick={() =>
                      user.role === "user"
                        ? promoteUser(user._id)
                        : demoteUser(user._id)
                    }
                  >
                    {user.role === "user" ? "Promote to Admin" : "Demote"}
                  </button>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;