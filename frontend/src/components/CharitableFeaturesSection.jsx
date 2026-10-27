import { useState } from "react";
import { Link } from "react-router-dom";

export function RibbonHeartDoodle({ style = {} }) {
  return (
    <svg
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 92, height: 112, pointerEvents: "none", ...style }}
      aria-hidden="true"
    >
      <path
        d="M32 96 C16 78, 10 52, 22 30 C34 10, 56 16, 68 34 C80 16, 102 10, 114 30 C124 56, 92 84, 60 110 C44 122, 36 130, 28 136"
        stroke="#0c3e35"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 76 C40 84, 62 66, 72 44"
        stroke="#0c3e35"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HandHeartDoodle({ style = {} }) {
  return (
    <svg
      viewBox="0 0 130 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 115, height: 115, pointerEvents: "none", ...style }}
      aria-hidden="true"
    >
      <path
        d="M80 35 C73 24, 55 24, 50 35 C45 24, 27 24, 20 35 C10 49, 28 68, 50 85 C72 68, 90 49, 80 35 Z"
        stroke="#e5a824"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M40 88 C56 96, 80 96, 102 83 C112 76, 120 66, 116 54 C111 46, 101 48, 92 56"
        stroke="#e5a824"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M60 102 C75 110, 96 108, 112 95"
        stroke="#e5a824"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BrushSplash({ color = "#0c3e35" }) {
  return (
    <svg
      viewBox="0 0 280 115"
      preserveAspectRatio="none"
      style={{ width: "100%", height: "105px", display: "block" }}
      aria-hidden="true"
    >
      <path
        d="M0,0 L280,0 L280,50 
           C272,66 264,54 254,72 
           C244,82 236,64 226,80 
           C214,92 204,70 192,85 
           C180,95 170,72 156,88 
           C142,98 130,76 116,91 
           C102,100 90,75 76,87 
           C62,95 50,71 36,83 
           C24,91 14,69 0,80 Z"
        fill={color}
      />
      {/* Scattered paint splatter dots */}
      <circle cx="28" cy="95" r="2.8" fill={color} opacity="0.85" />
      <circle cx="42" cy="106" r="1.8" fill={color} opacity="0.65" />
      <circle cx="94" cy="102" r="2.4" fill={color} opacity="0.75" />
      <circle cx="168" cy="100" r="3" fill={color} opacity="0.8" />
      <circle cx="220" cy="94" r="2" fill={color} opacity="0.7" />
      <circle cx="248" cy="101" r="1.8" fill={color} opacity="0.6" />
      <circle cx="262" cy="86" r="2.6" fill={color} opacity="0.7" />
    </svg>
  );
}

const defaultCards = [
  {
    id: "education",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d49b1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" fill="#d49b1a" fillOpacity="0.18" />
        <circle cx="12" cy="4" r="1.5" fill="#d49b1a" />
        <circle cx="5" cy="4" r="1.5" fill="#d49b1a" />
        <circle cx="19" cy="4" r="1.5" fill="#d49b1a" />
      </svg>
    ),
    title: "Education",
    text: "Helping children receive the quality education boost.",
    link: "/about",
    linkText: "READ MORE →",
  },
  {
    id: "healthcare",
    featured: true,
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0c3e35" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="#0c3e35" fillOpacity="0.15" />
        <path d="M12 7v6M9 10h6" strokeWidth="2.5" />
      </svg>
    ),
    title: "Health Care",
    text: "Health care are medical for vital child's growth.",
    link: "/register",
    linkText: "READ MORE →",
  },
  {
    id: "cleanwater",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=600&q=80",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d49b1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="#d49b1a" fillOpacity="0.18" />
        <path d="M8 14a4 4 0 0 0 4 4" />
      </svg>
    ),
    title: "Clean Water",
    text: "Ensuring access to safe clean drinking water through.",
    link: "/donors",
    linkText: "READ MORE →",
  },
  {
    id: "nutrition",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d49b1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" fill="#d49b1a" fillOpacity="0.18" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    ),
    title: "Nutrition",
    text: "Delivering food packages nutrition support families.",
    link: "/ngos",
    linkText: "READ MORE →",
  },
];

export default function CharitableFeaturesSection({
  kicker = "Our Best Features",
  title = "We're Charitable Group That Improves Lives",
  cards = defaultCards,
  bannerText = "Helping Temporary Homes And Emergency Saving",
  bannerButtonText = "EXPERT MORE",
  bannerLink = "/register",
  showBanner = true,
  className = "",
}) {
  const [activeCardId, setActiveCardId] = useState(() => {
    const feat = cards.find((c) => c.featured);
    return feat ? feat.id : cards[1]?.id || cards[0]?.id;
  });

  return (
    <section className={`charitable-section ${className}`}>
      {/* Decorative Hand-drawn Doodles from Reference Image */}
      <RibbonHeartDoodle style={{ position: "absolute", left: "2.5%", top: "40px" }} />
      <HandHeartDoodle style={{ position: "absolute", right: "2.5%", bottom: "30px" }} />

      <div className="charitable-container">
        {/* Header Block */}
        <div className="charitable-header">
          {kicker && <p className="charitable-kicker">{kicker}</p>}
          <h2 className="charitable-title">{title}</h2>
          <div className="charitable-divider">
            <span className="charitable-divider-line"></span>
            <span className="charitable-divider-icon">❦</span>
            <span className="charitable-divider-line"></span>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="charitable-grid">
          {cards.map((card) => {
            const isFeatured = card.id === activeCardId;

            const cardStyle = isFeatured && card.image
              ? {
                  backgroundImage: `linear-gradient(180deg, rgba(12, 59, 49, 0.86) 0%, rgba(12, 59, 49, 0.95) 100%), url(${card.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {};

            return (
              <div
                key={card.id}
                className={`charitable-card ${isFeatured ? "charitable-card-featured" : ""}`}
                style={cardStyle}
                onMouseEnter={() => setActiveCardId(card.id)}
              >
                {/* Top Splash Graphic */}
                <div className="charitable-splash-wrap">
                  <BrushSplash color={isFeatured ? "#f3c64f" : "#0c3e35"} />
                  <div className="charitable-badge">
                    {card.icon}
                  </div>
                </div>

                {/* Card Content */}
                <div className="charitable-card-body">
                  <h3 className="charitable-card-title">{card.title}</h3>
                  <p className="charitable-card-desc">{card.text}</p>
                  <Link to={card.link || "/register"} className="charitable-card-link">
                    {card.linkText || "READ MORE →"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Capsule Banner */}
        {showBanner && (
          <div className="charitable-banner">
            <div className="charitable-banner-left">
              <span className="charitable-banner-star">★</span>
              <span className="charitable-banner-text">{bannerText}</span>
            </div>
            <Link to={bannerLink} className="charitable-banner-btn">
              {bannerButtonText}
              <span className="charitable-banner-arrow">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
