import { useEffect } from "react";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ role, activePage, onNav, onLogout, user, notifCount = 0, requestCount = 0, theme = "dark", children }) {
  useEffect(() => {
    document.body.classList.add("dashboard-route");
    return () => document.body.classList.remove("dashboard-route");
  }, []);

  return (
    <div className="dashboard-layout" style={{ display: "flex", minHeight: "100vh", position: "relative", background: "transparent" }}>
      {/* Sidebar is fixed on the left */}
      <Sidebar 
        role={role} 
        activePage={activePage} 
        onNav={onNav} 
        onLogout={onLogout} 
        user={user} 
        notifCount={notifCount} 
        requestCount={requestCount} 
        theme={theme}
      />
      
      {/* Main Content wrapper - centered with flex */}
      <main className="dashboard-main" style={{
        flex: 1, 
        display: "flex", 
        justifyContent: "center", // This centers the inner content horizontally!
        padding: "36px 40px",
        background: "transparent",
      }}>
        {/* Inner container constraints the width */}
        <div className="dashboard-content" style={{ width: "100%", maxWidth: 900 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
