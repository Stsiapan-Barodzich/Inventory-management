import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthFetch } from "../../useAuthFetch";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch(`http://localhost:8000/users/${id}/`)
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading user:", err);
        navigate("/users");
      });
  }, [id, authFetch, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await authFetch(`http://localhost:8000/users/${id}/`, {
        method: "DELETE",
      });
      alert("User deleted");
      navigate("/users");
    } catch (err) {
      alert("Error deleting user: " + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>{user.username}</h2>
      <p>Email: {user.email}</p>
      <button onClick={() => navigate(`/users/edit/${id}`)}>Edit</button>
      <button
        onClick={handleDelete}
        style={{ marginLeft: "10px", backgroundColor: "#ff4d4f", color: "#fff" }}
      >
        Delete
      </button>
      <br /><br />
      <button onClick={() => navigate("/users")}>← User List</button>
    </div>
  );
}
