import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/cart.css";

const Cart = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [giftWrap, setGiftWrap] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  // ✅ TOKEN based login detection (secure)
  const token = localStorage.getItem("token");

  useEffect(() => {
    setCartItems(JSON.parse(localStorage.getItem("cart")) || []);
    setWishlist(JSON.parse(localStorage.getItem("wishlist")) || []);
  }, []);

  // ✅ quantity update with animation
  const updateQty = (id, change) => {
    const updated = cartItems.map(item =>
      item._id === id
        ? { ...item, qty: Math.max(1, item.qty + change), anim: true }
        : item
    );

    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));

    setTimeout(() => {
      setCartItems(items =>
        items.map(i => ({ ...i, anim: false }))
      );
    }, 300);
  };

  const removeItem = (id) => {
    const updated = cartItems.filter(i => i._id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // ✅ Save for later
  const saveForLater = (item) => {
    const updatedCart = cartItems.filter(i => i._id !== item._id);
    const updatedWishlist = [...wishlist, item];

    setCartItems(updatedCart);
    setWishlist(updatedWishlist);

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  // ✅ coupon logic
  const applyCoupon = () => {
    if (coupon === "KSHESTRA10") {
      setDiscount(0.1);
      alert("Coupon applied 🎉");
    } else {
      alert("Invalid coupon");
    }
  };

  const shipping = 120;
  const platformFee = 40;
  const hamperCharge = giftWrap ? 150 : 0;

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmount = subtotal * discount;

  const freeShippingThreshold = 5000;
  const remainingForFreeShipping =
    freeShippingThreshold - subtotal;

  const grandTotal =
    subtotal - discountAmount +
    (subtotal > 0 && subtotal < freeShippingThreshold ? shipping : 0) +
    platformFee +
    hamperCharge;

  if (cartItems.length === 0)
    return (
      <div className="cart-empty">
        <h2>Your cart is empty 🛍️</h2>
        <button onClick={() => navigate("/explore")}>
          Continue Shopping
        </button>
      </div>
    );

  return (
    <div className="cart-page slide-in">

      <div className="cart-items">
        {cartItems.map(item => (
          <div
            key={item._id}
            className={`cart-card ${item.anim ? "pulse" : ""}`}
          >
            <img src={item.image} alt={item.name} />

            <div className="cart-info">
              <h3>{item.name}</h3>
              <p>{item.size} • {item.color}</p>

              <div className="qty-control">
                <button onClick={() => updateQty(item._id, -1)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item._id, 1)}>+</button>
              </div>

              <p className="price">₹{item.price * item.qty}</p>

              <div className="cart-actions">
                <button onClick={() => saveForLater(item)}>
                  Save for later
                </button>
                <button onClick={() => removeItem(item._id)}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SUMMARY */}
      <div className="summary-box">
        <h2>Order Summary</h2>

        {/* FREE SHIPPING PROGRESS */}
        {subtotal < freeShippingThreshold && (
          <div className="free-ship">
            Spend ₹{remainingForFreeShipping} more for FREE shipping 🚚
            <div className="progress-bar">
              <div
                className="progress"
                style={{
                  width: `${(subtotal / freeShippingThreshold) * 100}%`
                }}
              />
            </div>
          </div>
        )}

        {/* COUPON */}
        <div className="coupon-box">
          <input
            placeholder="Coupon code"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <button onClick={applyCoupon}>Apply</button>
        </div>

        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        {discount > 0 && (
          <div className="summary-row green">
            <span>Discount</span>
            <span>-₹{discountAmount}</span>
          </div>
        )}

        <div className="summary-row">
          <span>Shipping</span>
          <span>
            {subtotal >= freeShippingThreshold ? "FREE" : `₹${shipping}`}
          </span>
        </div>

        <div className="summary-row">
          <span>Platform Fee</span>
          <span>₹{platformFee}</span>
        </div>

        <div className="gift-option">
          <input
            type="checkbox"
            checked={giftWrap}
            onChange={() => setGiftWrap(!giftWrap)}
          />
          Luxury Hamper 🎁 (+₹150)
        </div>

        <div className="summary-total">
          <span>Total</span>
          <span>₹{grandTotal}</span>
        </div>

        <button
          className="checkout-btn"
          onClick={() => {
            if (!token) {
              navigate("/login");
            } else {
              navigate("/checkout");
            }
          }}
        >
          {token ? "Proceed to Payment" : "Please login to continue"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
