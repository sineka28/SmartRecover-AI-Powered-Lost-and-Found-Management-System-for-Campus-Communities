import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../api/userApi";

function RegisterPage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    try {
      const response = await registerUser(user);

      alert("✅ Registration Successful!");

      console.log(response.data);

      setUser({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.log(error);
      alert("❌ Registration Failed!");
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
          width: "430px",
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
            marginBottom: "25px",
          }}
        >
          Create Your Account
        </p>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={user.name}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "18px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={user.email}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "18px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "25px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleRegister}
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "10px",
            background: "#198754",
            color: "white",
            fontSize: "17px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          📝 Register
        </button>

        <p
          style={{
            marginTop: "25px",
            color: "#555",
          }}
        >
          Already have an account?
        </p>

        <Link
          to="/"
          style={{
            color: "#0d6efd",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          🔐 Login Here
        </Link>
      </div>
    </div>
  );
}

export default RegisterPage;