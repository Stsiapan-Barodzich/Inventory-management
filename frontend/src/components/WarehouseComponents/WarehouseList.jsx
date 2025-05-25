import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function WarehouseList() {
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/warehouses/")  
      .then(res => res.json())
      .then(data => setWarehouses(data))
      .catch(err => console.error("Не удалось получить список складов:", err));
  }, []);

  return (
    <div className="container">
      <div className="sidebar">
        <Link to="/warehouses/add">
          <button>Добавить склад</button>
        </Link>
      </div>

      <div className="content">
        <h2>Склады</h2>
        <ul>
          {warehouses.map(warehouse => (
            <li key={warehouse.id}>
              <Link to={`/warehouses/${warehouse.id}`}>
                {warehouse.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
