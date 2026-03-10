import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/orderSuccess.css";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState("");
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const id = "KS" + Math.floor(Math.random() * 1000000);
    setOrderId(id);

    const items = JSON.parse(localStorage.getItem("cart_backup")) || [];
    setCartItems(items);

    localStorage.removeItem("cart");
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const deliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 4);
    return date.toDateString();
  };

  return (
    <div className="success-page">

      <div className="confetti"></div>

      <div className="success-card">

        <div className="checkmark">✓</div>

        <h1>Order Confirmed</h1>
        <p className="thankyou">
          Thank you for shopping with Kshetra ✨
        </p>

        <p className="order-id">
          Order ID: <strong>{orderId}</strong>
        </p>

        <div className="items">
          {cartItems.map(item => (
            <div key={item._id} className="item">
              <img src={item.image} alt={item.name} />
              <div>
                <p>{item.name}</p>
                <span>{item.size} • {item.color}</span>
              </div>
              <b>₹{item.price * item.qty}</b>
            </div>
          ))}
        </div>

        <div className="total">
          Total Paid: <strong>₹{total}</strong>
        </div>

        {/* 🚚 SVG TRUCK ANIMATION */}
        <div className="delivery-animation">
          <svg className="truck-svg" viewBox="0 0 220 100">

            <rect x="10" y="40" width="120" height="40" rx="8" fill="#c8a96a"/>
            <rect x="130" y="50" width="60" height="30" rx="6" fill="#a88642"/>
            <rect x="140" y="55" width="25" height="15" rx="3" fill="#ffffff"/>

            <circle className="wheel" cx="50" cy="85" r="12" fill="#333"/>
            <circle className="wheel" cx="150" cy="85" r="12" fill="#333"/>

            <circle className="wheel-inner" cx="50" cy="85" r="5" fill="#aaa"/>
            <circle className="wheel-inner" cx="150" cy="85" r="5" fill="#aaa"/>

          </svg>

          <div className="road"></div>
        </div>

        <div className="delivery-box">
          🚚 Estimated Delivery  
          <strong> {deliveryDate()}</strong>
        </div>

        <div className="trust">
          🔒 Secure Payment Verified  
          🔁 Easy Returns Available  
          ☎ Support 24/7
        </div>

        <div className="next-offer">
          🎁 Use code <b>THANKYOU10</b> for 10% off your next purchase
        </div>

        <div className="actions">
          <button onClick={() => navigate("/account")}>
            View Order Details
          </button>

          <button
            className="track"
            onClick={() => alert("Tracking coming soon")}
          >
            Track Order
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;