const PATHS = {
  plus: "M12 5v14M5 12h14",
  eye: "M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  award: "M12 3l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7L12 3Zm-3 14.5V21l3-1.6 3 1.6v-3.5",
  food: "m4 8 8-4 8 4-8 4-8-4Zm0 0v8l8 4 8-4V8M8 10v8M16 10v8",
  users: "M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7-8a4 4 0 0 1 0 7.8M22 20v-2a4 4 0 0 0-3-3.9",
  check: "m5 12 4 4L19 6",
  truck: "M3 6h11v10H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm11 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  online: "M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4m10 10 1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  feedback: "M20 11.5a7.5 7.5 0 0 1-8 7.5 8.5 8.5 0 0 1-3-.5L4 20l1.5-4A7.5 7.5 0 1 1 20 11.5ZM8 12h.01M12 12h.01M16 12h.01",
  building: "M4 21V5l8-2 8 2v16M8 8h1M12 8h1M16 8h1M8 12h1M12 12h1M16 12h1M10 21v-4h4v4",
  mail: "M3 5h18v14H3zM3 6l9 7 9-7",
  phone: "M7 3h3l1 5-2 1a14 14 0 0 0 6 6l1-2 5 1v3c0 1.1-.9 2-2 2C11.3 19 5 12.7 5 5c0-1.1.9-2 2-2Z",
  location: "M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Zm-5 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  district: "M4 20V7l8-4 8 4v13M8 10h1M12 10h1M16 10h1M8 14h1M12 14h1M16 14h1M10 20v-4h4v4",
};

const LEGACY_NAMES = {
  "🏆": "award",
  "🍱": "food",
  "👥": "users",
  "✅": "check",
  "🚚": "truck",
  "🟢": "online",
  "📝": "feedback",
  "🏢": "building",
  "✉️": "mail",
  "📱": "phone",
  "📍": "location",
  "🏘️": "district",
};

export default function DashboardIcon({ name, size = 22, color = "currentColor", strokeWidth = 1.8 }) {
  const path = PATHS[LEGACY_NAMES[name] || name] || PATHS.food;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}
