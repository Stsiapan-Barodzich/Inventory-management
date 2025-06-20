import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthFetch } from "@hooks/useAuthFetch";
import ErrorMessage from "../SharedComponents/ErrorMessage";

export default function WarehouseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  const [warehouse, setWarehouse] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const warehouseData = await authFetch(`/warehouses/${id}/`);
        setWarehouse(warehouseData);

        const productData = await authFetch(`/warehouses/${id}/products/`);
        setProducts(productData);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching warehouse or products:", err);
        setError("Error loading warehouse or products");
        navigate("/warehouses");
      }
    };

    fetchData();
  }, [id, navigate, authFetch]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this warehouse?")) return;

    try {
      await authFetch(`/warehouses/${id}/`, {
        method: "DELETE",
      });
      setError("");
      navigate("/warehouses");
    } catch (error) {
      setError("Error deleting warehouse: " + error.message);
    }
  };

  if (loading) return <p className="container fade-in">Loading...</p>;

  return (
    <div className="container fade-in">
      {error && <ErrorMessage message={error} />}
      <div className="card">
        <h2>{warehouse.name}</h2>
        <h3>Location:</h3>
        <p>{warehouse.location}</p>
        <div style={{ marginTop: "20px" }}>
          <h3>Products in Warehouse:</h3>
          {products.length === 0 ? (
            <p>No products found in this warehouse</p>
          ) : (
            <ul>
              {products.map((p) => (
                <li key={p.id || p.product.name}>

                  {p.product.name} — {p.quantity}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div style={{ marginTop: "20px" }}>
          <h3>Warehouse users:</h3>
          {warehouse.users && warehouse.users.length > 0 ? (
            <ul>
              {warehouse.users.map((user) => (
                <li key={user.id}>
                  {user.username} ({user.email})
                </li>
              ))}
            </ul>
          ) : (
            <p>No users assigned to this warehouse</p>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button className="btn btn-back" onClick={() => navigate("/warehouses")}>
            ← Back to Warehouses List
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
