import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthFetch } from "../../useAuthFetch";

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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Price:</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button type="submit">Save</button>
      </form>
    </div>
  );
}
