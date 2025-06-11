import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/users/")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Ошибка при загрузке пользователей:", err));
  }, []);

  return (
    <div>
      <h2>Пользователи</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.username}</Link>
          </li>
        ))}
      </ul>
      <Link to="/users/add">
        <button>Добавить пользователя</button>
      </Link>
    </div>
  );
}
