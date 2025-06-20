import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import ErrorMessage from "../SharedComponents/ErrorMessage";

export default function EditCategoryForm() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoading(true);
      try {
        const response = await authFetch(`http://localhost:8000/categories/${id}/`);
        console.log("API response:", response); // Отладка
        // Поддержка разных форматов ответа
        const category = response.data || response;
        if (!category || !category.name) {
          throw new Error("Invalid category data");
        }
        setName(category.name);
      } catch (error) {
        console.error("API error:", error);
        setError(`Failed to fetch category: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategory();
  }, [id, authFetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name) {
      setError("Category name is required");
      return;
    }

    const updatedCategory = { name };

    try {
      await authFetch(`http://localhost:8000/categories/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCategory),
      });
      setSuccess("Category updated successfully!");
      setTimeout(() => {
        navigate("/categories"); // Перенаправление на список категорий
      }, 1000);
    } catch (error) {
      console.error("API error:", error);
      const errorMessage = error.response?.data
        ? Object.values(error.response.data).flat().join(" ")
        : error.message;
      setError(`Failed to update category: ${errorMessage}`);
    }
  };

  return (
    <div className="container fade-in">
      {error && <ErrorMessage message={error} />}
      {success && <ErrorMessage message={success} isSuccess={true} />}
      <div className="card">
        <h2>Edit Category</h2>
        {isLoading ? (
          <p>Loading category...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Category Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-field" // Заменил form-control на input-field для консистентности
              />
            </div>
            <button type="submit" className="btn btn-success">
              Update Category
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
