import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthFetch } from "@hooks/useAuthFetch";
import ErrorMessage from "../SharedComponents/ErrorMessage";

export default function AddUserForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const authFetch = useAuthFetch();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    setSuccess(""); 


    const newUser = { username, email, password };

    try {
      await authFetch("/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      setError(""); 
      setSuccess("User added successfully!");
      setTimeout(() => {
        navigate("/users");
      }, 1000); 
    } catch (error) {
      setError("Error while adding user: " + error.message);
    }
  };

  return (
    <div className="container fade-in">
      {error && <ErrorMessage message={error} />}
      {success && <ErrorMessage message={success} />}
      <div className="card">
        <h2>Add User</h2>
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
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}