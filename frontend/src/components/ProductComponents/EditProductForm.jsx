import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import ErrorMessage from "../SharedComponents/ErrorMessage";

export default function EditProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchProductAndCategories() {
      try {
        const [productData, categoriesData] = await Promise.all([
          authFetch(`http://localhost:8000/products/${id}/`),
          authFetch("http://localhost:8000/categories/"),
        ]);
        setName(productData.name);
        setPrice(productData.price);
        setDescription(productData.description || "");
        setCategoryId(productData.category?.id || "");
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Failed to load product: " + (error.response?.data ? Object.values(error.response.data).flat().join(" ") : error.message));
        setTimeout(() => navigate("/products"), 1000);
      }
    }
    fetchProductAndCategories();
  }, [id, navigate, authFetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !price) {
      setError("Name and price are required");
      return;
    }

    const priceNum = Number(price);
    if (priceNum <= 0) {
      setError("Price must be positive");
      return;
    }

    const updatedProduct = {
      name,
      price: priceNum,
      description,
      category: categoryId || null, 
    };

    try {
      await authFetch(`http://localhost:8000/products/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });
      setSuccess("Product edited successfully!");
      setTimeout(() => navigate("/products"), 1000);
    } catch (error) {
      console.error("API error:", error);
      const errorMessage = error.response?.data
        ? Object.values(error.response.data).flat().join(" ")
        : error.message;
      setError("Failed to update product: " + errorMessage);
    }
  };

  if (loading) return <p className="container fade-in">Loading...</p>;

  return (
    <div className="container fade-in">
      {error && <ErrorMessage message={error} />}
      {success && <ErrorMessage message={success} />}
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
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">No Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
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