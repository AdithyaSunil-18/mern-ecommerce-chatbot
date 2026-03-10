import { useState } from "react";
import axios from "axios";

function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });


  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    await axios.post(
      "http://localhost:5000/api/admin/products",
      form,
      { headers: { Authorization: token } }
    );

    alert("Product Added!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" onChange={e=>setForm({...form,name:e.target.value})}/>
      <input placeholder="Price" onChange={e=>setForm({...form,price:e.target.value})}/>
      <input placeholder="Category" onChange={e=>setForm({...form,category:e.target.value})}/>
      <input placeholder="Image URL" onChange={e=>setForm({...form,image:e.target.value})}/>
      <textarea placeholder="Description" onChange={e=>setForm({...form,description:e.target.value})}/>
      <button>Add Product</button>
    </form>
  );
}

export default AddProduct;