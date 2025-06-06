import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthFetch } from "../../useAuthFetch";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const authFetch = useAuthFetch();

  useEffect(() => {
    authFetch("http://localhost:8000/users/")
      .then(setUsers)
      .catch((err) =>
        console.error("Error loading users:", err)
      );
  }, [authFetch]);

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.username}</Link>
          </li>
        ))}
      </ul>
      <Link to="/users/add">
        <button>Add User</button>
      </Link>
    </div>
  );
}
