"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

export function AdminLogin({ configured }: { configured: boolean }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        setError(result?.error ?? "Could not sign in.");
        return;
      }
      window.location.reload();
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="adminLoginPage">
      <Link className="adminBackLink" href="/">← Back to site</Link>
      <form className="adminLoginCard" onSubmit={submit}>
        <div className="adminLoginMark">T</div>
        <p className="adminLoginEyebrow">PRIVATE WORKSPACE</p>
        <h1>Site admin</h1>
        <p className="adminLoginIntro">
          Sign in to edit the content published on your personal site.
        </p>
        <label htmlFor="admin-password">Admin password</label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={!configured || submitting}
          autoFocus
        />
        {error && <p className="adminLoginError" role="alert">{error}</p>}
        {!configured && (
          <p className="adminLoginError" role="alert">
            Admin access is not configured. Add the required environment variables first.
          </p>
        )}
        <button type="submit" disabled={!configured || submitting || !password}>
          {submitting ? "Signing in…" : "Continue"}
        </button>
        <p className="adminLoginFootnote">
          The public site never exposes these editing controls.
        </p>
      </form>
    </main>
  );
}
