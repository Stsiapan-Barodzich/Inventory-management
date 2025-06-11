import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddProductForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProduct = { name, price, description };

    const res = await fetch("http://localhost:8000/products/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    if (res.ok) {
      alert("Продукт добавлен!");
      navigate("/products"); 
    } else {
      alert("Ошибка при добавлении продукта");
    }
  };

  return (
    <div>
      <h2>Добавить продукт</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Название:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Цена:</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <label>Описание:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button type="submit">Добавить</button>
      </form>
    </div>
  );
}
