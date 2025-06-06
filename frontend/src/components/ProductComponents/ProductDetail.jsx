import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthFetch } from "../../hooks/useAuthFetch";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const authFetch = useAuthFetch();

  useEffect(() => {
    authFetch(`http://localhost:8000/products/${id}/`)
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => {
        alert("Failed to load product");
        navigate("/products");
      });
  }, [id, navigate, authFetch]);

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    authFetch(`http://localhost:8000/products/${id}/`, { method: "DELETE" })
      .then(() => {
        alert("Product deleted");
        navigate("/products");
      })
      .catch(() => {
        alert("Failed to delete product");
      });
  };

  if (!product) return <p className="container fade-in">Loading...</p>;

  return (
    <div className="container fade-in">
      <div className="card">
        <h2>{product.name}</h2>
        <p><strong>Price:</strong> {product.price}</p>
        <p><strong>Description:</strong> {product.description}</p>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button className="btn btn-primary" onClick={() => navigate(`/products/edit/${id}`)}>
            Edit
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/products")}>
          ← Product List
        </button>
      </div>
    </div>
  );
}
