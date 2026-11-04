import { useState } from "react";
import { useTranslation } from "react-i18next";
import { COLORS } from "../theme";

const ICON_PATHS = {
  home: "M3 10.5 12 3l9 7.5M5 9v11h14V9M9 20v-6h6v6",
  plus: "M12 5v14M5 12h14",
  box: "m4 7 8-4 8 4-8 4-8-4Zm0 0v10l8 4 8-4V7M12 11v10",
  money: "M3 7h18v10H3zM7 12h.01M17 12h.01M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0",
  chart: "M4 19V5M4 19h17M8 16v-4M12 16V8M16 16v-6",
  clipboard: "M8 4h8v3H8zM6 5H4v15h16V5h-2M8 11h8M8 15h6",
  star: "m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3Z",
  building: "M4 21V5l8-2 8 2v16M8 8h1M12 8h1M16 8h1M8 12h1M12 12h1M16 12h1M10 21v-4h4v4",
  search: "m20 20-4.4-4.4M10.5 17a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Z",
  check: "m5 12 4 4L19 6",
  eye: "M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  truck: "M3 6h11v10H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm11 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  users: "M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7-8a4 4 0 0 1 0 7.8M22 20v-2a4 4 0 0 0-3-3.9",
  scale: "M12 3v18M5 6h14M5 6l-3 6a3 3 0 0 0 6 0L5 6Zm14 0-3 6a3 3 0 0 0 6 0l-3-6ZM8 21h8",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",
  settings: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-2.6V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8.6 15a1.7 1.7 0 0 0-1.6-1H6v-2.6h1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1L10 6.6l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V5h2.6v.4a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1H22V14h-1a1.7 1.7 0 0 0-1.6 1Z",
  logout: "M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-6"
};

function NavIcon({ name, color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICON_PATHS[name] || ICON_PATHS.home} />
    </svg>
  );
}

export default function Sidebar({ role, activePage, onNav, onLogout, user, requestCount = 0, theme = "dark" }) {
  const [hov, setHov] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation();
  const isLight = theme === "light";

  const navItems = {
    donor: [
      { id: "donorHome", icon: "home", label: t('sidebar.dashboard') },
      { id: "donate", icon: "plus", label: t('sidebar.postDonation') },
      { id: "myDonations", icon: "box", label: t('sidebar.myDonations') },
      { id: "fundraisers", icon: "money", label: t('sidebar.fundraisers') },
      { id: "impact", icon: "chart", label: t('sidebar.myImpact') },
      { id: "requests", icon: "clipboard", label: t('sidebar.myRequests'), badge: requestCount },
      { id: "feedbacks", icon: "star", label: t('sidebar.feedbacks') },
      { id: "profile", icon: "building", label: t('sidebar.donorProfile') },
    ],
    ngo: [
      { id: "dashboard", icon: "home", label: t('sidebar.dashboard') },
      { id: "browse", icon: "search", label: t('sidebar.browseFood') },
      { id: "myRequests", icon: "clipboard", label: t('sidebar.myRequests'), badge: requestCount },
      { id: "pickups", icon: "check", label: t('sidebar.pickups') },
      { id: "fundRequests", icon: "money", label: t('sidebar.fundRequests') },
      { id: "feedbacks", icon: "star", label: t('sidebar.feedbacks') },
      { id: "profile", icon: "building", label: t('sidebar.ngoProfile') },
    ],
    volunteer: [
      { id: "volunteerHome", icon: "home", label: t('sidebar.dashboard') },
      { id: "availablePickups", icon: "eye", label: t('volunteer.availablePickups') },
      { id: "myDeliveries", icon: "truck", label: t('volunteer.myDeliveries') },
      { id: "leaderboard", icon: "chart", label: "Volunteer Leaderboard" },
      { id: "feedbacks", icon: "star", label: t('sidebar.feedbacks') },
      { id: "profile", icon: "building", label: t('sidebar.volunteerProfile') },
    ],
    admin: [
      { id: "adminHome", icon: "home", label: t('sidebar.overview') },
      { id: "users", icon: "users", label: t('sidebar.users') },
      { id: "donations", icon: "box", label: t('sidebar.allDonations') },
      { id: "requests", icon: "clipboard", label: t('sidebar.foodApproval') },
      { id: "fundApprovals", icon: "scale", label: t('sidebar.fundApprovals') },
      { id: "feedbacks", icon: "star", label: t('sidebar.feedbacks') },
      { id: "notifications", icon: "bell", label: t('sidebar.notifications') },
      { id: "analytics", icon: "chart", label: t('sidebar.analytics') },
      { id: "settings", icon: "settings", label: t('sidebar.settings') },
    ],
  };

  const items = navItems[role] || navItems.donor;
  const roleLabel = t(`common.${role}`, { defaultValue: role });

  const roleColors = { donor: COLORS.amber, ngo: COLORS.mint, admin: "#7b68ee" };
  
  const activeColor = role === "ngo" ? COLORS.mint : roleColors[role] || COLORS.amber;
  const activeBg = role === "ngo" ? "rgba(126, 200, 160, 0.18)" : "rgba(232,146,58,0.18)";
  const activeBorder = role === "ngo" ? "rgba(126, 200, 160, 0.3)" : "rgba(232,146,58,0.3)";
  const handleNav = (id) => {
    onNav(id);
    setMobileOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="mobile-menu-toggle"
        aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen(open => !open)}
      >
        <span aria-hidden="true">{mobileOpen ? "×" : "☰"}</span>
        <span>Menu</span>
      </button>
      {mobileOpen && <button type="button" className="mobile-menu-backdrop" aria-label="Close navigation menu" onClick={() => setMobileOpen(false)} />}
      <div
        className={`dashboard-sidebar${mobileOpen ? " mobile-sidebar-open" : ""}`}
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

      <div className="dashboard-sidebar-nav" style={{ padding: "22px 14px 0", flex: 1 }}>
        {items.map((item) => {
          const active = activePage === item.id;
          return (
            <div
              key={item.id}
              onClick={() => handleNav(item.id)}
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
              <span style={{ display: "flex", color: active ? activeColor : isLight ? "rgba(31,41,55,0.65)" : "rgba(255,255,255,0.58)" }}>
                <NavIcon name={item.icon} color="currentColor" />
              </span>
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
            {user?.name ? user.name.substring(0, 2).toUpperCase() : (role === "admin" ? "A" : role === "donor" ? "D" : "N")}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: isLight ? "#0f172a" : "white", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
              {user?.name || "User"}
            </div>
          </div>
        </div>

<div
          onClick={() => {
            setMobileOpen(false);
            onLogout();
          }}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, cursor: "pointer", color: isLight ? "#b91c1c" : "rgba(255,100,100,0.7)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,100,100,0.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <span style={{ display: "flex" }}><NavIcon name="logout" color="currentColor" /></span>
          <span style={{ fontSize: 14 }}>{t('sidebar.logout')}</span>
        </div>
      </div>
      </div>
    </>
  );
}
