import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthFetch } from "../../hooks/useAuthFetch";

export default function EditProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch(`http://localhost:8000/products/${id}/`)
      .then((data) => {
        setName(data.name);
        setPrice(data.price);
        setDescription(data.description);
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load product");
        navigate("/products");
      });
  }, [id, navigate, authFetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProduct = {
      name,
      price,
      description,
    };

    try {
      await authFetch(`http://localhost:8000/products/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });
      alert("Product updated successfully");
      navigate("/products");
    } catch {
      alert("Failed to update product");
    }
  };

  if (loading) return <p className="container fade-in">Loading...</p>;

  return (
    <div className="container fade-in">
      <div className="card">
        <h2>Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              step="0.01"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
