import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import ErrorMessage from "../SharedComponents/ErrorMessage";

export default function AddWarehouseForm() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const navigate = useNavigate();
  const authFetch = useAuthFetch();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  useEffect(() => {
    authFetch("http://localhost:8000/users/")
      .then(setUsers)
      .catch((err) => {
        console.error("Failed to load users:", err);
        setError("Error loading user list.");
      });
  }, [authFetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    setSuccess(""); 

    const newWarehouse = {
      name,
      location,
      users: selectedUsers,
    };

    try {
      await authFetch("http://localhost:8000/warehouses/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newWarehouse),
      });

      setError(""); 
      setSuccess("Warehouse aded successfully!");
      setTimeout(() => {
        navigate("/warehouses");
      }, 1000); 
    } catch (error) {
      setError("Error adding warehouse: " + error.message);
    }
  };

  return (
    <div className="container fade-in">
      {error && <ErrorMessage message={error} />}
      {success && <ErrorMessage message={success} />}

      <div className="card">
        <h2>Add Warehouse</h2>
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
          <div className="form-group">
            <label htmlFor="users">Users:</label>
            <select
              id="users"
              multiple
              value={selectedUsers}
              onChange={(e) =>
                setSelectedUsers(
                  Array.from(e.target.selectedOptions, (option) => Number(option.value))
                )
              }
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-success">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}