import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import BrushStepCards from "../components/BrushStepCards";
import ReachingHandsDecoration from "../components/ReachingHandsDecoration";

const donationSteps = [
  {
    number: "01",
    title: "List Surplus Food",
    text: "Donors post details about available food including quantity, food type, and expiry window.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80",
    link: "/register",
    linkText: "START LISTING",
  },
  {
    number: "02",
    title: "Instant Notifications",
    text: "Nearby verified NGOs and community shelters receive immediate real-time alerts.",
    image: "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=600&q=80",
    link: "/register",
    linkText: "SEE CHARITIES",
  },
  {
    number: "03",
    title: "Claim & Distribute",
    text: "NGOs claim the listing and coordinate pickup, ensuring food reaches the hungry immediately.",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=600&q=80",
    link: "/register",
    linkText: "JOIN NOW",
  },
];

export default function FoodDonationInfo({ theme }) {
  const navigate = useNavigate();
  const isLight = theme === "light";

  const COLORS = {
    forest: "#1a3a2a",
    amber: "#e8923a",
    amberLight: "#f4b96e",
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
        margin: "0 auto",
        padding: "2rem",
        animation: "slideUp 0.8s ease-out forwards",
      }}>
        <img 
          src="/images/food_donation.png" 
          alt="Food Donation" 
          style={{
            width: "100%",
            height: "400px",
            objectFit: "cover",
            borderRadius: "24px",
            marginBottom: "3rem",
            boxShadow: isLight ? "0 10px 30px rgba(15,23,42,0.1)" : "0 10px 30px rgba(0,0,0,0.3)",
          }}
        />

        <h1 style={{
          fontSize: "3rem",
          fontWeight: 800,
          color: isLight ? COLORS.charcoal : "#ffffff",
          marginBottom: "1rem"
        }}>
          Donate <span style={{ color: isLight ? COLORS.amber : COLORS.amberLight }}>Food</span>
        </h1>
        
        <p style={{
          fontSize: "1.2rem",
          color: isLight ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.8)",
          lineHeight: 1.8,
          marginBottom: "2.5rem"
        }}>
          Every day, countless meals are wasted while millions go hungry. MealBridge connects generous donors—whether individuals, restaurants, or event organizers—with verified NGOs who distribute the food to those who need it most.
        </p>

        <div style={{ marginBottom: "2.5rem" }}>
          <button 
            onClick={() => navigate('/register')}
            style={{
              padding: "1rem 2.5rem",
              fontSize: "1.1rem",
              fontWeight: 600,
              borderRadius: "50px",
              background: COLORS.amber,
              color: "#fff",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(232, 146, 58, 0.3)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            Become a Donor
          </button>
        </div>

        {/* Characteristic Card Section */}
        <section className="story-section" style={{ margin: "50px 0 30px", width: "100%", position: "relative" }}>
          <div className="section-heading">
            <p className="public-kicker">Simple, human, local</p>
            <h2 style={{ fontSize: "2.4rem", color: isLight ? COLORS.charcoal : "#ffffff" }}>How it Works</h2>
          </div>
          <p className="section-intro" style={{ color: isLight ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.7)" }}>
            Our verified local network makes food rescue rapid, reliable, and respectful of every family's dignity.
          </p>
          <div className="story-cards-wrap" style={{ position: "relative" }}>
            <BrushStepCards items={donationSteps} defaultActive="02" />
            <ReachingHandsDecoration
              side="left"
              className="about-side-hands about-side-hands-left"
            />
          </div>
        </section>
      </div>

      <div style={{ flexGrow: 1 }} />
      <Footer theme={theme} />
    </div>
  );
}
