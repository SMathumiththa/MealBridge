import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {  BrowserRouter, Routes, Route, Navigate , useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Import real pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import DonorDashboard from "./pages/DonorDashboard";
import NgoDashboard from "./pages/NgoDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import MockCheckout from "./pages/MockCheckout";
import Welcome from "./pages/Welcome";
import FoodDonationInfo from "./pages/FoodDonationInfo";
import FundCampaignInfo from "./pages/FundCampaignInfo";
import ImpactInfo from "./pages/ImpactInfo";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import PublicInfo from "./pages/PublicInfo";

// Import ProtectedRoute
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

const COLORS = {
  forest: "#124b55",
  forestMid: "#0d6170",
  forestLight: "#167d78",
  sage: "#35a766",
  mint: "#79cf8a",
  cream: "#f4f8f7",
  warmWhite: "#ffffff",
  amber: "#19a85a",
  amberLight: "#61c978",
  gold: "#f3c64f",
  charcoal: "#073b65",
  textMuted: "#78909c",
  cardBg: "rgba(255,255,255,0.1)",
  glassBg: "rgba(255,255,255,0.08)",
  glassBorder: "rgba(255,255,255,0.2)",
};

const foodItems = ["🍱","🥘","🍲","🥗","🍞","🥦","🍅","🥕","🍎","🥚","🧆","🫕"];

export function FloatingFood({ count = 12 }) {
  const items = useMemo(() => 
    Array.from({ length: count }, (_, i) => {
      /* eslint-disable react-hooks/purity */
      return {
        emoji: foodItems[i % foodItems.length],
        x: Math.random() * 90 + 5,
        y: Math.random() * 90 + 5,
        size: Math.random() * 18 + 14,
        dur: Math.random() * 8 + 10,
        delay: Math.random() * 6,
        drift: Math.random() * 40 - 20,
      };
      /* eslint-enable react-hooks/purity */
    }),
    [count]
  );

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: item.size,
            opacity: 0.12,
            animation: `floatFood${i % 3} ${item.dur}s ${item.delay}s infinite ease-in-out`,
            filter: "saturate(0.4)",
          }}
        >
          {item.emoji}
        </div>
      ))}
      <style>{`
        @keyframes floatFood0 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(8deg)} }
        @keyframes floatFood1 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-28px) rotate(-6deg)} }
        @keyframes floatFood2 { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-15px) rotate(10deg)} 66%{transform:translateY(-25px) rotate(-4deg)} }
      `}</style>
    </div>
  );
}

export function FixedBrandLogo({ theme }) {
  const isLight = theme === "light";
  const location = useLocation();
  const authRoutes = ["/login", "/register", "/verify-email", "/forgot-password"];
  if (!authRoutes.includes(location.pathname)) return null;

  return (
    <div className="fixed-brand" style={{
      position: "fixed",
      top: 24,
      left: 28,
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      gap: 12,
      pointerEvents: "none"
    }}>
      <div className="brand-text" style={{
        fontSize: 26,
        fontWeight: 800,
        color: isLight ? "#0f172a" : "white",
        lineHeight: 1.1,
        letterSpacing: "-0.5px",
        textShadow: isLight ? "none" : "0 2px 10px rgba(0,0,0,0.4)"
      }}>
        Meal<span style={{ color: isLight ? COLORS.amber : COLORS.amberLight }}>Bridge</span>
      </div>
    </div>
  );
}

