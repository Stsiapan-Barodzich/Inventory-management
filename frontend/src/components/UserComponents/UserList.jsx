import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthFetch } from "@hooks/useAuthFetch";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const authFetch = useAuthFetch();

  useEffect(() => {
    authFetch("/users/")
      .then(setUsers)
  }, [authFetch]);

  return (
    <div className="container fade-in">
      <div className="card">
        <h2>Users</h2>
        <Link to="/users/add">
          <button className="btn btn-success" style={{ marginBottom: "20px" }}>
            Add User
          </button>
        </Link>
        {users.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Username</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <Link to={`/users/${user.id}`}>{user.username}</Link>
                  </td>
                  <td>
                    <Link className="center" to={`/users/edit/${user.id}`}>
                      <button className="btn btn-primary" style={{ marginRight: "10px" }}>
                        Edit
                      </button>
                    </Link>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users available.</p>
        )}
      </div>
    </div>
  );
}
