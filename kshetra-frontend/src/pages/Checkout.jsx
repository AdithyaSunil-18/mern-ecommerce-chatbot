import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/checkout.css";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [giftWrap, setGiftWrap] = useState(false);

  // ✅ COUPON STATES
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  // ✅ Load cart & check login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, [navigate]);

  const handleChange = (e) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  // ✅ APPLY COUPON
  const applyCoupon = async () => {
    if (!couponCode) return alert("Enter coupon code");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/coupons/validate",
        {
          code: couponCode,
          productIds: cartItems.map(item => item._id)
        }
      );

      setDiscount(res.data.discount);
      alert(`Coupon Applied! ${res.data.discount}% OFF`);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid Coupon");
    }
  };

  const platformFee = 40;
  const hamperCharge = giftWrap ? 150 : 0;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // ✅ discount percent applied
  const discountAmount = (subtotal * discount) / 100;

  const total =
    subtotal - discountAmount + platformFee + hamperCharge;

  // ✅ PLACE ORDER
  const placeOrder = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    if (
      !address.name ||
      !address.phone ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      alert("Please fill delivery address");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const orderData = {
        items: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.qty,
        })),

        shippingAddress: address,
        paymentMethod: "COD",

        subtotal,
        discountPercent: discount,
        discountAmount,
        giftWrap,
        platformFee,

        totalAmount: total,
      };

      console.log("FINAL ORDER:", orderData);

     await axios.post(
  "http://localhost:5000/api/orders",
  orderData,
  { headers: { Authorization: `Bearer ${token}` } }
);

// ✅ backup cart for success page
localStorage.removeItem("cart_backup");
localStorage.setItem("cart_backup", JSON.stringify(cartItems));

// clear active cart
localStorage.removeItem("cart");

alert("Order placed successfully 🎉");
navigate("/order-success");
    } catch (err) {
      console.log(err.response?.data || err);
      alert(err.response?.data?.message || "Order failed");
    }
  };

  if (cartItems.length === 0)
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate("/explore")}>
          Continue Shopping
        </button>
      </div>
    );

  return (
    <div className="checkout-page">

      {/* LEFT SIDE */}
      <div className="checkout-left">
        <h2>Delivery Address</h2>

        <div className="address-form">
          <input name="name" placeholder="Full Name" onChange={handleChange} />
          <input name="phone" placeholder="Phone Number" onChange={handleChange} />
          <input name="street" placeholder="House / Street" onChange={handleChange} />
          <input name="city" placeholder="City" onChange={handleChange} />
          <input name="state" placeholder="State" onChange={handleChange} />
          <input name="pincode" placeholder="PIN Code" onChange={handleChange} />
        </div>

        <div className="gift-option">
          <input
            type="checkbox"
            checked={giftWrap}
            onChange={() => setGiftWrap(!giftWrap)}
          />
          Luxury Hamper Packaging 🎁 (+₹150)
        </div>

        {/* ✅ COUPON BOX */}
        <div className="coupon-box">
          <input
            placeholder="Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button onClick={applyCoupon}>Apply</button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="checkout-right">
        <h2>Order Summary</h2>

        {cartItems.map((item, index) => (
          <div key={`${item._id}-${index}`} className="summary-item">
            <img src={item.image} alt={item.name} />
            <div>
              <p>{item.name}</p>
              <span>{item.size} • {item.color}</span>
            </div>
            <b>₹{item.price * item.qty}</b>
          </div>
        ))}

        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        {discount > 0 && (
          <div className="summary-row green">
            <span>Discount ({discount}%)</span>
            <span>-₹{discountAmount}</span>
          </div>
        )}

        <div className="summary-row">
          <span>Platform Fee</span>
          <span>₹{platformFee}</span>
        </div>

        {giftWrap && (
          <div className="summary-row">
            <span>Hamper</span>
            <span>₹150</span>
          </div>
        )}

        <div className="summary-total">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button className="place-order" onClick={placeOrder}>
          Place Order & Pay
        </button>
      </div>
    </div>
  );
};

export default Checkout;