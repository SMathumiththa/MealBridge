export default function Logo({ size = "default" }) {
  const isSmall = size === "sm";
  const textSize = isSmall ? "18px" : "24px";

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span style={{  fontSize: textSize, fontWeight: "bold" }}>
        <span style={{ color: "#FFFFFF" }}>Meal</span>
        <span style={{ color: "#D4A843" }}>Bridge</span>
      </span>
    </div>
  );
}
