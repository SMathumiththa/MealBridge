export default function VisaCardPreview({
  flipped = false,
  cardNumber = "••••  ••••  ••••  ••••",
  expiry = "04/24",
  animated = false
}) {
  return (
    <div style={{
      perspective: 1000,
      width: "100%",
      maxWidth: 280,
      height: 175,
      margin: "0 auto 20px"
    }}>
      <style>{`
        @keyframes visaCardFloat {
          0%, 100% { transform: translateY(0) rotateX(0deg); }
          50% { transform: translateY(-5px) rotateX(2deg); }
        }
      `}</style>
      <div style={{
        position: "relative",
        width: "100%",
        height: "100%",
        transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        transformStyle: "preserve-3d",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        animation: animated ? "visaCardFloat 4s ease-in-out infinite" : "none"
      }}>
        {/* FRONT */}
        <div style={{
          position: "absolute",
          inset: 0,
          backfaceVisibility: "hidden",
          borderRadius: 14,
          padding: "16px 18px",
          background: "linear-gradient(145deg, #1f2025 0%, #121316 60%, #1a1b20 100%)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 14px 28px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.15)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxSizing: "border-box",
          overflow: "hidden"
        }}>
          {/* Subtle light sheen / radial highlight */}
          <div style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
            pointerEvents: "none"
          }} />

          {/* Top Row: Gold EMV Chip (left) & Contactless Wave (right) - NO card name */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
            {/* Gold EMV Chip */}
            <div style={{
              width: 38,
              height: 28,
              borderRadius: 5,
              background: "linear-gradient(135deg, #eed28b 0%, #caa13f 50%, #e5c678 100%)",
              border: "1px solid #8e6c1a",
              boxShadow: "inset 0 1px 2px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.5)",
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{ position: "absolute", top: "33%", left: 0, right: 0, height: 1, background: "rgba(115, 75, 10, 0.55)" }} />
              <div style={{ position: "absolute", top: "66%", left: 0, right: 0, height: 1, background: "rgba(115, 75, 10, 0.55)" }} />
              <div style={{ position: "absolute", top: "33%", bottom: "33%", left: "33%", width: 1, background: "rgba(115, 75, 10, 0.55)" }} />
              <div style={{ position: "absolute", top: "33%", bottom: "33%", right: "33%", width: 1, background: "rgba(115, 75, 10, 0.55)" }} />
              <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 1, background: "rgba(115, 75, 10, 0.45)" }} />
            </div>

            {/* Contactless / NFC Wave Symbol */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.2" strokeLinecap="round">
              <path d="M8.5 8.5C9.7 9.7 10.5 11.2 10.5 13s-.8 3.3-2 4.5" />
              <path d="M12.5 5.5C14.5 7.5 15.5 10.1 15.5 13s-1 5.5-3 7.5" />
              <path d="M16.5 2.5C19.3 5.3 20.5 9 20.5 13s-1.2 7.7-4 10.5" />
            </svg>
          </div>

          {/* Middle Row: Card Number */}
          <div style={{
            position: "relative",
            zIndex: 1,
            color: "#e2e8f0",
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 2.8,
            fontFamily: "'Courier New', Courier, monospace",
            textShadow: "0 1px 2px rgba(0,0,0,0.9), 0 -1px 0 rgba(255,255,255,0.2)",
            marginTop: 4
          }}>
            {cardNumber}
          </div>

          {/* Bottom Row: Expiry (left) & VISA Logo (right) */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative", zIndex: 1 }}>
            <div style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 11,
              fontFamily: "'Courier New', Courier, monospace",
              fontWeight: 700,
              letterSpacing: 1.5,
              textShadow: "0 1px 1px rgba(0,0,0,0.8)"
            }}>
              {expiry}
            </div>

            {/* Authentic VISA Wordmark */}
            <svg width="48" height="16" viewBox="0 0 80 26" fill="none" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.8))" }}>
              <path d="M30.6 2.3L23.9 18.2H19.5L14.7 6.1C14.1 4.7 13.6 4.2 12.3 3.5C10.2 2.4 6.7 1.4 3.7 0.8L3.8 0.3H14.5C16.1 0.3 17.5 1.3 17.8 3.1L20.1 15.2L26.3 0.3H30.6ZM57.6 12.4C57.6 7.7 51 7.4 51.1 5.3C51.1 4.7 51.7 4 53.1 3.8C53.8 3.7 55.7 3.6 57.7 4.6L58.5 0.9C57.4 0.5 55.9 0.1 54 0.1C47.4 0.1 42.8 3.6 42.7 8.6C42.6 12.3 46 14.4 48.5 15.6C51.1 16.9 52 17.7 52 18.9C52 20.7 49.8 21.5 47.7 21.5C44.4 21.5 42.4 20.6 40.9 19.9L40.1 23.8C41.7 24.5 44.4 25.1 47.3 25.1C54.3 25.1 58.9 21.6 59 16.5C59 12.9 57.6 12.4 57.6 12.4ZM75 18.2H78.8L75.4 0.3H71.9C70.6 0.3 69.6 1 69.1 2.2L62.7 18.2H67.2L68.1 15.7H73.6L75 18.2ZM69.3 12.4L71.5 6.4L72.8 12.4H69.3ZM41.4 0.3L36 18.2H31.8L37.2 0.3H41.4Z" fill="#FFFFFF"/>
            </svg>
          </div>
        </div>

        {/* BACK (CVC Flip) */}
        <div style={{
          position: "absolute",
          inset: 0,
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          borderRadius: 14,
          padding: "16px 0",
          background: "linear-gradient(145deg, #191a1d 0%, #101114 100%)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 14px 28px rgba(0, 0, 0, 0.6)",
          boxSizing: "border-box"
        }}>
          <div style={{ height: 32, background: "#0a0a0c", margin: "4px 0 16px", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }} />
          <div style={{ padding: "0 20px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>CVC</span>
            <span style={{ background: "#ffffff", color: "#111111", padding: "5px 12px", borderRadius: 4, letterSpacing: 2, fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>•••</span>
          </div>
          <div style={{ position: "absolute", bottom: 12, right: 20 }}>
            <svg width="40" height="13" viewBox="0 0 80 26" fill="none" style={{ opacity: 0.6 }}>
              <path d="M30.6 2.3L23.9 18.2H19.5L14.7 6.1C14.1 4.7 13.6 4.2 12.3 3.5C10.2 2.4 6.7 1.4 3.7 0.8L3.8 0.3H14.5C16.1 0.3 17.5 1.3 17.8 3.1L20.1 15.2L26.3 0.3H30.6ZM57.6 12.4C57.6 7.7 51 7.4 51.1 5.3C51.1 4.7 51.7 4 53.1 3.8C53.8 3.7 55.7 3.6 57.7 4.6L58.5 0.9C57.4 0.5 55.9 0.1 54 0.1C47.4 0.1 42.8 3.6 42.7 8.6C42.6 12.3 46 14.4 48.5 15.6C51.1 16.9 52 17.7 52 18.9C52 20.7 49.8 21.5 47.7 21.5C44.4 21.5 42.4 20.6 40.9 19.9L40.1 23.8C41.7 24.5 44.4 25.1 47.3 25.1C54.3 25.1 58.9 21.6 59 16.5C59 12.9 57.6 12.4 57.6 12.4ZM75 18.2H78.8L75.4 0.3H71.9C70.6 0.3 69.6 1 69.1 2.2L62.7 18.2H67.2L68.1 15.7H73.6L75 18.2ZM69.3 12.4L71.5 6.4L72.8 12.4H69.3ZM41.4 0.3L36 18.2H31.8L37.2 0.3H41.4Z" fill="#FFFFFF"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
