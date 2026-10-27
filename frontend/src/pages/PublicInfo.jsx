import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import BrushStepCards from "../components/BrushStepCards";
import ReachingHandsDecoration from "../components/ReachingHandsDecoration";

const pageContent = {
  donors: {
    label: "For donors",
    title: "Your extra can become someone’s enough.",
    text: "Whether you are a home cook, restaurant, grocer, or event host, MealBridge helps you share safe surplus food with trusted local partners.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=85",
    cta: "Donate food",
    link: "/register",
    kicker: "How Donating Works",
    sectionTitle: "Simple, safe, and direct.",
    sectionIntro: "Redirecting surplus food takes less than two minutes. We notify trusted charities immediately.",
    steps: [
      {
        number: "01",
        title: "List in seconds",
        text: "Post surplus meals, fresh produce, or pantry essentials with simple pickup details.",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80",
        link: "/register",
        linkText: "LIST SURPLUS",
      },
      {
        number: "02",
        title: "Nearby matching",
        text: "Verified local charities and community kitchens are alerted automatically.",
        image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=600&q=80",
        link: "/register",
        linkText: "SEE PARTNERS",
      },
      {
        number: "03",
        title: "Direct pickup",
        text: "Volunteer drivers coordinate directly to collect and transport the food safely.",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
        link: "/register",
        linkText: "HOW IT WORKS",
      },
    ],
  },
  ngos: {
    label: "NGOs",
    title: "Bring good food closer to the people you serve.",
    text: "Join a network of verified community organisations. Find nearby donations, coordinate pickups, and keep your community fed with dignity.",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1000&q=85",
    cta: "Register your NGO",
    link: "/register",
    kicker: "How We Support NGOs",
    sectionTitle: "More food, less searching.",
    sectionIntro: "We bridge the gap between verified food sources and organizations serving vulnerable families.",
    steps: [
      {
        number: "01",
        title: "Verified requests",
        text: "Receive real-time alerts whenever fresh food matching your quota becomes available.",
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80",
        link: "/register",
        linkText: "REGISTER NGO",
      },
      {
        number: "02",
        title: "Fast logistics",
        text: "Coordinate delivery directly with trusted local volunteer networks and drivers.",
        image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=600&q=80",
        link: "/register",
        linkText: "MEET DRIVERS",
      },
      {
        number: "03",
        title: "Track impact",
        text: "Keep clear digital records and transparent distribution metrics for your donors.",
        image: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&w=600&q=80",
        link: "/register",
        linkText: "LEARN MORE",
      },
    ],
  },
  volunteers: {
    label: "For volunteers",
    title: "A little time can carry a lot of care.",
    text: "Help us make the last mile possible. Volunteers pick up, sort, and deliver food so a generous donation becomes a nourishing meal.",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1000&q=85",
    cta: "Become a volunteer",
    link: "/register",
    kicker: "Volunteer Roles",
    sectionTitle: "Carry care across your city.",
    sectionIntro: "Even one hour of your week can ensure wholesome meals reach people who need them.",
    steps: [
      {
        number: "01",
        title: "Flexible routes",
        text: "Choose convenient 30-minute food pickup trips from nearby restaurants and groceries.",
        image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=600&q=80",
        link: "/register",
        linkText: "CHOOSE SHIFTS",
      },
      {
        number: "02",
        title: "Hub sorting",
        text: "Sort fresh produce, inspect packaging, and pack wholesome food boxes with care.",
        image: "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=600&q=80",
        link: "/register",
        linkText: "JOIN A HUB",
      },
      {
        number: "03",
        title: "Direct care",
        text: "Deliver nourishment and smiles straight to elderly neighbours and shelters.",
        image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80",
        link: "/register",
        linkText: "BECOME VOLUNTEER",
      },
    ],
  },
  about: {
    label: "About MealBridge",
    title: "We believe food belongs on tables, not in bins.",
    text: "MealBridge is a community-powered platform connecting people with surplus food to verified NGOs and volunteers. We make sharing simple, safe, and local.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=85",
    cta: "Join the movement",
    link: "/register",
    kicker: "Our Core Mission",
    sectionTitle: "Small actions can fill a table.",
    sectionIntro: "Every community deserves a full table. We make it easy for surplus food to nourish families with dignity.",
    steps: [
      {
        number: "01",
        title: "People first",
        text: "Every connection is built around dignity, food safety, and mutual community respect.",
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80",
        link: "/about",
        linkText: "OUR VALUES",
      },
      {
        number: "02",
        title: "Local impact",
        text: "Food travels less and reaches neighbours faster through hyper-local logistics.",
        image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80",
        link: "/register",
        linkText: "EXPLORE LOCAL",
      },
      {
        number: "03",
        title: "Clear impact",
        text: "See the transparent difference your time, food, or financial support creates.",
        image: "https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=600&q=80",
        link: "/impact",
        linkText: "SEE IMPACT",
      },
    ],
  },
  contact: {
    label: "Get in touch",
    title: "Have a question? We’re here to help.",
    text: "Whether you are curious about donating, partnering with us, or volunteering, our small team would love to hear from you.",
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1000&q=85",
    cta: "Write to us",
    link: "mailto:hello@mealbridge.org",
    kicker: "Direct Support",
    sectionTitle: "Here for you at every step.",
    sectionIntro: "Connect with our specialized desks for donors, charities, and volunteer coordination.",
    steps: [
      {
        number: "01",
        title: "Donor desk",
        text: "Quick assistance with food safety guidelines, recurring pickups, and corporate giving.",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
        link: "mailto:donors@mealbridge.org",
        linkText: "EMAIL DONOR DESK",
      },
      {
        number: "02",
        title: "NGO onboarding",
        text: "Fast verification and route planning for shelters, orphanages, and community kitchens.",
        image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=600&q=80",
        link: "mailto:ngos@mealbridge.org",
        linkText: "PARTNER WITH US",
      },
      {
        number: "03",
        title: "Volunteer leads",
        text: "Connect with your district coordinator for group drives, hub hours, and training.",
        image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=600&q=80",
        link: "mailto:volunteers@mealbridge.org",
        linkText: "JOIN CHAPTER",
      },
    ],
  },
};

