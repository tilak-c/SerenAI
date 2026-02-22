import { useState, useContext } from "react";
import { loginUser } from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

const handleLogin = async () => {
  try {
    const res = await loginUser({ email, password });

    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    navigate("/");
  } catch (err) {
    console.error(err);
    alert("Invalid credentials");
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoContainer}>
  <h1 style={styles.logo}>SerenAI</h1>
</div>
        <h2>Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
    logoContainer: {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "10px"
},

logo: {
  fontSize: "34px",
  color: "#34d399",
  fontWeight: "bold",
  letterSpacing: "2px",
  margin: 0
},
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#071a12"
  },
  card: {
    background: "#0f2e22",
    padding: "30px",
    borderRadius: "16px",
    width: "350px",
    color: "#d1fae5"
  },
  input: {
    width: "100%",
    marginBottom: "15px",
    padding: "10px",
    background: "#071a12",
    border: "1px solid #34d399",
    color: "white"
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#34d399",
    border: "none",
    cursor: "pointer"
  }
};
