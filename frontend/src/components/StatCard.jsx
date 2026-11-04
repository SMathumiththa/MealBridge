import { COLORS } from "../theme";
import DashboardIcon from "./DashboardIcon";

export default function StatCard({ icon, label, value, color = COLORS.amber, sub, align = "left" }) {
  return (
    <div
      className="dashboard-stat-card"
      style={{
        background: "linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.045))",
        border: "1px solid rgba(255,255,255,0.13)",
        borderRadius: 18,
        padding: "18px 20px",
        flex: 1,
        textAlign: align,
        minWidth: 150,
        boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{
        width: 42,
        height: 42,
        borderRadius: 12,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color,
        background: `${color}1f`,
        border: `1px solid ${color}40`,
        marginBottom: 12,
      }}>
        <DashboardIcon name={icon} size={21} color="currentColor" />
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}
