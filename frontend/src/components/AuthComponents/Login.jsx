import { useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { useNavigate } from "react-router-dom"; 
import styles from "../../Styles/auth.module.css";

function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate(); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const success = await loginUser(username, password);
      if (success) {
        navigate("/warehouses"); 
      } else {
        alert("Неверный логин или пароль.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Ошибка при попытке входа.");
    }
  };

  return (
    <div className={styles.authContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className={styles.formGroup}>
          <label htmlFor="username">Login</label>
          <input
            type="text"
            id="username"
            placeholder="Enter login"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Войти
        </button>
      </form>
    </div>
  );
}

export default Login;