export default function PublicInfo({ type, theme }) {
  const { t } = useTranslation();
  const isLight = theme === "light";
  const content = pageContent[type] || pageContent.about;
  const handsSide = (type === "donors" || type === "volunteers") ? "left" : "right";

  return (
    <div className={`public-site public-info-site public-info-${type} ${isLight ? "public-light" : "public-dark"}`}>
      <header className="public-nav">
        <Link to="/" className="public-brand">
          <span className="public-brand-mark">M</span>
          <span>Meal<span style={{ color: "#19a85a" }}>Bridge</span></span>
        </Link>
        <nav className="public-links" aria-label="Primary navigation">
          <NavLink to="/" end className={({ isActive }) => isActive ? "public-link-active active" : ""}>{t("common.home")}</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? "public-link-active active" : ""}>{t("common.about")}</NavLink>
          <NavLink to="/donors" className={({ isActive }) => isActive ? "public-link-active active" : ""}>{t("common.donate")}</NavLink>
          <NavLink to="/ngos" className={({ isActive }) => isActive ? "public-link-active active" : ""}>{t("common.ngos")}</NavLink>
          <NavLink to="/volunteers" className={({ isActive }) => isActive ? "public-link-active active" : ""}>{t("common.volunteerNav")}</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? "public-link-active active" : ""}>{t("common.contact")}</NavLink>
        </nav>
        <div className="public-actions">
          <Link className="public-signin" to="/login">{t("common.signIn")}</Link>
          <Link className="public-button public-button-small" to="/register">{t("common.joinUs")} <span>↗</span></Link>
        </div>
      </header>

      <main className="info-page">
        {/* Page Hero */}
        <section className="info-hero">
          <div>
            <p className="public-kicker">{content.label}</p>
            <h1>{content.title}</h1>
            <p className="hero-description">{content.text}</p>
            <Link className="public-button" to={content.link}>{content.cta} <span>↗</span></Link>
          </div>
          <img src={content.image} alt={content.title} />
        </section>

        {/* Balanced 2-Column Section Filling the Empty Space Responsively */}
        <section className="story-section" style={{ marginTop: "70px", marginBottom: "70px" }}>
          <div className="section-heading">
            <p className="public-kicker">{content.kicker}</p>
            <h2>{content.sectionTitle}</h2>
          </div>
          <p className="section-intro">{content.sectionIntro}</p>
          <div className="story-cards-wrap" style={{ position: "relative" }}>
            <BrushStepCards items={content.steps} defaultActive="02" />
            <ReachingHandsDecoration
              side={handsSide}
              className={`about-side-hands about-side-hands-${handsSide}`}
            />
          </div>
        </section>
      </main>

      <Footer theme={theme} />
    </div>
  );
}
