import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthFetch } from "../../hooks/useAuthFetch";

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

  if (loading) return <p className="container fade-in">Loading...</p>;

  return (
    <div className="container fade-in">
      <div className="card">
        <h2>Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
