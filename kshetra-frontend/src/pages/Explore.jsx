import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/explore.css";
import axios from "axios";
import heroImage from "../assets/flowers.jpg";

// Icons
import { FaHome, FaCompass, FaThLarge, FaUser } from "react-icons/fa";

const categories = ["All", "Handloom", "Jewellery", "Decor"];

function Explore() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        setProducts(res.data);
        setFiltered(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const filterCategory = (cat) => {
    setActiveCategory(cat);

    if (cat === "All") {
      setFiltered(products);
    } else {
      setFiltered(products.filter((p) => p.category === cat));
    }
  };

  return (
    <div className="explore-page">

      {/* TOP NAV */}
      <div className="top-nav">

  <div className="nav-item" onClick={() => navigate("/")}>
    <FaHome />
    <span>Home</span>
  </div>

  <div className="nav-item active">
    <FaCompass />
    <span>Explore</span>
  </div>

  <div className="nav-item" onClick={() => navigate("/categories")}>
    <FaThLarge />
    <span>Categories</span>
  </div>

  <div className="nav-item" onClick={() => navigate("/account")}>
    <FaUser />
    <span>Account</span>
  </div>

</div>
      {/* HERO SECTION */}
      <div
        className="hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-overlay">
          <h1>Discover Traditional Luxury</h1>
          <button onClick={() => window.scrollTo({ top: 500, behavior: "smooth" })}>
            Explore Now
          </button>
        </div>
      </div>

      {/* CATEGORY SORT */}
      <div className="category-sort">
        {categories.map((cat) => (
          <button
            key={cat}
            className={activeCategory === cat ? "active" : ""}
            onClick={() => filterCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* LOADING */}
      {loading && <h2 className="status-msg">Loading products...</h2>}

      {/* EMPTY STATE */}
      {!loading && filtered.length === 0 && (
        <h2 className="status-msg">No products found.</h2>
      )}

      {/* PRODUCTS GRID */}
      <div className="product-grid">
        {filtered.map((product) => (
          <div
  key={product._id}
  className="product-card"
  onClick={() => navigate(`/product/${product._id}`)}
>
  <div className="product-image">
    <img
      src={`http://localhost:5000/uploads/${product.image}`}
      alt={product.name}
      onError={(e) => {
        e.target.src = "/placeholder.jpg";
      }}
    />
  </div>

  <div className="product-info">
    <h3>{product.name}</h3>
    <p>{product.description}</p>
    <span>₹{product.price}</span>
  </div>
</div>
        ))}
      </div>
    </div>
  );
}

export default Explore;