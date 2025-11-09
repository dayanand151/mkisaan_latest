// // src/App.tsx
// import React, { useState } from "react";
// import bgImage from "./assets/mkisaan.jpg";
// import logo from "./assets/mkisaan_logo.jpg";
// import Signup from "./pages/Signup"; // new page we will create
// import "./App.css";

// function App(): JSX.Element {
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [mobile, setMobile] = useState("");
//   const [page, setPage] = useState<"home" | "signup">("home");

//   // Placeholder: replace with real API call to request OTP or login
//   const handleLoginSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Login requested for mobile:", mobile);
//     // Example API call
//     // await fetch(`${import.meta.env.VITE_API_BASE}/api/auth/login-mobile`, { method: 'POST', body: JSON.stringify({ mobile }) })
//     // show OTP input or redirect as needed
//     alert("Login flow started for: " + mobile);
//     setShowLoginModal(false);
//     setMobile("");
//   };

//   if (page === "signup") {
//     return <Signup onBack={() => setPage("home")} />;
//   }

//   return (
//     <div
//       className="app-background"
//       style={{ backgroundImage: `url(${bgImage})` }}
//     >
//       {/* Header */}
//       <header className="app-header">
//         <div className="logo-section" role="img" aria-label="mkisaan logo">
//           <img src={logo} alt="mkisaan logo" className="logo-img" />
//           <span className="logo-text">mkisaan</span>
//         </div>
//       </header>

//       {/* Hero Text & Buttons */}
//       <section className="hero-text" aria-labelledby="hero-heading">
//         <h1 id="hero-heading">
//           Empowering farmers.
//           <br />
//           Connecting India’s markets.
//         </h1>

//         <div className="hero-buttons" role="group" aria-label="Primary actions">
//           <button
//             className="btn btn-ghost"
//             type="button"
//             onClick={() => setShowLoginModal(true)}
//           >
//             Log in
//           </button>

//           <button
//             className="btn btn-ghost"
//             type="button"
//             onClick={() => setPage("signup")}
//           >
//             Sign up
//           </button>
//         </div>
//       </section>

//       {/* Login Modal (in-page) */}
//       {showLoginModal && (
//         <div className="modal-overlay" onMouseDown={() => setShowLoginModal(false)}>
//           <div
//             className="modal-card"
//             onMouseDown={(e) => e.stopPropagation()}
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="login-title"
//           >
//             <h2 id="login-title">Log in</h2>
//             <p className="muted">Enter your mobile number to continue</p>

//             <form onSubmit={handleLoginSubmit} className="login-form">
//               <label className="input-label">
//                 Mobile number
//                 <input
//                   type="tel"
//                   inputMode="numeric"
//                   pattern="[0-9]{10,15}"
//                   placeholder="e.g. 9876543210"
//                   value={mobile}
//                   onChange={(e) => setMobile(e.target.value)}
//                   required
//                 />
//               </label>

//               <div className="modal-actions">
//                 <button
//                   type="button"
//                   className="btn btn-outline"
//                   onClick={() => setShowLoginModal(false)}
//                 >
//                   Cancel
//                 </button>

//                 <button type="submit" className="btn btn-primary">
//                   Continue
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


//============================

import React, { useState } from "react";
import bgImage from "./assets/mkisaan.jpg";
import logo from "./assets/mkisaan_logo.jpg";
import Signup from "./pages/Signup";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:4001";

function App(): JSX.Element {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobile, setMobile] = useState("");
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginOtp, setLoginOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<"home" | "signup">("home");

  // 1) Request OTP for login
  const requestLoginOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!mobile) return alert("Enter mobile number");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, purpose: "login" }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || "Failed to request OTP");
      setLoginOtpSent(true);
      // DEV helper: show the OTP
      if (data.otp) alert(`DEV OTP: ${data.otp}`);
    } catch (err) {
      console.error(err);
      alert("Request OTP failed");
    } finally {
      setLoading(false);
    }
  };

  // 2) Verify OTP for login
  const verifyLoginOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!loginOtp) return alert("Enter OTP");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp: loginOtp }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || "OTP verify failed");
      // store and close
      localStorage.setItem("mk_token", data.token);
      localStorage.setItem("mk_user", JSON.stringify(data.user));
      alert("Login success (dev)");
      setShowLoginModal(false);
      setMobile("");
      setLoginOtp("");
      setLoginOtpSent(false);
    } catch (err) {
      console.error(err);
      alert("Verify OTP failed");
    } finally {
      setLoading(false);
    }
  };

  if (page === "signup") return <Signup onBack={() => setPage("home")} />;

  return (
    <div className="app-background" style={{ backgroundImage: `url(${bgImage})` }}>
      {/* Header */}
      <header className="app-header">
        <div className="logo-section" role="img" aria-label="mkisaan logo">
          <img src={logo} alt="mkisaan logo" className="logo-img" />
          <span className="logo-text">mkisaan</span>
        </div>
      </header>

      {/* Hero Text & Buttons */}
      <section className="hero-text" aria-labelledby="hero-heading">
        <h1 id="hero-heading">
          Empowering farmers.
          <br />
          Connecting India’s markets.
        </h1>

        <div className="hero-buttons" role="group" aria-label="Primary actions">
          <button className="btn btn-ghost" type="button" onClick={() => setShowLoginModal(true)}>
            Log in
          </button>
          <button className="btn btn-ghost" type="button" onClick={() => setPage("signup")}>
            Sign up
          </button>
        </div>
      </section>

      {/* Login Modal */}
      {showLoginModal && (
        <div
          className="modal-overlay"
          onMouseDown={() => {
            setShowLoginModal(false);
            setLoginOtpSent(false);
            setMobile("");
            setLoginOtp("");
          }}
        >
          <div
            className="modal-card"
            onMouseDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h2>Log in</h2>

            {!loginOtpSent ? (
              <>
                <p className="muted">Enter your mobile number to receive OTP</p>
                <form onSubmit={requestLoginOtp} className="login-form">
                  <label className="input-label">
                    Mobile number
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]{10,15}"
                      placeholder="e.g. 9876543210"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required
                    />
                  </label>

                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => {
                        setShowLoginModal(false);
                        setMobile("");
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn" disabled={loading}>
                      {loading ? "Sending..." : "Continue"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <p className="muted">Enter the 4-digit OTP sent to {mobile}</p>
                <form onSubmit={verifyLoginOtp} className="login-form">
                  <label className="input-label">
                    OTP
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="\d{4}"
                      placeholder="1234"
                      value={loginOtp}
                      onChange={(e) => setLoginOtp(e.target.value)}
                      required
                    />
                  </label>

                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => {
                        setLoginOtpSent(false);
                        setLoginOtp("");
                      }}
                    >
                      Back
                    </button>
                    <button type="submit" className="btn" disabled={loading}>
                      {loading ? "Verifying..." : "Verify"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

