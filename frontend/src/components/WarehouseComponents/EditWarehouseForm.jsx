import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthFetch } from "../../useAuthFetch";

export default function EditWarehouseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const authFetch = useAuthFetch();

  useEffect(() => {
    authFetch(`http://localhost:8000/warehouses/${id}/`)
      .then((data) => {
        setName(data.name);
        setLocation(data.location);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching warehouse:", err);
        alert("Error loading warehouse");
        navigate("/warehouses");
      });
  }, [id, navigate, authFetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      alert("Warehouse successfully updated");
      navigate("/warehouses");
    } catch (error) {
      console.error("Error updating warehouse:", error);
      alert("Error updating warehouse: " + error.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit Warehouse</h2>
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
          <label>Location:</label>
          <textarea
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <button type="submit">Save</button>
      </form>
    </div>
  );
}
