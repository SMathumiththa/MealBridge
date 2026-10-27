import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer({ theme }) {
  const isLight = theme === "light";
  const { t } = useTranslation();

  const COLORS = {
    forest: "#124b55",
    forestMid: "#0d6170",
    forestLight: "#167d78",
    sage: "#35a766",
    mint: "#79cf8a",
    amber: "#19a85a",
    amberLight: "#61c978",
    charcoal: "#073b65",
  };

  const linkStyle = {
    color: isLight ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.7)",
    textDecoration: "none",
    fontSize: "0.95rem",
    marginBottom: "0.5rem",
    display: "block",
    transition: "color 0.2s"
  };

  const handleMouseEnter = (e) => {
    e.target.style.color = isLight ? COLORS.amber : COLORS.amberLight;
  };

  const handleMouseLeave = (e) => {
    e.target.style.color = isLight ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.7)";
  };

  const socialIconStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: isLight ? "rgba(15,23,42,0.05)" : "rgba(255,255,255,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: isLight ? COLORS.charcoal : "#ffffff",
    textDecoration: "none",
    transition: "all 0.3s",
    fontSize: "1.2rem"
  };

  const handleSocialEnter = (e) => {
    e.currentTarget.style.background = COLORS.amber;
    e.currentTarget.style.color = "#ffffff";
    e.currentTarget.style.transform = "translateY(-3px)";
  };

  const handleSocialLeave = (e) => {
    e.currentTarget.style.background = isLight ? "rgba(15,23,42,0.05)" : "rgba(255,255,255,0.1)";
    e.currentTarget.style.color = isLight ? COLORS.charcoal : "#ffffff";
    e.currentTarget.style.transform = "translateY(0)";
  };

  return (
    <footer style={{
      width: "100%",
      marginTop: "5rem",
      background: isLight ? "rgba(7,59,101,0.08)" : "rgba(0,0,0,0.28)",
      backdropFilter: "blur(10px)",
      borderTop: isLight ? "1px solid rgba(15,23,42,0.05)" : "1px solid rgba(255,255,255,0.05)",
      padding: "4rem 2rem 2rem 2rem",
      position: "relative",
      zIndex: 10
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "3rem",
        marginBottom: "3rem"
      }}>
        
        {/* Column 1: Brand & Social */}
        <div>
          <div style={{
            fontSize: "1.8rem",
            fontWeight: 800,
            color: isLight ? COLORS.charcoal : "white",
            lineHeight: 1.1,
            letterSpacing: "-0.5px",
            marginBottom: "1rem",
            textShadow: isLight ? "none" : "0 2px 10px rgba(0,0,0,0.4)"
          }}>
            Meal<span style={{ color: isLight ? COLORS.amber : COLORS.amberLight }}>Bridge</span>
          </div>
          <p style={{
            color: isLight ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.6)",
            lineHeight: 1.6,
            fontSize: "0.95rem",
            marginBottom: "1.5rem"
          }}>
            {t("common.footerDescription")}
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <a href="#" style={socialIconStyle} onMouseEnter={handleSocialEnter} onMouseLeave={handleSocialLeave}>
              <i className="fab fa-facebook-f">f</i>
            </a>
            <a href="#" style={socialIconStyle} onMouseEnter={handleSocialEnter} onMouseLeave={handleSocialLeave}>
              <i className="fab fa-twitter">𝕏</i>
            </a>
            <a href="#" style={socialIconStyle} onMouseEnter={handleSocialEnter} onMouseLeave={handleSocialLeave}>
              <i className="fab fa-instagram">in</i>
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            marginBottom: "1.5rem",
            color: isLight ? COLORS.charcoal : "#ffffff"
          }}>{t("common.quickLinks")}</h4>
          <Link to="/" style={linkStyle}>{t("common.home")}</Link>
          <Link to="/donate-food" style={linkStyle}>{t("common.donateFood")}</Link>
          <Link to="/fund-campaigns" style={linkStyle}>{t("common.fundCampaigns")}</Link>
          <Link to="/impact" style={linkStyle}>{t("common.trackImpact")}</Link>
          <Link to="/login" style={linkStyle}>{t("common.login")}</Link>
          <Link to="/register" style={linkStyle}>{t("common.register")}</Link>
        </div>

        {/* Column 3: Legal */}
        <div>
          <h4 style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            marginBottom: "1.5rem",
            color: isLight ? COLORS.charcoal : "#ffffff"
          }}>{t("common.legal")}</h4>
          <Link to="/privacy" style={linkStyle}>{t("common.privacy")}</Link>
          <Link to="/terms" style={linkStyle}>{t("common.terms")}</Link>
          <Link to="/about" style={linkStyle}>{t("common.aboutUs")}</Link>
        </div>

        {/* Column 4: Contact */}
        <div>
          <h4 style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            marginBottom: "1.5rem",
            color: isLight ? COLORS.charcoal : "#ffffff"
          }}>{t("common.contactUs")}</h4>
          <p style={{
            color: isLight ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.7)",
            fontSize: "0.95rem",
            marginBottom: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <span>✉️</span> support@mealbridge.com
          </p>
          <p style={{
            color: isLight ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.7)",
            fontSize: "0.95rem",
            marginBottom: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <span>📞</span> +94 78456627
          </p>
        </div>
      </div>

      <div style={{
        textAlign: "center",
        paddingTop: "2rem",
        borderTop: isLight ? "1px solid rgba(15,23,42,0.1)" : "1px solid rgba(255,255,255,0.1)",
        color: isLight ? "rgba(15,23,42,0.5)" : "rgba(255,255,255,0.4)",
        fontSize: "0.9rem"
      }}>
        © {new Date().getFullYear()} MealBridge Platform. All rights reserved.
      </div>
    </footer>
  );
}
