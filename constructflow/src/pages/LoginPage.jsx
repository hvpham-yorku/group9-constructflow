import { useState } from "react";
import "../styles/LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>ConstructFlow</h1>
          <p>Construction Project Management</p>
        </div>

        <div className="login-form">
          <h2>Sign In</h2>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn-primary">Login</button>

          <div className="login-footer">
            <a href="#forgot">Forgot Password?</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
