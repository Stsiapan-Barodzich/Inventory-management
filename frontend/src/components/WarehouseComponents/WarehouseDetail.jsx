import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthFetch } from "../../useAuthFetch";

export default function WarehouseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  const [warehouse, setWarehouse] = useState(null);
  const [products, setProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch(`http://localhost:8000/warehouses/${id}/`)
      .then((data) => {
        setWarehouse(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching warehouse:", err);
        navigate("/warehouses");
      });
  }, [id, navigate, authFetch]);

  const fetchProducts = async () => {
    try {
      const data = await authFetch(`http://localhost:8000/warehouses/${id}/products/`);
      setProducts(data);
      setShowProducts(true);
    } catch (error) {
      alert("Error loading products: " + error.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this warehouse?")) return;

    try {
      await authFetch(`http://localhost:8000/warehouses/${id}/`, {
        method: "DELETE",
      });
      alert("Warehouse deleted");
      navigate("/warehouses");
    } catch (error) {
      alert("Error deleting warehouse: " + error.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>{warehouse.name}</h2>
      <p>Location: {warehouse.location}</p>

      <button onClick={() => navigate(`/warehouses/edit/${id}`)}>Edit</button>
      <button
        onClick={handleDelete}
        style={{ marginLeft: "10px", backgroundColor: "#ff4d4f", color: "#fff" }}
      >
        Delete
      </button>
      <button onClick={fetchProducts}>Show Products</button>

      <br /><br />
      <button onClick={() => navigate("/warehouses")}>← Back to Warehouses List</button>

      {showProducts && (
        <div>
          <h3>Products in Warehouse:</h3>
          {products.length === 0 ? (
            <p>No products found in this warehouse</p>
          ) : (
            <ul>
              {products.map((p) => (
                <li key={p.id || p.product_name}>
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
