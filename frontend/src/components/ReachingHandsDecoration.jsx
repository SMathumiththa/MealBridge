import React from "react";

/**
 * ReachingHandsDecoration
 * Decorative side illustration of community hands reaching out from the page edge.
 * Colored strictly using the website's palette:
 * - Primary: #124b55 (Deep Forest Teal) & #073b65 (Charcoal)
 * - Accent: #19a85a (Emerald Green) & #79cf8a (Mint Green)
 * - Background Tint: #d8e8e4 (Soft Mint/Cream)
 */
export default function ReachingHandsDecoration({
  side = "right",
  style = {},
  className = "",
  opacity = 1,
}) {
  const isLeft = side === "left";

  return (
    <aside
      className={`reaching-hands-decoration reaching-hands-${side} ${className}`}
      style={{
        position: "absolute",
        pointerEvents: "none",
        zIndex: 2,
        opacity,
        ...style,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 240 680"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "clamp(100px, 13vw, 190px)",
          height: "auto",
          display: "block",
        }}
      >
        {/* Hand 1: Accent Emerald Green (#19a85a) */}
        <g transform="translate(0, 20)">
          <path
            d="M240,24 C190,24 165,22 140,26 
               C132,18 118,6 104,2 
               C98,0 92,6 94,12 
               C96,18 110,26 122,30 
               L42,28 C34,28 32,36 38,40 
               L116,46 
               L24,52 C16,52 16,60 22,64 
               L118,66 
               L36,76 C28,76 30,84 38,86 
               L126,82 
               L58,94 C50,96 54,104 62,104 
               L136,92 
               C160,90 190,52 240,50 Z"
            fill="#19a85a"
          />
        </g>

        {/* Hand 2: Soft Mint/Cream Tint (#d8e8e4) */}
        <g transform="translate(0, 95)">
          <path
            d="M240,20 C195,20 170,18 145,22 
               C136,12 120,2 108,0 
               C102,-2 98,4 100,10 
               C104,18 116,24 126,28 
               L56,26 C48,26 46,34 52,38 
               L122,44 
               L38,48 C30,48 30,56 36,60 
               L124,62 
               L50,70 C42,70 44,78 52,80 
               L130,76 
               L72,88 C64,90 68,98 76,98 
               L140,86 
               C165,84 195,46 240,44 Z"
            fill="#d8e8e4"
            fillOpacity="0.9"
          />
        </g>

        {/* Hand 3: Primary Deep Forest Teal (#124b55) */}
        <g transform="translate(0, 170)">
          <path
            d="M240,26 C185,26 160,24 135,28 
               C126,18 112,6 98,2 
               C92,0 86,6 88,12 
               C90,18 104,26 116,32 
               L32,32 C24,32 22,40 28,44 
               L112,48 
               L12,56 C4,56 4,64 10,68 
               L114,70 
               L24,80 C16,80 18,88 26,90 
               L122,86 
               L46,98 C38,100 42,108 50,108 
               L132,96 
               C158,94 185,54 240,52 Z"
            fill="#124b55"
          />
        </g>

        {/* Hand 4: Accent Fresh Mint (#79cf8a) */}
        <g transform="translate(0, 245)">
          <path
            d="M240,22 C192,22 168,20 142,24 
               C134,14 120,4 108,2 
               C102,0 96,6 98,12 
               C102,18 114,26 124,30 
               L48,28 C40,28 38,36 44,40 
               L120,46 
               L28,52 C20,52 20,60 26,64 
               L122,66 
               L40,74 C32,74 34,82 42,84 
               L128,80 
               L64,92 C56,94 60,102 68,102 
               L138,90 
               C162,88 192,48 240,46 Z"
            fill="#79cf8a"
          />
        </g>

        {/* Hand 5: Soft Mint/Cream Tint (#d8e8e4) */}
        <g transform="translate(0, 318)">
          <path
            d="M240,24 C190,24 165,22 140,26 
               C132,16 116,4 104,2 
               C98,0 94,6 96,12 
               C100,18 112,26 122,30 
               L52,28 C44,28 42,36 48,40 
               L118,46 
               L34,50 C26,50 26,58 32,62 
               L120,64 
               L46,72 C38,72 40,80 48,82 
               L126,78 
               L68,90 C60,92 64,100 72,100 
               L136,88 
               C160,86 190,50 240,48 Z"
            fill="#d8e8e4"
            fillOpacity="0.9"
          />
        </g>

        {/* Hand 6: Accent Emerald Green (#19a85a) */}
        <g transform="translate(0, 390)">
          <path
            d="M240,24 C185,24 160,22 135,26 
               C126,16 112,4 98,0 
               C92,-2 86,4 88,10 
               C90,16 104,24 116,30 
               L36,30 C28,30 26,38 32,42 
               L114,46 
               L18,52 C10,52 10,60 16,64 
               L116,66 
               L28,76 C20,76 22,84 30,86 
               L124,82 
               L52,94 C44,96 48,104 56,104 
               L134,92 
               C158,90 185,50 240,48 Z"
            fill="#19a85a"
          />
        </g>

        {/* Hand 7: Primary Charcoal Ink (#073b65) */}
        <g transform="translate(0, 465)">
          <path
            d="M240,26 C190,26 165,24 140,28 
               C132,18 118,6 104,2 
               C98,0 92,6 94,12 
               C96,18 110,26 122,32 
               L46,32 C38,32 36,40 42,44 
               L118,48 
               L26,56 C18,56 18,64 24,68 
               L120,70 
               L38,80 C30,80 32,88 40,90 
               L126,86 
               L60,98 C52,100 56,108 64,108 
               L136,96 
               C160,94 190,52 240,50 Z"
            fill="#073b65"
          />
        </g>

        {/* Hand 8: Accent Fresh Mint (#79cf8a) */}
        <g transform="translate(0, 538)">
          <path
            d="M240,22 C192,22 168,20 142,24 
               C134,14 120,4 108,2 
               C102,0 96,6 98,12 
               C102,18 114,26 124,30 
               L50,28 C42,28 40,36 46,40 
               L120,46 
               L30,52 C22,52 22,60 28,64 
               L122,66 
               L42,74 C34,74 36,82 44,84 
               L128,80 
               L66,92 C58,94 62,102 70,102 
               L138,90 
               C162,88 192,48 240,46 Z"
            fill="#79cf8a"
          />
        </g>

        {/* Hand 9: Primary Deep Forest Teal (#124b55) */}
        <g transform="translate(0, 610)">
          <path
            d="M240,26 C185,26 160,24 135,28 
               C126,18 112,6 98,2 
               C92,0 86,6 88,12 
               C90,18 104,26 116,32 
               L34,32 C26,32 24,40 30,44 
               L114,48 
               L14,56 C6,56 6,64 12,68 
               L116,70 
               L26,80 C18,80 20,88 28,90 
               L124,86 
               L48,98 C40,100 44,108 52,108 
               L134,96 
               C158,94 185,54 240,52 Z"
            fill="#124b55"
          />
        </g>
      </svg>
    </aside>
  );
}
