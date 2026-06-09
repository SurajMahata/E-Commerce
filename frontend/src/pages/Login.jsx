import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="auth-page" data-testid="login-page">
      <form className="auth-card" data-testid="login-form" onSubmit={submit}>
        <h1 data-testid="login-title">Sign in</h1>
        {error && <div className="error" role="alert" data-testid="auth-error">{error}</div>}
        <label>Email<input data-testid="login-email" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Password<input data-testid="login-password" required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <button className="gold-button" data-testid="login-submit">Continue</button>
        <p>New to ShopVerse? <Link data-testid="create-account-link" to="/register">Create your account</Link></p>
        <small>Admin demo: admin@shopverse.com / Admin123</small>
      </form>
    </section>
  );
}
