import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function WarehouseDetail() {
  const { id } = useParams();
  const [warehouse, setWarehouse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8000/warehouses/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Warehouse not found");
        return res.json();
      })
      .then(data => setWarehouse(data))
      .catch(() => navigate("/warehouses")); 
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm("Вы уверены, что хотите удалить этот склад?")) {
      const res = await fetch(`http://localhost:8000/warehouses/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Склад удалён");
        navigate("/warehouses");
      } else {
        alert("Ошибка при удалении");
      }
    }
  };

  if (!warehouse) return <p>Загрузка...</p>;

  return (
    <div>
      <h2>{warehouse.name}</h2>
      <p>Локация: {warehouse.location}</p>

      <Link to={`/warehouses/${id}/edit`}>
        <button>Редактировать склад</button>
      </Link>

      <button onClick={handleDelete} style={{ marginLeft: "10px", backgroundColor: "#ff4d4f", color: "#fff" }}>
        Удалить склад
      </button>
      
      <br />
      <Link to="/warehouses">← Вернуться к списку складов</Link>
    </div>
  );
}
