import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import FloatingFood from "../components/FloatingFood";
import { verifyEmailApi, resendVerificationCode } from "../api/auth";

export default function VerifyEmail({ theme = "dark" }) {
  const isLight = theme === "light";
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || "";

  const [email, setEmail] = useState(emailFromState);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Resend state
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendSuccessMsg, setResendSuccessMsg] = useState("");

  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResendSuccessMsg("");

    if (!email || !code) {
      setError("Please provide both email and verification code.");
      return;
    }

    try {
      setLoading(true);
      await verifyEmailApi({ email: email.trim(), code: code.trim() });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || resendLoading || !email) return;
    setError("");
    setResendSuccessMsg("");

    try {
      setResendLoading(true);
      const res = await resendVerificationCode({ email: email.trim() });
      setResendSuccessMsg(res.message || "Verification code sent! Please check your inbox.");
      setResendTimer(45); // 45 seconds countdown
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to resend code");
    } finally {
      setResendLoading(false);
    }
  };

  const pageBg = isLight
    ? "linear-gradient(135deg, #f4f8f7, #dcefeb, #79cf8a)"
    : "linear-gradient(135deg, #073b65, #124b55, #167d78)";
  const cardBg = isLight ? "rgba(255,255,255,0.95)" : "rgba(35, 53, 41, 0.4)";
  const cardBorder = isLight ? "1px solid rgba(15,23,42,0.12)" : "1px solid rgba(255,255,255,0.05)";
  const pageText = isLight ? "#0f172a" : "white";
  const inputBg = isLight ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.03)";
  const inputBorder = isLight ? "1px solid rgba(15,23,42,0.12)" : "1px solid rgba(255,255,255,0.1)";
  const inputColor = isLight ? "#0f172a" : "white";

  const inputStyle = {
    width: "100%",
    padding: "16px 16px 16px 48px",
    background: inputBg,
    border: inputBorder,
    borderRadius: "12px",
    color: inputColor,
    fontSize: "15px",
    outline: "none",
    transition: "border 0.2s, background 0.2s",
    boxSizing: "border-box"
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      padding: "20px 14px",
      background: pageBg,
      color: pageText,
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      position: "relative",
      overflow: "hidden"
    }}>
      <FloatingFood count={16} />

      <div className="auth-card" style={{
        background: cardBg,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: cardBorder,
        borderRadius: "24px",
        padding: "36px 28px",
        width: "100%",
        maxWidth: "460px",
        boxShadow: "0 24px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        boxSizing: "border-box",
        position: "relative",
        zIndex: 1
      }}>
        {!success ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "26px" }}>
              <p style={{ color: "#d68840", fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "6px" }}>
                ACCOUNT SECURITY
              </p>
              <h2 style={{ color: pageText, fontSize: "28px", fontWeight: "700", margin: 0 }}>
                Verify Email
              </h2>
              <p style={{ color: isLight ? "#475569" : "rgba(255,255,255,0.75)", fontSize: "14px", marginTop: "10px", lineHeight: 1.5 }}>
                We've sent a 6-digit verification code to your email. Check your spam folder if you don't see it immediately.
              </p>
            </div>

            {error && (
              <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "18px", background: "rgba(239, 68, 68, 0.12)", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(239, 68, 68, 0.25)" }}>
                {error}
              </p>
            )}

            {resendSuccessMsg && (
              <p style={{ color: "#22c55e", fontSize: "13px", marginBottom: "18px", background: "rgba(34, 197, 94, 0.12)", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(34, 197, 94, 0.25)" }}>
                {resendSuccessMsg}
              </p>
            )}

            <div style={{ marginBottom: "18px" }}>
              <label style={{ color: "#95a89b", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px", display: "block" }}>EMAIL</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>📧</span>
                <input 
                  type="email" 
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  readOnly={!!emailFromState}
                />
              </div>
            </div>

            <div style={{ marginBottom: "26px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{ color: "#95a89b", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", margin: 0 }}>VERIFICATION CODE</label>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendTimer > 0 || resendLoading || !email}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: resendTimer > 0 ? "rgba(255,255,255,0.4)" : "#e8923a",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: resendTimer > 0 ? "not-allowed" : "pointer",
                    padding: 0,
                    textDecoration: "underline"
                  }}
                >
                  {resendLoading ? "Sending..." : resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend code"}
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🔑</span>
                <input 
                  type="text" 
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  style={{ ...inputStyle, letterSpacing: "4px", fontSize: "18px", fontWeight: "700" }}
                  maxLength={6}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || !email || !code}
              style={{
                width: "100%",
                padding: "16px",
                background: "linear-gradient(90deg, #ed9647 0%, #d87e32 100%)",
                opacity: (!email || !code || loading) ? 0.6 : 1,
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: (!email || !code || loading) ? "not-allowed" : "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: (!email || !code) ? "none" : "0 8px 20px rgba(237, 150, 71, 0.25)",
                transition: "all 0.2s"
              }}
            >
              {loading ? "Verifying..." : "Verify My Email"}
            </button>

            <div style={{ textAlign: "center", marginTop: "22px" }}>
              <Link to="/login" style={{ color: "#e8923a", fontSize: "13px", textDecoration: "none", fontWeight: "600" }}>
                Back to Sign in
              </Link>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: "52px", marginBottom: "16px" }}>✅</div>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: pageText, marginBottom: "12px" }}>Email Verified!</h2>
            <p style={{ color: isLight ? "#475569" : "rgba(255,255,255,0.75)", fontSize: "15px", marginBottom: "28px", lineHeight: 1.5 }}>
              Your email has been successfully verified. You can now log in once an admin approves your account.
            </p>
            <button 
              onClick={() => navigate("/login")}
              style={{
                width: "100%",
                padding: "16px",
                background: "linear-gradient(90deg, #ed9647 0%, #d87e32 100%)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(237, 150, 71, 0.25)",
              }}
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
