import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import ErrorMessage from "../SharedComponents/ErrorMessage";

export default function EditWarehouseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [users, setUsers] = useState([]); // all available users
  const [selectedUsers, setSelectedUsers] = useState([]); // selected user ids

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Загрузка склада и списка всех пользователей
    const fetchData = async () => {
      try {
        const warehouse = await authFetch(`/warehouses/${id}/`);
        setName(warehouse.name);
        setLocation(warehouse.location);
        setSelectedUsers(warehouse.users || []); // <- user IDs

        const usersData = await authFetch(`/users/`);
        setUsers(usersData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Error loading warehouse or users");
        navigate("/warehouses");
      }
    };

    fetchData();
  }, [id, navigate, authFetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const updatedWarehouse = {
      name,
      location,
      users: selectedUsers, // передаём массив ID
    };

    try {
      await authFetch(`/warehouses/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedWarehouse),
      });

      setSuccess("Warehouse updated successfully!");
      setTimeout(() => {
        navigate("/warehouses");
      }, 1000);
    } catch (error) {
      console.error("Error updating warehouse:", error);
      setError("Error updating warehouse: " + error.message);
    }
  };

  const handleUserChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(parseInt(options[i].value));
      }
    }
    setSelectedUsers(selected);
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
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <textarea id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          <div className="form-group">
            <label htmlFor="users">Responsible Users:</label>
            <select multiple id="users" value={selectedUsers} onChange={handleUserChange}>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary">Save</button>
        </form>
      </div>
    </div>
  );
}
