import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthFetch } from "../../useAuthFetch";

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

  if (!product) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>{product.name}</h2>
      <p>Price: {product.price}</p>
      <p>Description: {product.description}</p>

      <button onClick={() => navigate(`/products/edit/${id}`)}>Edit</button>
      <button
        onClick={handleDelete}
        style={{ marginLeft: 10, backgroundColor: "#ff4d4f", color: "#fff" }}
      >
        Delete
      </button>

      <br />
      <button onClick={() => navigate("/products")}>← Product List</button>
    </div>
  );
}
