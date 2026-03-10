import { useEffect, useState } from "react";
import axios from "axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("adminToken");

  // 🔹 Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/orders",
        { headers: { Authorization: token } }
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔹 Update order status
  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/orders/${id}`,
        { status },
        { headers: { Authorization: token } }
      );

      // refresh list after update
      fetchOrders();
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Orders</h2>

      {orders.map((o) => (
        <div
          key={o._id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
          }}
        >
          <p><strong>User:</strong> {o.user?.name}</p>
          <p><strong>Total:</strong> ₹{o.totalAmount}</p>
          <p><strong>Status:</strong> {o.status}</p>

          <select
            value={o.status}
            onChange={(e) =>
              updateOrderStatus(o._id, e.target.value)
            }
          >
            <option value="Pending">Pending</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      ))}
    </div>
  );
}

export default AdminOrders;