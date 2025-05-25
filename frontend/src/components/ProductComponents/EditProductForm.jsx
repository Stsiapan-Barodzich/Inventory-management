import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    fetch(`http://localhost:8000/products/${id}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch product");
        return res.json();
      })
      .then((data) => {
        setName(data.name);
        setPrice(data.price);
        setDescription(data.description);
        setLoading(false);
      })
      .catch((err) => {
        alert("Ошибка при загрузке продукта");
        navigate("/products");
      });
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProduct = {
      name,
      price,
      description,
    };

    const res = await fetch(`http://localhost:8000/products/${id}/`, {
      method: "PATCH", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    });

    if (res.ok) {
      alert("Продукт успешно обновлен");
      navigate("/products");
    } else {
      alert("Ошибка при обновлении продукта");
    }
  };

  if (loading) return <p>Загрузка...</p>;

  return (
    <div>
      <h2>Редактировать продукт</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Название:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Цена:</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Описание:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button type="submit">Сохранить</button>
      </form>
    </div>
  );
}
