import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthFetch } from "../../useAuthFetch";

export default function EditUserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch(`http://localhost:8000/users/${id}/`)
      .then((data) => {
        setUsername(data.username || "");
        setEmail(data.email || "");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading user:", err);
        navigate("/users");
      });
  }, [id, authFetch, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await authFetch(`http://localhost:8000/users/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email }),
      });
      alert("User updated successfully");
      navigate(`/users/${id}`);
    } catch (err) {
      alert("Error updating user: " + err.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
