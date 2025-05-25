import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditWarehouseForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/warehouses/${id}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch warehouse");
        return res.json();
      })
      .then((data) => {
        setName(data.name);
        setLocation(data.location);
        setLoading(false);
      })
      .catch((err) => {
        alert("Ошибка при загрузке склада");
        navigate("/warehouses");
      });
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedWarehouse = {
      name,
      location,
    };

    const res = await fetch(`http://localhost:8000/warehouses/${id}/`, {
      method: "PATCH", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedWarehouse),
    });

    if (res.ok) {
      alert("Склад успешно обновлен");
      navigate("/warehouses");
    } else {
      alert("Ошибка при обновлении склада");
    }
  };

  if (loading) return <p>Загрузка...</p>;

  return (
    <div>
      <h2>Редактировать склад</h2>
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
          <label>Локация:</label>
          <textarea
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <button type="submit">Сохранить</button>
      </form>
    </div>
  );
}
