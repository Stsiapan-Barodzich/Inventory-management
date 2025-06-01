import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function WarehouseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState(null);
  const [products, setProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8000/warehouses/${id}/`)
      .then(res => {
        if (!res.ok) throw new Error("Warehouse not found");
        return res.json();
      })
      .then(data => setWarehouse(data))
      .catch(() => navigate("/warehouses"));
  }, [id, navigate]);

  const fetchProducts = async () => {
    const res = await fetch(`http://localhost:8000/warehouses/${id}/products/`);
    if (res.ok) {
      const data = await res.json();
      setProducts(data);
      setShowProducts(true);
    } else {
      alert("Ошибка при загрузке продуктов");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Вы уверены, что хотите удалить этот склад?")) {
      const res = await fetch(`http://localhost:8000/warehouses/${id}/`, {
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

  if (!warehouse) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>{warehouse.name}</h2>
      <p>Локация: {warehouse.location}</p>

      <button onClick={() => navigate(`/warehouses/edit/${id}`)}>Редактировать</button>
      <button
        onClick={handleDelete}
        style={{ marginLeft: "10px", backgroundColor: "#ff4d4f", color: "#fff" }}
      >
        Удалить
      </button>
      <button onClick={fetchProducts}>Список продуктов</button>

      
      <br /><br />
      <button onClick={() => navigate("/warehouses")}>← Список складов</button>
      <br /><br />

      

      {showProducts && (
        <div>
          <h3>Продукты на складе:</h3>
          {products.length === 0 ? (
            <p>Нет продуктов на этом складе</p>
          ) : (
            <ul>
              {products.map((p, i) => (
                <li key={i}>
                  {p.product_name} — {p.quantity}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
