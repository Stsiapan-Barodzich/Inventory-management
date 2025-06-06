import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthFetch } from "../../useAuthFetch";

export default function AddUserForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = { username, email, password };

    try {
      await authFetch("http://localhost:8000/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      alert("User added successfully");
      navigate("/users");
    } catch (error) {
      alert("Error while adding user: " + error.message);
    }
  };

  return (
    <div>
      <h2>Add User</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
