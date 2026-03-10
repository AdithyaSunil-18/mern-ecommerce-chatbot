import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/product.css";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  // ✅ validation function
  const validateSelection = () => {
    if (!selectedSize || !selectedColor) {
      setMessage("⚠️ Please select size and color");
      return false;
    }
    setMessage("");
    return true;
  };

const addToCart = () => {
  if (!validateSelection()) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItem = cart.find(
    item =>
      item._id === product._id &&
      item.size === selectedSize &&
      item.color === selectedColor
  );

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: `http://localhost:5000/uploads/${product.image}`,
      size: selectedSize,
      color: selectedColor,
      qty: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("✅ Added to Cart Successfully!");

  navigate("/cart");
};
  const addToWishlist = () => {
    if (!validateSelection()) return;

    alert("❤️ Added to Wishlist!");
  };

  if (!product) return <h2 className="loading">Loading...</h2>;

  return (
    <div className="product-page">

      {/* HERO */}
      <div className="product-hero">
        <h1>{product.name}</h1>
      </div>

      <div className="product-container">

        {/* PRODUCT IMAGE */}
        <div className="image-wrapper">
  <img
    src={`http://localhost:5000/uploads/${product.image}`}
    alt={product.name}
    className="product-image"
  />
</div>

        {/* DETAILS */}
        <div className="product-details">
          <h2 className="price">₹{product.price}</h2>
          <p className="desc">{product.description}</p>

          {/* ERROR MESSAGE */}
          {message && <p className="error-msg">{message}</p>}

          {/* SIZE OPTIONS */}
          <div className="options">
            <h4>Available Sizes</h4>
            <div className="bubble-group">
              {["S", "M", "L", "XL"].map((size) => (
                <span
                  key={size}
                  className={`bubble ${selectedSize === size ? "active" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          {/* COLOR OPTIONS */}
          <div className="options">
            <h4>Available Colors</h4>
            <div className="bubble-group">
              {["Red", "Gold", "Green", "Black"].map((color) => (
                <span
                  key={color}
                  className={`bubble ${selectedColor === color ? "active" : ""}`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </span>
              ))}
            </div>
          </div>

          <button className="cart-btn" onClick={addToCart}>
            Add to Cart
          </button>

          <button className="wish-btn" onClick={addToWishlist}>
            Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;