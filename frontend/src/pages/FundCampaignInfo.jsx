import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import BrushStepCards from "../components/BrushStepCards";
import ReachingHandsDecoration from "../components/ReachingHandsDecoration";

const campaignSteps = [
  {
    number: "01",
    title: "NGOs Post Requests",
    text: "Verified NGOs submit monetary requests detailing their goals, emergency food needs, and target community.",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80",
    link: "/register",
    linkText: "LEARN MORE",
  },
  {
    number: "02",
    title: "Secure Donations",
    text: "Users browse active fundraisers and securely donate funds directly to the cause with live milestone progress.",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80",
    link: "/register",
    linkText: "SUPPORT CAUSE",
  },
  {
    number: "03",
    title: "Achieve Goals",
    text: "Progress updates in real-time. Once the goal is met, NGOs utilize the funds to maximize community impact.",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    link: "/impact",
    linkText: "SEE IMPACT",
  },
];

export default function FundCampaignInfo({ theme }) {
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
          src="/images/fund_campaigns.png" 
          alt="Fund Campaigns" 
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
          Fund <span style={{ color: isLight ? COLORS.amber : COLORS.amberLight }}>Campaigns</span>
        </h1>
        
        <p style={{
          fontSize: "1.2rem",
          color: isLight ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.8)",
          lineHeight: 1.8,
          marginBottom: "2.5rem"
        }}>
          Sometimes, logistical support, groceries in bulk, or cooking facilities require financial backing. Our Fund Campaigns feature empowers NGOs to raise necessary funds directly from generous donors.
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
            Donate Funds
          </button>
        </div>

        {/* Characteristic Card Section */}
        <section className="story-section" style={{ margin: "50px 0 30px", width: "100%", position: "relative" }}>
          <div className="section-heading">
            <p className="public-kicker">Simple, human, local</p>
            <h2 style={{ fontSize: "2.4rem", color: isLight ? COLORS.charcoal : "#ffffff" }}>How it Works</h2>
          </div>
          <p className="section-intro" style={{ color: isLight ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.7)" }}>
            Clear and auditable fundraising that turns financial contributions into warm, nourishing meals.
          </p>
          <div className="story-cards-wrap" style={{ position: "relative" }}>
            <BrushStepCards items={campaignSteps} defaultActive="02" />
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
