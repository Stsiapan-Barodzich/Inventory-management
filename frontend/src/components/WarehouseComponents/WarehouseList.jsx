import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthFetch } from "../../hooks/useAuthFetch";

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
    <div className="container fade-in">
      <div className="card">
        <h2>Warehouses</h2>
        <Link to="/warehouses/add">
          <button className="btn btn-success" style={{ marginBottom: "20px" }}>
            Add Warehouse
          </button>
        </Link>
        {warehouses.length === 0 ? (
          <p>No warehouses found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((warehouse) => (
                <tr key={warehouse.id}>
                  <td>
                    <Link to={`/warehouses/${warehouse.id}`}>{warehouse.name}</Link>
                  </td>
                  <td>
                    <Link to={`/warehouses/edit/${warehouse.id}`}>
                      <button className="btn btn-primary" style={{ marginRight: "10px" }}>
                        Edit
                      </button>
                    </Link>
                    <Link to={`/warehouses/${warehouse.id}`}>
                      <button className="btn btn-primary">
                        Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
