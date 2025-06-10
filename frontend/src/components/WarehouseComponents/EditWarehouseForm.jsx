import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import ErrorMessage from "../SharedComponents/ErrorMessage";

export default function EditWarehouseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const authFetch = useAuthFetch();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    authFetch(`http://localhost:8000/warehouses/${id}/`)
      .then((data) => {
        setName(data.name);
        setLocation(data.location);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching warehouse:", err);
        setError("Error loading warehouse");
        navigate("/warehouses");
      });
  }, [id, navigate, authFetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    setSuccess(""); 

    const updatedWarehouse = {
      name,
      location,
    };

    try {
      await authFetch(`http://localhost:8000/warehouses/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedWarehouse),
      });


      setError(""); 
      setSuccess("Warehouse edited successfully!");
      setTimeout(() => {
        navigate("/warehouses");
      }, 1000); 
    } catch (error) {
      console.error("Error updating warehouse:", error);
      setError("Error updating warehouse: " + error.message);
    }
  };

  if (loading) return <p className="container fade-in">Loading...</p>;

  return (
    <div className="container fade-in">
      {error && <ErrorMessage message={error} />}
      {success && <ErrorMessage message={success} />}
      <div className="card">
        <h2>Edit Warehouse</h2>
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
            <label htmlFor="location">Location:</label>
            <textarea
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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