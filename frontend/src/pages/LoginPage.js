import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/userApi";

function LoginPage() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const response = await loginUser(loginData);

      localStorage.setItem("token", response.data.token);

      alert("✅ Login Successful!");

      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("❌ Login Failed!");
      }
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#1e3c72,#2a5298)",
      }}
    >
      <div
        style={{
          width: "420px",
          background: "#fff",
          padding: "40px",
          borderRadius: "20px",
          textAlign: "center",
          boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ fontSize: "55px" }}>🧠</div>

        <h1
          style={{
            color: "#1e3c72",
            marginBottom: "5px",
          }}
        >
          SmartRecover AI
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: "30px",
          }}
        >
          AI Powered Lost & Found Management System
        </p>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={loginData.email}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "18px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={loginData.password}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "25px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "10px",
            background: "#0d6efd",
            color: "white",
            fontSize: "17px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🔐 Login
        </button>

        <p
          style={{
            marginTop: "25px",
            color: "#555",
          }}
        >
          Don't have an account?
        </p>

        <Link
          to="/register"
          style={{
            color: "#0d6efd",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;