import { useEffect } from "react";
import Footer from "../components/Footer";
import BrushStepCards from "../components/BrushStepCards";
import ReachingHandsDecoration from "../components/ReachingHandsDecoration";

const aboutSteps = [
  {
    number: "01",
    title: "People First",
    text: "Every connection is built around human dignity, rigorous food safety, and mutual community care.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80",
    link: "/register",
    linkText: "JOIN US",
  },
  {
    number: "02",
    title: "Local Impact",
    text: "Food travels less and reaches neighbours faster through hyper-local volunteer pickups and deliveries.",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80",
    link: "/register",
    linkText: "EXPLORE",
  },
  {
    number: "03",
    title: "Clear Impact",
    text: "Transparent tracking ensures every single meal donated is accounted for from kitchen to plate.",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=600&q=80",
    link: "/impact",
    linkText: "SEE DATA",
  },
];

export default function AboutUs({ theme }) {
  const isLight = theme === "light";
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const COLORS = {
    forest: "#1a3a2a",
    amber: "#e8923a",
    charcoal: "#1c2b22",
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      paddingTop: "6rem",
      position: "relative",
      zIndex: 10,
    }}>
      <div style={{
        maxWidth: "1080px",
        margin: "2rem auto",
        padding: "3rem",
        animation: "slideUp 0.8s ease-out forwards",
        background: isLight ? "rgba(255, 255, 255, 0.75)" : "rgba(30, 41, 59, 0.6)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: "24px",
        border: isLight ? "1px solid rgba(255, 255, 255, 0.6)" : "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: isLight ? "0 10px 40px rgba(15, 23, 42, 0.08)" : "0 10px 40px rgba(0, 0, 0, 0.3)",
      }}>
        <h1 style={{
          fontSize: "2.8rem",
          fontWeight: 800,
          color: isLight ? COLORS.charcoal : "#ffffff",
          marginBottom: "1rem"
        }}>
          About <span style={{ color: COLORS.amber }}>MealBridge</span>
        </h1>
        <p style={{
          fontSize: "1.15rem",
          color: isLight ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.85)",
          lineHeight: 1.8,
          marginBottom: "1.2rem"
        }}>
          MealBridge is a community-first technology initiative born out of a simple belief: good food belongs on tables, never in bins. We bridge the gap between food donors, local charities, and eager volunteers across Sri Lanka.
        </p>
        <p style={{
          fontSize: "1.15rem",
          color: isLight ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.85)",
          lineHeight: 1.8,
          marginBottom: "2.5rem"
        }}>
          We empower individuals, restaurants, grocers, and NGOs to connect seamlessly, ensuring that no good food goes to waste and vulnerable communities receive nutritious meals with dignity.
        </p>

        {/* Characteristic Card Section */}
        <section className="story-section" style={{ margin: "50px 0 20px", width: "100%", position: "relative" }}>
          <div className="section-heading">
            <p className="public-kicker">Simple, human, local</p>
            <h2 style={{ fontSize: "2.4rem", color: isLight ? COLORS.charcoal : "#ffffff" }}>Small actions can<br /><em>fill a table.</em></h2>
          </div>
          <p className="section-intro" style={{ color: isLight ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.7)" }}>
            There is enough food for everyone. We make it easier for the food we already have to reach the people who need it.
          </p>
          <div className="story-cards-wrap" style={{ position: "relative" }}>
            <BrushStepCards items={aboutSteps} defaultActive="02" />
            <ReachingHandsDecoration
              side="right"
              className="about-side-hands about-side-hands-right"
            />
          </div>
        </section>
      </div>

      <div style={{ flexGrow: 1 }} />
      <Footer theme={theme} />
    </div>
  );
}
