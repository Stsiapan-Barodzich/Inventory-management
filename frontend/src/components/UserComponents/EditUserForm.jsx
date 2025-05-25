import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditUserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8000/users/${id}/`)
      .then(res => res.json())
      .then(data => {
        setUsername(data.username);
        setEmail(data.email);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:8000/users/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email })
    });

    if (res.ok) {
      alert("Пользователь обновлён");
      navigate(`/users/${id}`);
    }
  };

  return (
    <div>
      <h2>Редактировать пользователя</h2>
      <form onSubmit={handleSubmit}>
        <label>Имя пользователя:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit">Сохранить</button>
      </form>
    </div>
  );
}
