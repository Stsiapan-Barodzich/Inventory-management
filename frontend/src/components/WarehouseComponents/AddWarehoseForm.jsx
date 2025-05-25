import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddWarehouseForm() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newWarehouse = { name, location};

    const res = await fetch("http://localhost:8000/warehouses/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newWarehouse),
    });

    if (res.ok) {
      alert("Склад добавлен!");
      navigate("/warehouses"); 
    } else {
      alert("Ошибка при добавлении склада");
    }
  };

  return (
    <div>
      <h2>Добавить склад</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Название:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Локация:</label>
          <textarea value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <button type="submit">Добавить</button>
      </form>
    </div>
  );
}
