import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import ErrorMessage from "../SharedComponents/ErrorMessage";

export default function EditUserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    authFetch(`/users/${id}/`)
      .then((data) => {
        setUsername(data.username || "");
        setEmail(data.email || "");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading user:", err);
        setError("Error loading user: " + err.message);
        navigate("/users");
      });
  }, [id, authFetch, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    console.log("Submitting:", { username, email });

    try {
      console.log("Sending PATCH request for user ID:", id);
      const response = await authFetch(`/users/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email }),
      });
      console.log("Response received:", response);
      setSuccess("User edited successfully!");
      setError(""); 
      setTimeout(() => {
        navigate(`/users/${id}`);
      }, 1000); 
    } catch (err) {
      console.error("API error:", err);
      setError("Error updating user: " + err.message);
    }
  };

  if (loading) return <p className="container fade-in">Loading...</p>;

  return (
    <div className="container fade-in">
      {error && <ErrorMessage message={error} />}
      {success && <ErrorMessage message={success} />}
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