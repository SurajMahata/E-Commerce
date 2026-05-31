import { useMemo, useState } from "react";
import { authApi } from "../services/api.js";

const initialForm = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: ""
};

const SPECIAL_CHARACTER_PATTERN = /[^A-Za-z0-9]/;

function validatePassword(password) {
  if (password.length < 8) {
    return "New password must be at least 8 characters.";
  }
  if (!/[A-Z]/.test(password)) {
    return "New password must include one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "New password must include one lowercase letter.";
  }
  if (!/\d/.test(password)) {
    return "New password must include one number.";
  }
  if (!SPECIAL_CHARACTER_PATTERN.test(password)) {
    return "New password must include one special character.";
  }
  return "";
}

function PasswordField({ id, label, value, error, visible, onChange, onToggle }) {
  return (
    <label className="password-field" htmlFor={id}>
      <span>{label}</span>
      <div className={`password-input ${error ? "has-error" : ""}`}>
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(id, event.target.value)}
          autoComplete={id === "currentPassword" ? "current-password" : "new-password"}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <button
          type="button"
          className="toggle-password"
          onClick={() => onToggle(id)}
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {error && <small id={`${id}-error`} className="field-error">{error}</small>}
    </label>
  );
}

export default function UpdatePassword() {
  const [form, setForm] = useState(initialForm);
  const [visible, setVisible] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const strengthChecks = useMemo(() => [
    { label: "8+ characters", passed: form.newPassword.length >= 8 },
    { label: "Uppercase", passed: /[A-Z]/.test(form.newPassword) },
    { label: "Lowercase", passed: /[a-z]/.test(form.newPassword) },
    { label: "Number", passed: /\d/.test(form.newPassword) },
    { label: "Special", passed: SPECIAL_CHARACTER_PATTERN.test(form.newPassword) }
  ], [form.newPassword]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setStatus({ type: "", message: "" });
  }

  function toggleVisibility(field) {
    setVisible((current) => ({ ...current, [field]: !current[field] }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.currentPassword.trim()) {
      nextErrors.currentPassword = "Current password is required.";
    }

    const newPasswordError = validatePassword(form.newPassword);
    if (newPasswordError) {
      nextErrors.newPassword = newPasswordError;
    }

    if (form.confirmNewPassword !== form.newPassword) {
      nextErrors.confirmNewPassword = "Confirm password must match the new password.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await authApi.updatePassword(form);
      setForm(initialForm);
      setErrors({});
      setStatus({ type: "success", message: response?.message || "Password updated successfully." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="password-page">
      <form className="password-card" onSubmit={submit} noValidate>
        <div className="password-heading">
          <span>Account security</span>
          <h1>Update password</h1>
          <p>Use a strong password you do not use anywhere else.</p>
        </div>

        {status.message && (
          <div className={status.type === "success" ? "success" : "error"} role="alert">
            {status.message}
          </div>
        )}

        <PasswordField
          id="currentPassword"
          label="Current Password"
          value={form.currentPassword}
          error={errors.currentPassword}
          visible={visible.currentPassword}
          onChange={update}
          onToggle={toggleVisibility}
        />
        <PasswordField
          id="newPassword"
          label="New Password"
          value={form.newPassword}
          error={errors.newPassword}
          visible={visible.newPassword}
          onChange={update}
          onToggle={toggleVisibility}
        />

        <div className="password-rules" aria-label="Password requirements">
          {strengthChecks.map((check) => (
            <span key={check.label} className={check.passed ? "passed" : ""}>{check.label}</span>
          ))}
        </div>

        <PasswordField
          id="confirmNewPassword"
          label="Confirm New Password"
          value={form.confirmNewPassword}
          error={errors.confirmNewPassword}
          visible={visible.confirmNewPassword}
          onChange={update}
          onToggle={toggleVisibility}
        />

        <button className="gold-button password-submit" disabled={submitting}>
          {submitting ? "Updating..." : "Update Password"}
        </button>
      </form>
    </section>
  );
}
