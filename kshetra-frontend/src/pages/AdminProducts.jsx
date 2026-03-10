import { useEffect, useState } from "react";
import axios from "axios";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("adminToken");

  const fetchProducts = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/products",
      { headers: { Authorization: token } }
    );
    setProducts(res.data);
  };

  const deleteProduct = async (id) => {
    await axios.delete(
      `http://localhost:5000/api/admin/products/${id}`,
      { headers: { Authorization: token } }
    );
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Products</h2>
      {products.map(p => (
        <div key={p._id}>
          {p.name} ₹{p.price}
          <button onClick={() => deleteProduct(p._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default AdminProducts;