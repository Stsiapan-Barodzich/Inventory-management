import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthFetch } from "@hooks/useAuthFetch";
import ErrorMessage from "../SharedComponents/ErrorMessage";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    authFetch(`/users/${id}/`)
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading user:", err);
        setError("Error loading user");
        navigate("/users");
      });
  }, [id, authFetch, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await authFetch(`/users/${id}/`, {
        method: "DELETE",
      });
      setError(""); 
      navigate("/users");
    } catch (err) {
      setError("Error deleting user: " + err.message);
    }
  };

  if (loading) return <div className="container fade-in">Loading...</div>;

  return (
    <div className="container fade-in">
      {error && <ErrorMessage message={error} />}
      <div className="card">
        <h2>{user.username}</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button className="btn btn-primary" style={{  marginTop: '20px', height: '50px', paddingRight: "10px" }} onClick={() => navigate("/users")}>
            ← User List
          </button>
          <button className="btn btn-primary" style={{ marginTop: '20px', height: '50px' }} onClick={() => navigate(`/users/edit/${id}`)}>
            Edit
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
