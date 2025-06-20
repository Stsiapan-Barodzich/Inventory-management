import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthFetch } from "@hooks/useAuthFetch";
import AddCategoryForm from "./AddCategoryForm";
import ErrorMessage from "../SharedComponents/ErrorMessage";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const authFetch = useAuthFetch();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await authFetch("/categories/");
        setCategories(Array.isArray(response.data) ? response.data : Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to fetch categories: " + error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [authFetch]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const refreshCategories = async () => {
    try {
      const response = await authFetch("/categories/");
      setCategories(Array.isArray(response.data) ? response.data : Array.isArray(response) ? response : []);
    } catch (error) {
      setError("Failed to fetch categories: " + error.message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        {error && <ErrorMessage message={error} />}
        <h2>Category List</h2>
        <button
          onClick={handleShowModal}
          className="btn btn-success"
          style={{ marginBottom: "20px" }}
        >
          Add Category
        </button>
        {isLoading ? (
          <p>Loading categories...</p>
        ) : categories.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>
                    <Link className="center" to={`/edit-category/${category.id}`}>
                      <button
                        className="btn btn-primary"
                        style={{ marginRight: "10px" }}
                      >
                        Edit
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No categories available.</p>
        )}
      </div>

      {showModal && (
        <div
          className="modal"
          style={{
            position: "fixed",
            top: "300px",
            left: "calc(57% - 200px)", 
            zIndex: 1000,
            pointerEvents: "auto", 
          }}
        >
          <div
            className="modal-content"
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              pointerEvents: "auto",
            }}
          >
            <h2>Add Category</h2>
            <button
              onClick={handleCloseModal}
              style={{
                float: "right",
                background: "none",
                border: "none",
                fontSize: "1.2rem",
                cursor: "pointer",
              }}
            >
              ×
            </button>
            <AddCategoryForm
              onSuccess={() => {
                handleCloseModal();
                refreshCategories();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
