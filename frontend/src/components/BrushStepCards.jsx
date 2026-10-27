import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * BrushSplash SVG
 * Colored with the site's palette:
 * - Active: #19a85a (Emerald Accent Green)
 * - Inactive: #124b55 (Deep Forest Teal Primary)
 */
export function BrushSplash({ color = "#124b55" }) {
  return (
    <svg
      viewBox="0 0 280 115"
      preserveAspectRatio="none"
      style={{ width: "100%", height: "96px", display: "block" }}
      aria-hidden="true"
    >
      <path
        d="M0,0 L280,0 L280,48 
           C272,64 264,52 254,70 
           C244,80 236,62 226,78 
           C214,90 204,68 192,83 
           C180,93 170,70 156,86 
           C142,96 130,74 116,89 
           C102,98 90,73 76,85 
           C62,93 50,69 36,81 
           C24,89 14,67 0,78 Z"
        fill={color}
      />
      {/* Scattered brush paint splatter dots */}
      <circle cx="28" cy="93" r="2.8" fill={color} opacity="0.85" />
      <circle cx="42" cy="104" r="1.8" fill={color} opacity="0.65" />
      <circle cx="94" cy="100" r="2.4" fill={color} opacity="0.75" />
      <circle cx="168" cy="98" r="3" fill={color} opacity="0.8" />
      <circle cx="220" cy="92" r="2" fill={color} opacity="0.7" />
      <circle cx="248" cy="99" r="1.8" fill={color} opacity="0.6" />
      <circle cx="262" cy="84" r="2.6" fill={color} opacity="0.7" />
    </svg>
  );
}

export default function BrushStepCards({
  items = [],
  defaultActive = "02",
  className = "",
  layout = "grid", // "grid" or "stack"
}) {
  const [activeNumber, setActiveNumber] = useState(() => {
    return defaultActive || items[1]?.number || items[0]?.number;
  });

  if (!items || items.length === 0) return null;

  return (
    <div className={`brush-steps-grid ${layout === "stack" ? "brush-steps-stack" : ""} ${className}`}>
      {items.map((item, idx) => {
        const itemNumber = item.number || String(idx + 1).padStart(2, "0");
        const isActive = activeNumber === itemNumber;

        const cardStyle = isActive && item.image
          ? {
              backgroundImage: `linear-gradient(180deg, rgba(18, 75, 85, 0.88) 0%, rgba(7, 59, 101, 0.95) 100%), url(${item.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {};

        return (
          <article
            key={itemNumber}
            className={`brush-step-card ${isActive ? "brush-step-card-active" : ""}`}
            style={cardStyle}
            onMouseEnter={() => setActiveNumber(itemNumber)}
          >
            {/* Top Brush Splash */}
            <div className="brush-step-splash">
              <BrushSplash color={isActive ? "#19a85a" : "#124b55"} />
              <div className="brush-step-badge">
                <span className="brush-step-number">{itemNumber}</span>
              </div>
            </div>

            {/* Card Body */}
            <div className="brush-step-body">
              <h3 className="brush-step-title">{item.title}</h3>
              <p className="brush-step-text">{item.text}</p>
              
              <div className="brush-step-footer">
                {item.link ? (
                  <Link to={item.link} className="brush-step-link">
                    {item.linkText || "LEARN MORE"}
                    <span className="brush-step-arrow">↗</span>
                  </Link>
                ) : (
                  <span className="brush-step-arrow-only">↗</span>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