export default function App() {
  const isAdminMode = import.meta.env.MODE === "admin";
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const langs = ["en", "ta", "si"];
    const currentIdx = langs.indexOf(i18n.language) !== -1 ? langs.indexOf(i18n.language) : 0;
    const nextLang = langs[(currentIdx + 1) % langs.length];
    i18n.changeLanguage(nextLang);
    localStorage.setItem("language", nextLang);
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.classList.toggle("light-theme", theme === "light");
  }, [theme]);

  const darkBg = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0b131a 0%, #0d1f2d 50%, #0a1924 100%)",
    color: "white",
    width: "100%",
    overflowX: "hidden",
  };

  const lightBg = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f4f8f7, #dcefeb, #79cf8a)",
    backgroundSize: "400% 400%",
    animation: "gradientFlow 10s ease infinite",
    color: "#073b65",
    width: "100%",
    overflowX: "hidden",
  };

  const isLight = theme === "light";
  const bgStyle = theme === "light" ? lightBg : darkBg;

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div style={bgStyle}>
        <button
          onClick={toggleLanguage}
          className="dashboard-language-control"
          style={{
            position: "fixed",
            top: 24,
            right: 150,
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 700,
            zIndex: 9999,
            border: isLight ? "1px solid rgba(15,23,42,0.12)" : "1px solid rgba(255,255,255,0.15)",
            borderRadius: "50%",
            background: isLight ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0.06)",
            color: isLight ? "#0f172a" : "#ffffff",
            cursor: "pointer",
            backdropFilter: "blur(10px)",
            boxShadow: isLight ? "0 4px 12px rgba(15,23,42,0.06)" : "0 4px 12px rgba(0,0,0,0.2)",
            transition: "all 0.2s",
            textTransform: "uppercase"
          }}
          onMouseEnter={e => e.currentTarget.style.background = isLight ? "rgba(15,23,42,0.12)" : "rgba(255,255,255,0.1)"}
          onMouseLeave={e => e.currentTarget.style.background = isLight ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0.06)"}
          title="Change language"
        >
          {i18n.language.substring(0, 2)}
        </button>
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          style={{
            position: "fixed",
            top: 24,
            right: 90,
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            zIndex: 9999,
            border: isLight ? "1px solid rgba(15,23,42,0.12)" : "1px solid rgba(255,255,255,0.15)",
            borderRadius: "50%",
            background: isLight ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0.06)",
            color: isLight ? "#0f172a" : "#ffffff",
            cursor: "pointer",
            backdropFilter: "blur(10px)",
            boxShadow: isLight ? "0 4px 12px rgba(15,23,42,0.06)" : "0 4px 12px rgba(0,0,0,0.2)",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = isLight ? "rgba(15,23,42,0.12)" : "rgba(255,255,255,0.1)"}
          onMouseLeave={e => e.currentTarget.style.background = isLight ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0.06)"}
          title="Toggle theme"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <style>{`
          html, body, #root { width: 100%; height: 100%; margin: 0; padding: 0; background: ${theme === "light" ? "#f4f8f7" : "#124b55"}; color: ${theme === "light" ? "#073b65" : "#ffffff"}; max-width: none; }
          @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes bounceIn { 0% { transform: scale(0); } 60% { transform: scale(1.2); } 100% { transform: scale(1); } }
          @keyframes gradientFlow { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }
          @keyframes glassReflect { 0% { left: -100%; } 20% { left: 200%; } 100% { left: 200%; } }
          * { box-sizing: border-box; }
          input::placeholder, textarea::placeholder { color: ${theme === "light" ? "rgba(15,23,42,0.45)" : "rgba(255,255,255,0.35)"} !important; }
          select option { background: ${theme === "light" ? "#ffffff" : "#124b55"} !important; color: ${theme === "light" ? "#073b65" : "#ffffff"} !important; }
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: ${theme === "light" ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0.05)"}; }
          ::-webkit-scrollbar-thumb { background: ${theme === "light" ? "rgba(15,23,42,0.18)" : "rgba(255,255,255,0.2)"}; border-radius: 3px; }
          @media (max-width: 768px) {
            .fixed-brand { top: 16px !important; left: 16px !important; gap: 8px !important; }
            .brand-logo-img { height: 32px !important; }
            .brand-text { font-size: 20px !important; }
          }
          .light-theme [style*="color: white"],
          .light-theme [style*='color: "white"'],
          .light-theme [style*="color: 'white'"] { color: #0f172a !important; }
          .light-theme [style*="color: rgba(255, 255, 255, 0."],
          .light-theme [style*="color: rgba(255,255,255,0."] { color: rgba(15,23,42,0.65) !important; }
          .light-theme [style*="background: rgba(255, 255, 255, 0."],
          .light-theme [style*="background: rgba(255,255,255,0."] { background: rgba(15,23,42,0.06) !important; }
          .light-theme [style*="border: 1px solid rgba(255, 255, 255, 0."],
          .light-theme [style*="border: 1px solid rgba(255,255,255,0."] { border-color: rgba(15,23,42,0.15) !important; }
          .light-theme [style*="border-left: 1px solid rgba(255, 255, 255, 0."],
          .light-theme [style*="border-left: 1px solid rgba(255,255,255,0."] { border-left-color: rgba(15,23,42,0.15) !important; }
          .light-theme [style*="border-right: 1px solid rgba(255, 255, 255, 0."],
          .light-theme [style*="border-right: 1px solid rgba(255,255,255,0."] { border-right-color: rgba(15,23,42,0.15) !important; }
          .light-theme [style*="border-bottom: 1px solid rgba(255, 255, 255, 0."],
          .light-theme [style*="border-bottom: 1px solid rgba(255,255,255,0."] { border-bottom-color: rgba(15,23,42,0.15) !important; }
        `}</style>

        <FloatingFood count={16} />
        <FixedBrandLogo theme={theme} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <Routes>
          <Route path="/login" element={<Login theme={theme} />} />
          <Route path="/register" element={<Register theme={theme} />} />
          <Route path="/verify-email" element={<VerifyEmail theme={theme} />} />
          <Route path="/forgot-password" element={<ForgotPassword theme={theme} />} />
          
          <Route path="/donor" element={
            <ProtectedRoute allowedRoles={["donor"]}>
              <DonorDashboard theme={theme} />
            </ProtectedRoute>
          } />
          <Route path="/ngo" element={
            <ProtectedRoute allowedRoles={["ngo"]}>
              <NgoDashboard theme={theme} />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard theme={theme} />
            </ProtectedRoute>
          } />
          <Route path="/volunteer" element={
            <ProtectedRoute allowedRoles={["volunteer"]}>
              <VolunteerDashboard theme={theme} />
            </ProtectedRoute>
          } />
          
          <Route path="/mock-checkout" element={
            <ProtectedRoute allowedRoles={["donor", "admin"]}>
              <MockCheckout theme={theme} />
            </ProtectedRoute>
          } />
          <Route path="/donate-food" element={<FoodDonationInfo theme={theme} />} />
          <Route path="/fund-campaigns" element={<FundCampaignInfo theme={theme} />} />
          <Route path="/impact" element={<ImpactInfo theme={theme} />} />
          <Route path="/donors" element={<PublicInfo type="donors" theme={theme} />} />
          <Route path="/ngos" element={<PublicInfo type="ngos" theme={theme} />} />
          <Route path="/volunteers" element={<PublicInfo type="volunteers" theme={theme} />} />
          <Route path="/contact" element={<PublicInfo type="contact" theme={theme} />} />
          
          <Route path="/privacy" element={<PrivacyPolicy theme={theme} />} />
          <Route path="/terms" element={<TermsOfService theme={theme} />} />
          <Route path="/about" element={<PublicInfo type="about" theme={theme} />} />
            
          <Route path="/" element={isAdminMode ? <Navigate to="/login" replace /> : <Welcome theme={theme} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <Toaster position="top-right" containerStyle={{ zIndex: 999999 }} />
        </div>
      </div>
    </BrowserRouter>
  );
}
