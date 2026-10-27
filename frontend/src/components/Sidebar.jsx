import { useState } from "react";
import { useTranslation } from "react-i18next";
import { COLORS } from "../theme";

export default function Sidebar({ role, activePage, onNav, onLogout, user, requestCount = 0, theme = "dark" }) {
  const [hov, setHov] = useState(null);
  const { t } = useTranslation();
  const isLight = theme === "light";

  const navItems = {
    donor: [
      { id: "donorHome", icon: "🏠", label: t('sidebar.dashboard') },
      { id: "donate", icon: "➕", label: t('sidebar.postDonation') },
      { id: "myDonations", icon: "📦", label: t('sidebar.myDonations') },
      { id: "fundraisers", icon: "💰", label: t('sidebar.fundraisers') },
      { id: "impact", icon: "📊", label: t('sidebar.myImpact') },
      { id: "requests", icon: "📋", label: t('sidebar.myRequests'), badge: requestCount },
      { id: "feedbacks", icon: "⭐", label: t('sidebar.feedbacks') },
      { id: "profile", icon: "🏢", label: t('sidebar.donorProfile') },
    ],
    ngo: [
      { id: "dashboard", icon: "🏠", label: t('sidebar.dashboard') },
      { id: "browse", icon: "🔍", label: t('sidebar.browseFood') },
      { id: "myRequests", icon: "📋", label: t('sidebar.myRequests'), badge: requestCount },
      { id: "pickups", icon: "✅", label: t('sidebar.pickups') },
      { id: "fundRequests", icon: "💸", label: t('sidebar.fundRequests') },
      { id: "feedbacks", icon: "⭐", label: t('sidebar.feedbacks') },
      { id: "profile", icon: "🏢", label: t('sidebar.ngoProfile') },
    ],
    volunteer: [
      { id: "volunteerHome", icon: "🏠", label: t('sidebar.dashboard') },
      { id: "availablePickups", icon: "👀", label: t('volunteer.availablePickups') },
      { id: "myDeliveries", icon: "🚚", label: t('volunteer.myDeliveries') },
      { id: "leaderboard", icon: "🏆", label: "Volunteer Leaderboard" },
      { id: "feedbacks", icon: "⭐", label: t('sidebar.feedbacks') },
      { id: "profile", icon: "🏢", label: t('sidebar.volunteerProfile') },
    ],
    admin: [
      { id: "adminHome", icon: "🏠", label: t('sidebar.overview') },
      { id: "users", icon: "👥", label: t('sidebar.users') },
      { id: "donations", icon: "📦", label: t('sidebar.allDonations') },
      { id: "requests", icon: "📋", label: t('sidebar.foodApproval') },
      { id: "fundApprovals", icon: "⚖️", label: t('sidebar.fundApprovals') },
      { id: "feedbacks", icon: "⭐", label: t('sidebar.feedbacks') },
      { id: "notifications", icon: "🔔", label: t('sidebar.notifications') },
      { id: "analytics", icon: "📊", label: t('sidebar.analytics') },
      { id: "settings", icon: "⚙️", label: t('sidebar.settings') },
    ],
  };

  const items = navItems[role] || navItems.donor;
  const roleLabel = t(`common.${role}`, { defaultValue: role });

  const roleColors = { donor: COLORS.amber, ngo: COLORS.mint, admin: "#7b68ee" };
  
  const activeColor = role === "ngo" ? COLORS.mint : roleColors[role] || COLORS.amber;
  const activeBg = role === "ngo" ? "rgba(126, 200, 160, 0.18)" : "rgba(232,146,58,0.18)";
  const activeBorder = role === "ngo" ? "rgba(126, 200, 160, 0.3)" : "rgba(232,146,58,0.3)";

  return (
    <div
      style={{
        width: 240,
        minHeight: "100vh",
        background: isLight ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.32)",
        borderRight: isLight ? "1px solid rgba(148,163,184,0.25)" : "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        flexDirection: "column",
        padding: "24px 0",
        flexShrink: 0,
      }}
    >
      <div style={{ padding: "0 18px 22px", borderBottom: isLight ? "1px solid rgba(148,163,184,0.18)" : "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.04em", color: isLight ? "#17231b" : "#fff" }}>
          Meal<span style={{ color: COLORS.amber }}>Bridge</span>
        </div>
        <div style={{ marginTop: 5, fontSize: 11, color: isLight ? "rgba(31,41,55,0.55)" : "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
          {roleLabel} {t("common.workspace")}
        </div>
      </div>

      <div style={{ padding: "22px 14px 0", flex: 1 }}>
        {items.map((item) => {
          const active = activePage === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onNav(item.id)}
              onMouseEnter={() => setHov(item.id)}
              onMouseLeave={() => setHov(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                padding: "11px 14px",
                borderRadius: 11,
                cursor: "pointer",
                marginBottom: 4,
                background: active
                  ? isLight
                    ? "rgba(251,191,36,0.18)"
                    : activeBg
                  : hov === item.id
                    ? isLight
                      ? "rgba(148,163,184,0.18)"
                      : "rgba(255,255,255,0.06)"
                    : "transparent",
                border: active
                  ? `1px solid ${isLight ? "rgba(245,158,11,0.35)" : activeBorder}`
                  : "1px solid transparent",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 17 }}>{item.icon}</span>
              <span style={{ fontSize: 14, fontWeight: active ? 600 : 400, color: active ? activeColor : isLight ? "rgba(31,41,55,0.82)" : "rgba(255,255,255,0.68)", flex: 1 }}>
                {item.label}
              </span>
              {item.badge > 0 && (
                <span style={{ background: "#e74c3c", color: "white", fontSize: 11, fontWeight: 700, minWidth: 20, height: 20, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6px" }}>
                  {item.badge}
                </span>
              )}
              {active && <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: 3, background: activeColor }} />}
            </div>
          );
        })}
      </div>

      <div style={{ padding: "20px 14px 0", borderTop: isLight ? "1px solid rgba(148,163,184,0.25)" : "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", marginBottom: 8 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: role === "ngo" || role === "volunteer" ? "linear-gradient(135deg, #7ec8a0, #4a8c6a)" : `linear-gradient(135deg, ${COLORS.amber}, ${COLORS.amberLight})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
              color: role === "ngo" || role === "volunteer" ? "#1a3a2a" : "white",
              overflow: "hidden"
            }}
          >
            {user?.profileImage ? (
              <img src={user.profileImage} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              user?.name ? user.name.substring(0, 2).toUpperCase() : (role === "admin" ? "A" : role === "donor" ? "D" : "N")
            )}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: isLight ? "#0f172a" : "white", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
              {user?.name || "User"}
            </div>
          </div>
        </div>

<div
          onClick={onLogout}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, cursor: "pointer", color: isLight ? "#b91c1c" : "rgba(255,100,100,0.7)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,100,100,0.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <span style={{ fontSize: 16 }}>🚪</span>
          <span style={{ fontSize: 14 }}>{t('sidebar.logout')}</span>
        </div>
      </div>
    </div>
  );
}
