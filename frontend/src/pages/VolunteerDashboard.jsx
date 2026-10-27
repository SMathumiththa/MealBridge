import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { getRequests, updateRequest, assignVolunteer } from "../api/request";
import { getNotifications, markNotificationsAsRead } from "../api/notification";
import io from "socket.io-client";
import LiveTracker from "../components/LiveTracker";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../theme";
import ChatWidget from "../components/ChatWidget";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import Leaderboard from "../components/Leaderboard";
import { getFeedbacksByVolunteer } from "../api/feedback";
import RatingStars from "../components/RatingStars";

function VolunteerFeedbacks({ user, theme, activePage }) {
  const { t } = useTranslation();
  const [feedbacks, setFeedbacks] = useState([]);
  const [volunteerInfo, setVolunteerInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const isLight = theme === "light";
  const textColor = isLight ? "#0f172a" : "white";
  const mutedColor = isLight ? "rgba(15,23,42,0.62)" : "rgba(255,255,255,0.62)";

  useEffect(() => {
    if (!user?._id || activePage !== "feedbacks") return;
    setLoading(true);
    getFeedbacksByVolunteer(user._id).then((res) => {
      if (res.success) {
        setFeedbacks(res.feedbacks || []);
        setVolunteerInfo(res.volunteer || null);
      }
    }).catch((err) => console.error("Failed to load volunteer feedback", err))
      .finally(() => setLoading(false));
  }, [user?._id, activePage]);

  return (
    <div style={{ padding: "8px 0 24px", maxWidth: 980, margin: "0 auto" }}>
      <h2 style={{ color: textColor, fontSize: 28, textAlign: "center", margin: "0 0 24px", fontWeight: 700 }}>⭐ {t("common.feedbackRatings")}</h2>
      <div style={{ display: "flex", gap: 16, marginBottom: 30, flexWrap: "wrap", justifyContent: "center" }}>
        <StatCard icon="⭐" label={t("common.averageRating")} value={volunteerInfo?.averageRating ? volunteerInfo.averageRating.toFixed(1) : (user?.averageRating ? user.averageRating.toFixed(1) : "0.0")} color={COLORS.amber} align="center" />
        <StatCard icon="✅" label={t("common.totalReviews")} value={feedbacks.length} color={COLORS.mint} align="center" />
      </div>
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: mutedColor }}>
          ⏳ {t("common.loading")}
        </div>
      ) : feedbacks.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: mutedColor }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>⭐</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: textColor }}>{t("common.noFeedback")}</div>
          <p style={{ margin: 0, fontSize: 14 }}>{t("common.completeDeliveries")}</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {feedbacks.map((feedback) => (
            <div key={feedback._id} style={{ background: isLight ? "rgba(255,255,255,0.8)" : "rgba(40,92,68,0.34)", border: isLight ? "1px solid rgba(15,23,42,0.12)" : "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: 20, backdropFilter: "blur(14px)", boxShadow: isLight ? "0 8px 24px rgba(15,23,42,0.06)" : "0 10px 28px rgba(0,0,0,0.12)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: textColor, marginBottom: 4 }}>🎯 {feedback.ngoId?.name || "NGO"}</div>
                  <div style={{ fontSize: 12, color: mutedColor }}>{new Date(feedback.createdAt).toLocaleDateString()}</div>
                </div>
                <RatingStars rating={feedback.rating} readOnly size={24} />
              </div>
              {feedback.comment && <p style={{ background: isLight ? "rgba(15,23,42,0.04)" : "rgba(0,0,0,0.2)", borderRadius: 10, padding: 12, color: textColor, fontSize: 13, lineHeight: 1.6, margin: 0, borderLeft: `3px solid ${COLORS.amber}` }}>&quot;{feedback.comment}&quot;</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function VolunteerNotifications({ notifications, setNotifications, theme }) {
  const { t } = useTranslation();
  const isLight = theme === "light";
  const textColor = isLight ? "#111" : "white";
  const mutedColor = isLight ? "rgba(15,23,42,0.65)" : "rgba(255,255,255,0.55)";

  const markRead = (id) => {
    setNotifications(notifications.map(notification => notification._id === id ? { ...notification, read: true } : notification));
    markNotificationsAsRead().catch(() => {});
  };

  return (
    <div style={{ padding: 24, background: isLight ? "rgba(255,255,255,0.94)" : "rgba(255,255,255,0.04)", borderRadius: 24 }}>
      <h2 style={{ color: textColor, fontSize: 26, margin: "0 0 4px" }}>🔔 {t("common.notifications")}</h2>
      <p style={{ color: mutedColor, fontSize: 14, marginBottom: 20 }}>{notifications.filter(notification => !notification.read).length} unread notifications</p>
      {notifications.length === 0 && <p style={{ color: mutedColor }}>{t("common.noNotifications")}</p>}
      {notifications.map(notification => (
        <div key={notification._id} onClick={() => markRead(notification._id)} style={{ background: notification.read ? (isLight ? "rgba(15,23,42,0.04)" : "rgba(255,255,255,0.06)") : (isLight ? "#fff" : "rgba(255,255,255,0.1)"), border: `1px solid ${notification.read ? (isLight ? "rgba(15,23,42,0.1)" : "rgba(255,255,255,0.15)") : COLORS.amber}`, borderRadius: 12, padding: "14px 16px", marginBottom: 10, display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(232, 146, 58, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: COLORS.amber, fontSize: 16, flexShrink: 0 }}>🔔</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: textColor, fontWeight: 600, fontSize: 14 }}>Notification</span>
              <span style={{ color: mutedColor, fontSize: 11 }}>{new Date(notification.createdAt).toLocaleDateString()}</span>
            </div>
            <div style={{ color: notification.read ? mutedColor : textColor, fontSize: 13, marginTop: 3 }}>{notification.message}</div>
          </div>
          {!notification.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.amber, flexShrink: 0, marginTop: 6 }} />}
        </div>
      ))}
    </div>
  );
}

function VolunteerHome({ setActive, user, requests, theme }) {
  const { t } = useTranslation();
  const isLight = theme === "light";
  const textColor = isLight ? "#111" : "white";
  const mutedColor = isLight ? "rgba(15,23,42,0.65)" : "rgba(255,255,255,0.65)";
  const pageBg = isLight ? "rgba(248,250,252,0.75)" : "transparent";
  
  const completedDeliveries = requests.filter(r => String(r.volunteerId?._id || r.volunteerId) === String(user?._id) && r.status === "completed").length;
  
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return t("common.morning");
    if (hour < 17) return t("common.afternoon");
    return t("common.evening");
  })();

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", background: pageBg, padding: isLight ? "28px 20px 0" : 0, borderRadius: isLight ? 24 : 0 }}>
      <h2 style={{ color: textColor, fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{greeting}, {user?.name || "Volunteer"}! 👋</h2>
      <p style={{ color: mutedColor, fontSize: 16, marginBottom: 32 }}>{t("common.volunteerWelcome")}</p>

      <div style={{ display: "flex", gap: 16, marginBottom: 36, flexWrap: "wrap", justifyContent: "center", textAlign: "left" }}>
        <StatCard icon="🏆" label="My Badge" value={user?.badge || "Newcomer"} sub={`${user?.points || 0} Points`} />
        <StatCard icon="🚚" label="Completed" value={completedDeliveries} sub="deliveries made" />
        <StatCard icon="🟢" label="Status" value="Online" sub="ready to deliver" />
      </div>

      <div style={{ marginBottom: 36 }}>
        <h3 style={{ color: textColor, fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Quick Actions</h3>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <button onClick={() => setActive("availablePickups")} style={{
            background: COLORS.mint, color: COLORS.forest, border: "none", borderRadius: 12,
            padding: "14px 28px", fontWeight: 700, fontSize: 16, cursor: "pointer", boxShadow: "0 4px 15px rgba(121,189,143,0.3)"
          }}>👀 Find Pickups</button>
          <button onClick={() => setActive("myDeliveries")} style={{
            background: "transparent", color: COLORS.mint, border: `2px solid ${COLORS.mint}`,
            borderRadius: 12, padding: "12px 28px", fontWeight: 600, fontSize: 16, cursor: "pointer",
          }}>🚚 My Deliveries</button>
        </div>
      </div>
    </div>
  );
}

export default function VolunteerDashboard({ theme }) {
  const { t } = useTranslation();
  const [active, setActive] = useState("volunteerHome");
  const [activeChat, setActiveChat] = useState(null);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [trackDelivery, setTrackDelivery] = useState(null);
  // We need to fetch fresh user data to get updated points and badges
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const navigate = useNavigate();

  const isLight = theme === "light";
  const panelBg = isLight ? "rgba(255,255,255,0.9)" : "rgba(15,34,25,0.85)";
  const panelBorder = isLight ? "1px solid rgba(15,23,42,0.1)" : "1px solid rgba(255,255,255,0.15)";
  const textColor = isLight ? "#0f172a" : "white";

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const loadData = async () => {
    try {
      const res = await getRequests();
      if (res.success) {
        setRequests(res.data);
      }
      
      // Update local user data if possible, usually by hitting a /me endpoint or just waiting for next login
      // A quick fix is to fetch /verify
      const token = localStorage.getItem("token");
      if (token) {
        const verifyRes = await fetch(`http://${window.location.hostname}:5000/api/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json());
        if (verifyRes.success) {
          setUser(verifyRes.user);
          localStorage.setItem("user", JSON.stringify(verifyRes.user));
        }
      }
    } catch {
      console.log("Failed to load deliveries");
    }
  };

  useEffect(() => {
    loadData();

    // Notification polling
    let intervalId;
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications();
        const allNotifs = res.data || [];
        setNotifications(allNotifs);
      } catch (err) {
        console.error("Error fetching notifications", err);
      }
    };
    
    fetchNotifications();
    intervalId = setInterval(fetchNotifications, 10000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!user?._id) return;
    const socket = io(`http://${window.location.hostname}:5000`);
    socket.emit("join_user_room", user._id);
    
    socket.on("new_notification", (notif) => {
      setNotifications(prev => [notif, ...prev]);
      toast(notif.message, { 
        icon: notif.type === "new_message" ? "💬" : "🔔",
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
        duration: 4000
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [user?._id]);

  const handleAssign = async (id) => {
    try {
      const res = await assignVolunteer(id);
      if (res.success) {
        toast.success("Delivery accepted!");
        loadData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept delivery");
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await updateRequest(id, { status });
      if (res.success) {
        if(status === "completed") {
          toast.success(`Delivery completed! Points added! 🎉`);
        } else {
          toast.success(`Status updated to ${status}`);
        }
        loadData();
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const availableRequests = requests.filter(r => r.status === "accepted" && !r.volunteerId);
  const myDeliveries = requests.filter(r => String(r.volunteerId?._id || r.volunteerId) === String(user?._id));

  const pages = {
    volunteerHome: <VolunteerHome setActive={setActive} user={user} requests={requests} theme={theme} />,
    availablePickups: (
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>👀 {t("volunteer.availablePickupsTitle", { defaultValue: "Available Pickups" })} ({availableRequests.length})</h2>
        {availableRequests.length === 0 ? <p>{t("volunteer.noAvailable", { defaultValue: "No available deliveries right now. Check back later!" })}</p> : (
          <div style={{ display: "grid", gap: 16 }}>
            {availableRequests.map(r => (
              <div key={r._id} style={{
                background: panelBg, backdropFilter: "blur(20px)", borderRadius: 16, border: panelBorder, padding: 20,
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    🍱 {r.foodId?.foodName} ({r.qty} {r.foodId?.unit})
                    {r.foodId?.isEmergency && (
                      <span style={{ 
                        background: "rgba(231,76,60,0.1)", color: "#e74c3c", fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 12, border: "1px solid rgba(231,76,60,0.3)"
                      }}>🚨 URGENT</span>
                    )}
                  </div>
                  <div style={{ fontSize: 15, color: isLight ? "rgba(15,23,42,0.65)" : "rgba(255,255,255,0.6)", lineHeight: "1.6" }}>
                    <strong>{t("volunteer.pickup", { defaultValue: "Pickup" })}:</strong> {typeof r.foodId?.location === 'object' ? r.foodId?.location?.address : r.foodId?.location} <br/>
                    <strong>{t("volunteer.dropoff", { defaultValue: "Dropoff" })}:</strong> {r.ngoId?.name || r.ngoId?.organization || "NGO"}
                  </div>
                </div>
                <button 
                  onClick={() => handleAssign(r._id)}
                  style={{
                    background: COLORS.mint, color: COLORS.forest, border: "none", padding: "12px 24px", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 15px rgba(121,189,143,0.3)"
                  }}
                >
                  {t("volunteer.acceptDelivery", { defaultValue: "Accept Delivery" })}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    myDeliveries: (
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>🚚 {t("volunteer.myDeliveriesTitle", { defaultValue: "My Active Deliveries" })} ({myDeliveries.filter(m => m.status !== "completed").length})</h2>
        {myDeliveries.length === 0 ? <p>You have no delivery history.</p> : (
          <div style={{ display: "grid", gap: 16 }}>
            {myDeliveries.map(r => (
              <div key={r._id} style={{
                background: panelBg, backdropFilter: "blur(20px)", borderRadius: 16, border: panelBorder, padding: 20
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", gap: 12 }}>
                      🍱 {r.foodId?.foodName}
                      {r.foodId?.isEmergency && (
                        <span style={{ 
                          background: "rgba(231,76,60,0.1)", color: "#e74c3c", fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 12, border: "1px solid rgba(231,76,60,0.3)"
                        }}>🚨 URGENT</span>
                      )}
                    </div>
                    <div style={{ fontSize: 14, color: isLight ? "rgba(15,23,42,0.65)" : "rgba(255,255,255,0.6)", marginTop: 6 }}>
                      Quantity: {r.qty} {r.foodId?.unit}
                    </div>
                  </div>
                  <span style={{
                    background: r.status === "completed" ? "rgba(121, 189, 143, 0.2)" : "rgba(232, 146, 58, 0.2)", 
                    color: r.status === "completed" ? COLORS.mint : COLORS.amber, 
                    fontSize: 13, fontWeight: 700, padding: "6px 14px", borderRadius: 20, border: `1px solid ${r.status === "completed" ? COLORS.mint : COLORS.amber}40`
                  }}>{r.status.toUpperCase()}</span>
                </div>

                <div style={{ fontSize: 15, marginBottom: 20, background: isLight ? "rgba(15,23,42,0.03)" : "rgba(255,255,255,0.03)", padding: 16, borderRadius: 12, border: panelBorder }}>
                  <div style={{ marginBottom: 8 }}><strong>📍 Pickup:</strong> {typeof r.foodId?.location === 'object' ? r.foodId?.location?.address : r.foodId?.location}</div>
                  <div><strong>🏢 Dropoff:</strong> {r.ngoId?.name || r.ngoId?.organization}</div>
                </div>

                {r.status !== "completed" && (
                  <div style={{ display: "flex", gap: 12 }}>
                    {r.status === "accepted" && (
                      <button 
                        onClick={() => handleUpdateStatus(r._id, "picked_up")}
                        style={{ flex: 1, background: COLORS.amber, color: COLORS.forest, border: "none", padding: "12px", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}
                      >
                        Mark Pickup Complete
                      </button>
                    )}
                    {r.status === "picked_up" && (
                      <button 
                        onClick={() => handleUpdateStatus(r._id, "completed")}
                        style={{ flex: 1, background: COLORS.mint, color: COLORS.forest, border: "none", padding: "12px", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}
                      >
                        Mark Delivery Complete 🎉
                      </button>
                    )}
                      <button 
                        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(typeof r.foodId?.location === 'object' ? r.foodId?.location?.address : r.foodId?.location)}&destination=${encodeURIComponent(r.ngoId?.officeLocation?.address || r.ngoId?.address || r.ngoId?.location)}`, '_blank')}
                        style={{ flex: 1, background: "transparent", color: COLORS.amber, border: `2px solid ${COLORS.amber}`, padding: "12px", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}
                      >
                        🗺️ Google Maps
                      </button>
                      <button 
                        onClick={() => setTrackDelivery(r)}
                        style={{ flex: 1, background: "transparent", color: "#3498db", border: `2px solid #3498db`, padding: "12px", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}
                      >
                        📍 Live Track
                      </button>
                    <button 
                      onClick={() => setActiveChat(activeChat === r._id ? null : r._id)}
                      style={{ flex: 1, background: "transparent", color: textColor, border: panelBorder, padding: "12px", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}
                    >
                      💬 Chat
                    </button>
                  </div>
                )}
                
                {activeChat === r._id && (
                  <div style={{ marginTop: 20 }}>
                    <button onClick={() => setActiveChat(null)} style={{ background: "transparent", color: "#e74c3c", border: "none", cursor: "pointer", fontSize: 13, marginBottom: 8, fontWeight: 700, float: "right" }}>✖ Close Chat</button>
                    <div style={{ clear: "both" }}></div>
                    <ChatWidget
                      requestId={r._id}
                      currentUserId={user?._id}
                      currentUserRole="volunteer"
                      compact={true}
                      donorLocation={r.foodId?.location}
                      ngoLocation={r.ngoId?.officeLocation}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    notifications: <VolunteerNotifications notifications={notifications} setNotifications={setNotifications} theme={theme} />,
    leaderboard: <Leaderboard theme={theme} role="volunteer" />,
    feedbacks: <VolunteerFeedbacks user={user} theme={theme} activePage={active} />,
    profile: <ProfilePage user={user} setUser={setUser} theme={theme} />
  };

  return (
    <DashboardLayout 
      role="volunteer" 
      activePage={active} 
      onNav={setActive} 
      onLogout={onLogout}
      user={user}
      notifCount={notifications.filter(n => !n.read).length}
      requestCount={availableRequests.length}
      theme={theme}
    >
      <div
        onClick={() => setActive("notifications")}
        style={{
          position: "absolute",
          top: 24,
          right: 36,
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: theme === "light" ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0.06)",
          border: theme === "light" ? "1px solid rgba(15,23,42,0.12)" : "1px solid rgba(255,255,255,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          cursor: "pointer",
          zIndex: 100,
        }}
        title="Notifications"
      >
        🔔
        {notifications.filter(notification => !notification.read).length > 0 && (
          <div style={{ position: "absolute", top: 10, right: 12, width: 8, height: 8, borderRadius: "50%", background: COLORS.amber }} />
        )}
      </div>
      <div
        style={{
          animation: "slideUp 0.3s ease forwards",
          maxHeight: "calc(100vh - 120px)",
          overflowY: "auto",
          overflowX: "hidden",
          paddingRight: 12,
          paddingBottom: 20,
          color: textColor,
        }}
        key={active}
      >
        {pages[active] || pages.volunteerHome}
      </div>

      {trackDelivery && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: panelBg, border: panelBorder, borderRadius: 20, padding: 24, width: "100%", maxWidth: 600 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, color: textColor }}>📍 Live Delivery Route</h3>
              <button onClick={() => setTrackDelivery(null)} style={{ background: "transparent", border: "none", color: textColor, fontSize: 24, cursor: "pointer" }}>✕</button>
            </div>
              <LiveTracker
                roomId={trackDelivery._id}
                currentUserRole="volunteer"
                donorLocation={trackDelivery.foodId?.location}
                ngoLocation={trackDelivery.ngoId?.officeLocation}
              />
            <div style={{ marginTop: 16, fontSize: 14, color: isLight ? "#666" : "#aaa", lineHeight: "1.6" }}>
              <strong>Pickup:</strong> {trackDelivery.foodId?.location?.address || trackDelivery.foodId?.location} <br/>
                <strong>Dropoff:</strong> {trackDelivery.ngoId?.officeLocation?.address || trackDelivery.ngoId?.address} <br/>
                {trackDelivery.foodId?.donor?.phone && <><strong>Donor:</strong> <a href={`tel:${trackDelivery.foodId.donor.phone}`} style={{ color: COLORS.amber }}>{trackDelivery.foodId.donor.phone}</a><br/></>}
                {trackDelivery.ngoId?.phone && <><strong>NGO:</strong> <a href={`tel:${trackDelivery.ngoId.phone}`} style={{ color: COLORS.mint }}>{trackDelivery.ngoId.phone}</a></>}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function ProfileInputField({ label, value, onChange, type = "text", icon, theme, disabled }) {
  const isLight = theme === "light";
  const textColor = isLight ? "#0f172a" : "white";
  const mutedColor = isLight ? "rgba(15,23,42,0.65)" : "rgba(255,255,255,0.55)";
  const inputBg = isLight ? "#ffffff" : "rgba(255,255,255,0.06)";
  const borderColor = isLight ? "rgba(15,23,42,0.15)" : "rgba(255,255,255,0.18)";

  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{ 
          display: "block", 
          fontSize: 13, 
          fontWeight: 600, 
          color: mutedColor, 
          marginBottom: 6 
        }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {icon && (
          <span style={{ 
            position: "absolute", 
            left: 12, 
            fontSize: 16, 
            color: mutedColor 
          }}>
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          style={{
            width: "100%",
            padding: icon ? "10px 12px 10px 38px" : "10px 12px",
            borderRadius: 10,
            border: borderColor,
            background: inputBg,
            color: textColor,
            outline: "none",
            fontSize: 14,
            boxSizing: "border-box"
          }}
        />
      </div>
    </div>
  );
}

function ProfilePage({ user, setUser, theme }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ 
    name: user?.name || "", 
    email: user?.email || "", 
    phone: user?.phone || "", 
    organization: user?.organization || "",
    address: user?.officeLocation?.address || "",
    district: "Colombo" 
  });
  const [officeLoc, setOfficeLoc] = useState(() => user?.officeLocation || null);
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);
  const isLight = theme === "light";
  const textColor = isLight ? "#0f172a" : "white";
  const mutedColor = isLight ? "rgba(15,23,42,0.65)" : "rgba(255,255,255,0.55)";
  const [saved, setSaved] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  // Keep state in sync with user changes
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        organization: user.organization || "",
        address: user.officeLocation?.address || "",
        district: "Colombo"
      });
      setOfficeLoc(user.officeLocation || null);
      setProfileImage(user.profileImage || null);
    }
  }, [user]);

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setProfileImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    toast.loading("Getting current location...");
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        const address = data?.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        setForm((f) => ({ ...f, address }));
        setOfficeLoc({ lat, lng, address });
        toast.dismiss();
        toast.success("Location set");
      } catch {
        setOfficeLoc({ lat, lng, address: "" });
        setForm((f) => ({ ...f, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` }));
        toast.dismiss();
        toast.success("Location coordinates set");
      }
    }, () => {
      toast.dismiss();
      toast.error("Failed to get location");
    }, { enableHighAccuracy: true, timeout: 8000 });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      if (officeLoc?.address !== undefined || form.address) {
        formData.append("officeAddress", officeLoc?.address || form.address);
      }
      if (officeLoc?.lat !== undefined) formData.append("officeLat", officeLoc.lat);
      if (officeLoc?.lng !== undefined) formData.append("officeLng", officeLoc.lng);
      if (imageFile) formData.append("profileImage", imageFile);
      
      const { updateProfile } = await import("../api/auth");
      const res = await updateProfile(formData);
      
      localStorage.setItem("user", JSON.stringify(res.data));
      if (setUser) setUser(res.data);
      setProfileImage(res.data.profileImage);
      setOfficeLoc(res.data.officeLocation || officeLoc);
      setImageFile(null);
      setEdit(false); 
      setSaved(true); 
      setTimeout(() => setSaved(false), 2500); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: isLight ? "rgba(255,255,255,0.94)" : "transparent", borderRadius: 24, padding: 24, color: textColor }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ color: textColor, fontSize: 26, margin: 0 }}>🏢 Volunteer Profile</h2>
        {!edit && (
          <button 
            onClick={() => setEdit(true)} 
            style={{ 
              background: isLight ? "rgba(15,23,42,0.06)" : "rgba(255,255,255,0.05)", 
              color: textColor, 
              border: isLight ? "1px solid rgba(15,23,42,0.12)" : "1px solid rgba(255,255,255,0.15)", 
              padding: "8px 16px", 
              borderRadius: 10, 
              cursor: "pointer", 
              fontWeight: 600,
              fontSize: 14
            }}
          >
            Edit Profile
          </button>
        )}
      </div>

      {saved && (
        <div style={{ 
          background: "rgba(126, 200, 160, 0.15)", 
          border: `1px solid rgba(126, 200, 160, 0.3)`, 
          borderRadius: 12, 
          padding: "12px 18px", 
          marginBottom: 18, 
          fontSize: 14, 
          color: COLORS.mint 
        }}>
          ✅ Profile updated successfully!
        </div>
      )}

      <div style={{ 
        background: isLight ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.06)", 
        border: isLight ? "1px solid rgba(15,23,42,0.12)" : "1px solid rgba(255,255,255,0.15)", 
        borderRadius: 18, 
        padding: "28px 30px", 
        marginBottom: 20 
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28 }}>
          <div 
            onClick={() => edit && fileRef.current?.click()}
            style={{ 
              width: 72, height: 72, borderRadius: 20, 
              background: `linear-gradient(135deg, ${COLORS.mint}, #4a8c6a)`, 
              display: "flex", alignItems: "center", justifyContent: "center", 
              fontSize: 28, fontWeight: 800, color: COLORS.forest,
              cursor: edit ? "pointer" : "default",
              overflow: "hidden", position: "relative"
            }}>
            {profileImage ? (
              <img src={profileImage} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              form.name.substring(0, 2).toUpperCase()
            )}
            {edit && (
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: "rgba(0,0,0,0.6)", color: "white", fontSize: 10,
                textAlign: "center", padding: "4px 0", textTransform: "uppercase"
              }}>
                Edit
              </div>
            )}
            <input type="file" ref={fileRef} accept="image/*" style={{ display: "none" }} onChange={handleImg} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: textColor }}>{form.name}</div>
          </div>
        </div>

        {edit ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <ProfileInputField label="Full Name" value={form.name} onChange={set("name")} icon="👤" theme={theme} />
            <ProfileInputField label="Email Address" type="email" value={form.email} onChange={set("email")} icon="✉️" theme={theme} />
            <ProfileInputField label="Phone Number" value={form.phone} onChange={set("phone")} icon="📱" theme={theme} />
            <ProfileInputField label="Organization (Optional)" value={form.organization} onChange={set("organization")} icon="🏢" theme={theme} disabled={true} />
            <ProfileInputField label="District" value={form.district} onChange={set("district")} icon="🏘️" theme={theme} />
            <div style={{ gridColumn: "1/-1" }}>
              <ProfileInputField label="Address" value={form.address} onChange={set("address")} icon="📍" theme={theme} />
              <div style={{ marginTop: 8 }}>
                <button onClick={handleUseCurrentLocation} type="button" style={{ background: "transparent", border: "none", color: COLORS.mint, fontWeight: 700, cursor: "pointer", padding: 0 }}>📍 Use My Current Location</button>
              </div>
            </div>
            <div style={{ gridColumn: "1/-1", display: "flex", gap: 12, marginTop: 10 }}>
              <button 
                onClick={() => { setEdit(false); setProfileImage(user?.profileImage || null); setImageFile(null); }} 
                style={{ 
                  flex: 1, 
                  background: isLight ? "rgba(15,23,42,0.06)" : "rgba(255,255,255,0.05)", 
                  color: textColor, 
                  border: isLight ? "1px solid rgba(15,23,42,0.12)" : "1px solid rgba(255,255,255,0.15)", 
                  padding: "12px", 
                  borderRadius: 12, 
                  fontWeight: 700, 
                  cursor: "pointer" 
                }} 
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={loading}
                style={{ 
                  background: COLORS.mint, 
                  color: COLORS.forest, 
                  flex: 1, 
                  border: "none", 
                  padding: "12px", 
                  borderRadius: 12, 
                  fontWeight: 700, 
                  cursor: "pointer" 
                }} 
              >
                {loading ? "Saving..." : "Save Changes ✓"}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              ["✉️ Email", form.email], 
              ["📱 Phone", form.phone], 
              ["🏢 Organization", form.organization || "Independent Volunteer"],
              ["🏘️ District", form.district],
              ["📍 Address", form.address || "No address set"]
            ].map(([k, v]) => (
              <div 
                key={k} 
                style={{ 
                  background: isLight ? "rgba(15,23,42,0.03)" : "rgba(255,255,255,0.04)", 
                  borderRadius: 12, 
                  padding: "14px 16px", 
                  border: isLight ? "1px solid rgba(15,23,42,0.06)" : "none",
                  gridColumn: k === "📍 Address" ? "1/-1" : "auto"
                }}
              >
                <div style={{ fontSize: 12, color: mutedColor, marginBottom: 5 }}>{k}</div>
                <div style={{ fontSize: 14, color: textColor }}>{v}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
