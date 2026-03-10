import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/categories.css";

const Categories = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [grouped, setGrouped] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then(res => {
        setProducts(res.data);
        groupByCategory(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const groupByCategory = (items) => {
    const groupedData = {};

    items.forEach(item => {
      const category = item.category || "Others";

      if (!groupedData[category]) {
        groupedData[category] = [];
      }

      groupedData[category].push(item);
    });

    setGrouped(groupedData);
  };

  return (
    <div className="categories-page">
      <h1 className="title">Categories</h1>

      {Object.keys(grouped).map(category => (
        <div key={category} className="category-section">
          <h2 className="category-title">{category}</h2>

          <div className="category-grid">
            {grouped[category].map(product => (
              <div
                key={product._id}
                className="category-card"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img
                  src={`http://localhost:5000/uploads/${product.image}`}
                  alt={product.name}
                />
                <h4>{product.name}</h4>
                <p>₹{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Categories;