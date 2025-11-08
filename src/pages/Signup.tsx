// src/pages/Signup.tsx
import React, { useState } from "react";
import logo from "../assets/mkisaan_logo.jpg";
import bgImage from "../assets/mkisaan.jpg";

type Props = { onBack: () => void };

export default function Signup({ onBack }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState<"farmer" | "trader">("farmer");
  const [loading, setLoading] = useState(false);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = { firstName, lastName, email, mobile, role };
    console.log("Signup payload:", payload);

    // Placeholder for real API call:
    // const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/auth/signup`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ name: `${firstName} ${lastName}`, email, password: generatedOrProvided, role, mobile }),
    // });
    // handle response...

    setTimeout(() => {
      setLoading(false);
      alert("Signup successful (mock). You can now implement real API call.");
      onBack();
    }, 700);
  };

  return (
    <div
      className="app-background signup-bg"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <header className="app-header">
        <div className="logo-section" onClick={onBack} style={{ cursor: "pointer" }}>
          <img src={logo} alt="logo" className="logo-img" />
          <span className="logo-text">mkisaan</span>
        </div>
      </header>

      <main className="signup-card-wrap">
        <div className="signup-card">
          <h2>Create an account</h2>

          <form onSubmit={handleSignupSubmit} className="signup-form">
            <div className="grid-2">
              <label>
                First name
                <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </label>
              <label>
                Last name
                <input required value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </label>
            </div>

            <label>
              Email
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>

            <label>
              Mobile
              <input required value={mobile} onChange={(e) => setMobile(e.target.value)} />
            </label>

            <label>
              Role
              <select value={role} onChange={(e) => setRole(e.target.value as any)}>
                <option value="farmer">Farmer</option>
                <option value="trader">Trader</option>
              </select>
            </label>

            <div className="modal-actions" style={{ marginTop: 16 }}>
              <button type="button" className="btn btn-outline" onClick={onBack}>
                Back
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Creating..." : "Create account"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}