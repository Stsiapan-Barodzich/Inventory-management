import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthFetch } from "@hooks/useAuthFetch";
import ErrorMessage from "../SharedComponents/ErrorMessage";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const authFetch = useAuthFetch();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductData() {
      try {
        const productData = await authFetch(`/products/${id}/`);
        setProduct(productData);
        
        // Если у продукта есть категория, загружаем её данные
        if (productData.category) {
          const categoryData = await authFetch(`/categories/${productData.category}/`);
          setCategory(categoryData);
        }
        
        setLoading(false);
      } catch (err) {
        setError("Failed to load product");
        setLoading(false);
        navigate("/products");
      }
    }
    
    fetchProductData();
  }, [id, navigate, authFetch]);

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    authFetch(`/products/${id}/`, { method: "DELETE" })
      .then(() => {
        setError(""); 
        navigate("/products");
      })
      .catch(() => {
        setError("Failed to delete product");
      });
  };

  if (loading) return <p className="container fade-in">Loading...</p>;
  if (!product) return <p className="container fade-in">Product not found</p>;

  return (
    <div className="container fade-in">
      {error && <ErrorMessage message={error} />}
      <div className="card">
        <h2>{product.name}</h2>
        <p><strong>Price:</strong> {product.price}</p>
        <p><strong>Category:</strong> {category ? category.name : "No category"}</p>
        <p><strong>Description:</strong> {product.description || "No description"}</p>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button 
            className="btn btn-primary" 
            style={{ marginTop: '20px' }} 
            onClick={() => navigate(`/products/edit/${id}`)}
          >
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