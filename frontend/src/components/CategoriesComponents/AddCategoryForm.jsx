import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import ErrorMessage from "../SharedComponents/ErrorMessage";

export default function AddCategoryForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name) {
      setError("Category name is required");
      return;
    }

    const newCategory = { name };

    try {
      await authFetch("http://localhost:8000/categories/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });
      setSuccess("Category added successfully!");
      setName("");
      if (onSuccess) {
        onSuccess(); // Закрываем модальное окно
      }
      setTimeout(() => {
        navigate("/product-stocks");
      }, 1000);
    } catch (error) {
      console.error("API error:", error);
      const errorMessage = error.response?.data
        ? Object.values(error.response.data).flat().join(" ")
        : error.message;
      setError("Failed to add category: " + errorMessage);
    }
  };

  return (
    <div className="fade-in">
      {error && <ErrorMessage message={error} />}
      {success && <ErrorMessage message={success} isSuccess={true} />}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Category Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-success mt-3">
          Add Category
        </button>
      </form>
    </div>
  );
}