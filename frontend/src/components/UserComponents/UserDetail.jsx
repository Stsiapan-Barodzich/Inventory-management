import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/users/${id}/`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [id]);

  const handleDelete = async () => {
    const res = await fetch(`http://localhost:8000/users/${id}/`, {
      method: "DELETE"
    });

    if (res.ok) {
      alert("Пользователь удалён");
      navigate("/users");
    }
  };

  if (!user) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>{user.username}</h2>
      <p>Email: {user.email}</p>
      <button onClick={() => navigate(`/users/${id}/edit`)}>Редактировать</button>
      <button onClick={handleDelete}>Удалить</button>
    </div>
  );
}
