import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import BrushStepCards from "../components/BrushStepCards";
import ReachingHandsDecoration from "../components/ReachingHandsDecoration";

const steps = [
  {
    number: "01",
    title: "Share what you can",
    text: "List surplus meals, fresh produce, or pantry essentials in a few simple steps.",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=85",
    link: "/donors",
    linkText: "START SHARING",
  },
  {
    number: "02",
    title: "We find the right match",
    text: "Verified NGOs and community partners nearby are notified immediately.",
    image: "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=600&q=85",
    link: "/ngos",
    linkText: "EXPLORE MATCHING",
  },
  {
    number: "03",
    title: "Good food gets moving",
    text: "A volunteer coordinates pickup so every safe meal reaches someone who needs it.",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=600&q=85",
    link: "/volunteers",
    linkText: "JOIN DRIVERS",
  },
];

export default function Welcome({ theme }) {
  const { t } = useTranslation();
  const isLight = theme === "light";

  useEffect(() => {
    document.body.classList.add("welcome-route");
    return () => document.body.classList.remove("welcome-route");
  }, []);

  return (
    <div className={`public-site public-home-site ${isLight ? "public-light" : "public-dark"}`}>
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

      <main>
        <section className="public-hero">
          <div className="hero-copy">
            <p className="public-kicker"><span>✦</span> {t("common.foodWithPurpose")}</p>
            <h1>{t("common.goodFood")}<br /><em>{t("common.goodPeople")}</em><br />{t("common.betterTogether")}</h1>
            <p className="hero-description">
              MealBridge connects surplus food with people and communities who need it most.
              Share a meal, support a neighbour, and help us build a world with less waste.
            </p>
            <div className="hero-actions">
              <Link className="public-button" to="/register">{t("common.startImpact")} <span>↗</span></Link>
              <a className="text-link" href="#how-it-works">{t("common.seeHow")} <span>↓</span></a>
            </div>
            <div className="hero-proof">
              <div className="avatar-stack">
                <span>R</span><span>A</span><span>M</span><span>+</span>
              </div>
              <p><strong>2,400+ people</strong><br />are already sharing good food</p>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-frame">
              <img src="https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=1200&q=85" alt="Food donations prepared for a community" />
            </div>
            <div className="hero-note hero-note-top"><span>✦</span> Every meal matters</div>
            <div className="hero-note hero-note-bottom"><strong>48,230</strong><br />meals shared so far</div>
            <span className="hero-scribble">↗</span>
          </div>
        </section>

        <section className="impact-strip" aria-label="MealBridge impact">
          <div><strong>48k+</strong><span>meals shared</span></div>
          <div><strong>120+</strong><span>community partners</span></div>
          <div><strong>2.4k</strong><span>active members</span></div>
          <div><strong>18t</strong><span>food rescued</span></div>
        </section>

        {/* Balanced 2-Column Section Filling the Empty Space Responsively */}
        <section className="story-section" id="how-it-works">
          <div className="section-heading">
            <p className="public-kicker">Simple, human, local</p>
            <h2>Small actions can<br /><em>fill a table.</em></h2>
          </div>
          <p className="section-intro">
            There is enough food for everyone. We make it easier for the food we already have to reach the people who need it.
          </p>
          <div className="story-cards-wrap" style={{ position: "relative" }}>
            <BrushStepCards items={steps} defaultActive="02" />
          </div>
        </section>

        <section className="roles-section">
          <div className="role-image">
            <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=85" alt="Fresh food packed for donation" />
            <span className="image-label">Food is better<br /><strong>when shared.</strong></span>
          </div>
          <div className="roles-copy">
            <p className="public-kicker">Find your place here</p>
            <h2>There is a role<br /><em>for everyone.</em></h2>
            <div className="role-links">
              <Link to="/donors"><span>01</span><strong>I have food to share</strong><b>↗</b></Link>
              <Link to="/ngos"><span>02</span><strong>I represent an NGO</strong><b>↗</b></Link>
              <Link to="/volunteers"><span>03</span><strong>I want to volunteer</strong><b>↗</b></Link>
            </div>
          </div>
        </section>

        <section className="quote-section">
          <span className="quote-mark">“</span>
          <blockquote>When a meal moves from a surplus table to an empty one, the whole community gets stronger.</blockquote>
          <p>— The MealBridge community</p>
        </section>

        <section className="cta-section">
          <p className="public-kicker">Ready when you are</p>
          <h2>Let’s make room<br /><em>for one more.</em></h2>
          <Link className="public-button" to="/register">Join MealBridge <span>↗</span></Link>
        </section>
      </main>
      <Footer theme={theme} />
    </div>
  );
}
