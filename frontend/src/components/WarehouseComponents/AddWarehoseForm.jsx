import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthFetch } from "../../useAuthFetch";

export default function AddWarehouseForm() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  useEffect(() => {
    authFetch("http://localhost:8000/users/")
      .then(setUsers)
      .catch((err) => {
        console.error("Failed to load users:", err);
        alert("Error loading user list.");
      });
  }, [authFetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      alert("Warehouse added!");
      navigate("/warehouses");
    } catch (error) {
      console.error("Failed to add warehouse:", error);
      alert("Error adding warehouse: " + error.message);
    }
  };

  return (
    <div>
      <h2>Add Warehouse</h2>
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
        <div>
          <label>Users:</label>
          <select
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
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
