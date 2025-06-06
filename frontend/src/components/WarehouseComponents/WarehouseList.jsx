import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthFetch } from "../../useAuthFetch";

export default function WarehouseList() {
  const [warehouses, setWarehouses] = useState([]);
  const authFetch = useAuthFetch();

  useEffect(() => {
    authFetch("http://localhost:8000/warehouses/")
      .then((data) => {
        console.log("Warehouses from API:", data);

        if (Array.isArray(data)) {
          setWarehouses(data);
        } else if (data && Array.isArray(data.results)) {
          setWarehouses(data.results);
        } else {
          console.warn("Unexpected data structure:", data);
          setWarehouses([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch warehouses:", err);
        setWarehouses([]); 
      });
  }, [authFetch]);

  return (
    <div className="container">
      <div className="sidebar">
        <Link to="/warehouses/add">
          <button>Add Warehouse</button>
        </Link>
      </div>

      <div className="content">
        <h2>Warehouses</h2>
        {warehouses.length === 0 ? (
          <p>No warehouses found.</p>
        ) : (
          <ul>
            {warehouses.map((warehouse) => (
              <li key={warehouse.id}>
                <Link to={`/warehouses/${warehouse.id}`}>{warehouse.name}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
