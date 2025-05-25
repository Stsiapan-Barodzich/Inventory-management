import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddUserForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = { username, email };

    const res = await fetch("http://localhost:8000/users/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    });

    if (res.ok) {
      alert("Пользователь добавлен");
      navigate("/users");
    } else {
      alert("Ошибка при добавлении");
    }
  };

  return (
    <div>
      <h2>Добавить пользователя</h2>
      <form onSubmit={handleSubmit}>
        <label>Имя пользователя:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit">Добавить</button>
      </form>
    </div>
  );
}
