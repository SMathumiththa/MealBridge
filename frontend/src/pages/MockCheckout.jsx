import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSearchParams, useNavigate } from "react-router-dom";
import { createMoneyDonation } from "../api/moneyDonation";
import toast from "react-hot-toast";
import FloatingFood from "../components/FloatingFood";

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function formatCvc(value) {
  return value.replace(/\D/g, "").slice(0, 3);
}

function generateTransactionId() {
  return "12345678";
}

function maskCardNumber(cardNumber) {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length < 4) return "****";
  return `**** **** **** ${digits.slice(-4)}`;
}

function DetailRow({ label, value, bold = false, isLight = false }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 0",
      borderBottom: isLight ? "1px solid #e2e8f0" : "1px solid rgba(255,255,255,0.08)"
    }}>
      <span style={{ color: isLight ? "#64748b" : "rgba(255,255,255,0.55)", fontSize: 14 }}>{label}</span>
      <span style={{
        color: isLight ? "#0f172a" : "#ffffff",
        fontSize: 14,
        fontWeight: bold ? 700 : 600,
        textAlign: "right",
        maxWidth: "60%"
      }}>{value}</span>
    </div>
  );
}

export default function MockCheckout({ theme = "dark" }) {
  const isLight = theme === "light";
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const amount = searchParams.get("amount");
  const requestId = searchParams.get("request_id");
  const purpose = searchParams.get("purpose") || "Donation";
  const maxAmount = Number(searchParams.get("max") || 0);

  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [step, setStep] = useState("form");
  const [receiptDetails, setReceiptDetails] = useState(null);

  const token = localStorage.getItem("token");
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!token || !user) {
      navigate("/login", { replace: true });
    }
  }, [navigate, token, user]);

  if (!token || !user) return null;

  const pageBg = isLight
    ? "linear-gradient(135deg, #f4f8f7, #dcefeb, #79cf8a)"
    : "linear-gradient(135deg, #073b65, #124b55, #167d78)";

  const cardDigits = cardNumber.replace(/\D/g, "");

  const validateForm = () => {
    if (cardDigits.length !== 16) {
      toast.error("Card number must be exactly 16 digits");
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      toast.error("Enter expiry as MM/YY");
      return false;
    }
    const [mm] = expiry.split("/").map(Number);
    if (mm < 1 || mm > 12) {
      toast.error("Invalid expiry month");
      return false;
    }
    if (cvc.length !== 3) {
      toast.error("CVC must be exactly 3 digits");
      return false;
    }
    return true;
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (maxAmount > 0 && Number(amount) > maxAmount) {
      toast.error(`Maximum donation allowed is LKR ${maxAmount.toLocaleString()}`);
      return;
    }

    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1200));

      const res = await createMoneyDonation({
        moneyRequestId: requestId,
        amount: Number(amount),
        donationMethod: "online",
        paymentStatus: "success"
      });

      const transactionId = generateTransactionId();
      const dateStr = new Date().toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
      });

      setReceiptDetails({
        amount,
        purpose,
        date: dateStr,
        transactionId,
        maskedCard: maskCardNumber(cardNumber),
        donationId: res.data?._id,
        receiptUrl: res.data?.receiptUrl
      });
      setStep("success");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Payment Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    setStep("receipt");
  };

  const getCorrectReceiptUrl = (url) => {
    if (!url) return "";
    const apiBase = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`;
    const backendOrigin = apiBase.replace("/api", "");
    return url.replace(/http:\/\/localhost:5000/g, backendOrigin);
  };

  const handleDownloadReceipt = async () => {
    if (!receiptDetails?.receiptUrl) {
      toast.error("Receipt URL not found");
      return;
    }
    
    const correctedUrl = getCorrectReceiptUrl(receiptDetails.receiptUrl);
    
    try {
      toast.loading("Downloading receipt...", { id: "downloading" });
      const response = await fetch(correctedUrl);
      if (!response.ok) throw new Error("Failed to download");
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `MealBridge_Receipt_${receiptDetails.transactionId || "donation"}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Receipt downloaded successfully!", { id: "downloading" });
    } catch (error) {
      console.error("Download failed:", error);
      window.open(correctedUrl, "_blank", "noopener,noreferrer");
      toast.success("Receipt opened in new tab", { id: "downloading" });
    }
  };

  const handlePrintReceipt = () => {
    if (!receiptDetails) return;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>MealBridge Donation Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #111; max-width: 600px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0e8a83; padding-bottom: 20px; }
            .logo { width: 50px; height: 50px; border-radius: 12px; background: #e7f5f3; color: #0e8a83; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-size: 24px; font-weight: bold; border: 2px solid #e7a93b; }
            .title { font-size: 22px; color: #17324d; margin: 0; }
            .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; font-size: 14px; }
            .row-label { color: #667788; }
            .row-val { font-weight: bold; color: #17324d; }
            .total { background: #0e8a83; color: white; padding: 15px; border-radius: 8px; margin-top: 20px; display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; }
            .thankyou { text-align: center; margin-top: 40px; font-size: 12px; color: #667788; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">M</div>
            <div class="title">MealBridge Donation Receipt</div>
            <div style="font-size: 12px; color: #667788; margin-top: 5px;">Official Receipt of Contribution</div>
          </div>
          <div class="row"><span class="row-label">Donation for</span><span class="row-val">${receiptDetails.purpose}</span></div>
          <div class="row"><span class="row-label">Date</span><span class="row-val">${receiptDetails.date}</span></div>
          <div class="row"><span class="row-label">Payment Type</span><span class="row-val">Visa / Mastercard</span></div>
          <div class="row"><span class="row-label">Card Number</span><span class="row-val">${receiptDetails.maskedCard}</span></div>
          <div class="row"><span class="row-label">Transaction ID</span><span class="row-val">${receiptDetails.transactionId}</span></div>
          <div class="row"><span class="row-label">Donation ID</span><span class="row-val">${receiptDetails.donationId?.slice(-8)?.toUpperCase() || "-"}</span></div>
          <div class="total"><span>TOTAL CONTRIBUTION</span><span>LKR ${Number(receiptDetails.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
          <div class="thankyou">
            <p>Thank you for making a difference.</p>
            <p>MealBridge | Community care, made practical</p>
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  const handleCloseReceipt = () => {
    navigate(`/donor?payment=success&request_id=${requestId}&amount=${amount}&donation_id=${receiptDetails?.donationId || ""}`);
  };

  const inputStyle = {
    width: "100%",
    padding: "16px",
    background: isLight ? "#fff" : "rgba(255,255,255,0.03)",
    border: isLight ? "1px solid rgba(15,23,42,0.12)" : "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: isLight ? "#0f172a" : "white",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    letterSpacing: cardNumber ? "0.5px" : "normal"
  };

  const labelStyle = {
    display: "block", fontSize: 11, fontWeight: 600,
    color: isLight ? "#64748b" : "#95a89b",
    marginBottom: 8, letterSpacing: "1px", textTransform: "uppercase"
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        @keyframes checkmark {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: pageBg, padding: 20, position: "relative", overflow: "hidden"
      }}>
        <FloatingFood count={16} />
        
        {step === "form" && (
          <div style={{
            background: isLight ? "rgba(255,255,255,0.98)" : "rgba(35, 53, 41, 0.4)",
            backdropFilter: "blur(20px)", border: isLight ? "1px solid rgba(15,23,42,0.08)" : "1px solid rgba(255,255,255,0.05)",
            borderRadius: "24px", padding: "48px 40px", width: "100%", maxWidth: "460px",
            boxShadow: "0 24px 48px rgba(0,0,0,0.25)", boxSizing: "border-box", position: "relative", zIndex: 1,
            animation: "fadeIn 0.3s ease"
          }}>
            <div style={{ textAlign: "center", marginBottom: 30 }}>
              <div style={{ fontSize: 13, color: "#2563eb", fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>SECURE CHECKOUT</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: isLight ? "#0f172a" : "#e8923a", marginBottom: 8 }}>Visa / Mastercard Payment</div>
              <div style={{ fontSize: 13, color: isLight ? "#64748b" : "rgba(255,255,255,0.55)", marginBottom: 12 }}>Secure online card payment (simulation mode)</div>
              <div style={{ fontSize: 15, color: isLight ? "#475569" : "rgba(255,255,255,0.7)" }}>
                Donation for: <b style={{ color: isLight ? "#0f172a" : "white" }}>{purpose}</b>
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: isLight ? "#0f172a" : "white", marginTop: 12 }}>
                LKR {Number(amount).toLocaleString()}
              </div>
            </div>

            <form onSubmit={handlePay} style={{ display: "grid", gap: 20 }}>
              <div>
                <label style={labelStyle}>Card Information</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="1234 5678 1234 5678"
                  required
                  value={cardNumber}
                  onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  style={inputStyle}
                />
                <div style={{ fontSize: 11, color: isLight ? "#94a3b8" : "rgba(255,255,255,0.4)", marginTop: 6 }}>
                  {cardDigits.length}/16 digits
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Expiry</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="MM/YY"
                    required
                    value={expiry}
                    onChange={e => setExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>CVC</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    placeholder="123"
                    required
                    value={cvc}
                    onChange={e => setCvc(formatCvc(e.target.value))}
                    maxLength={3}
                    style={inputStyle}
                  />
                  <div style={{ fontSize: 11, color: isLight ? "#94a3b8" : "rgba(255,255,255,0.4)", marginTop: 6 }}>
                    {cvc.length}/3 digits
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: 10,
                  background: loading ? "#94a3b8" : "linear-gradient(90deg, #ed9647 0%, #d87e32 100%)",
                  color: "white", border: "none", padding: "16px", fontSize: 16, fontWeight: 700,
                  borderRadius: "12px", cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 8px 20px rgba(237, 150, 71, 0.25)"
                }}
              >
                {loading ? "Processing..." : `Pay LKR ${Number(amount).toLocaleString()}`}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{ background: "transparent", color: "#d68840", border: "none", textDecoration: "underline", cursor: "pointer", fontWeight: 500, fontSize: 14 }}
              >
                Cancel and Return
              </button>
            </form>
          </div>
        )}

        {step === "success" && (
          <div style={{
            background: isLight ? "rgba(255,255,255,0.98)" : "rgba(25, 43, 31, 0.65)",
            backdropFilter: "blur(25px)", border: isLight ? "1px solid rgba(15,23,42,0.08)" : "1px solid rgba(34, 197, 94, 0.25)",
            borderRadius: "24px", padding: "44px 36px", width: "100%", maxWidth: "460px",
            boxShadow: "0 24px 48px rgba(0,0,0,0.3)", boxSizing: "border-box", position: "relative", zIndex: 1,
            textAlign: "center", animation: "fadeIn 0.3s ease",
            color: isLight ? "#0f172a" : "#ffffff"
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #22c55e, #16a34a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px", fontSize: 36, color: "white", fontWeight: 700,
              boxShadow: "0 10px 25px rgba(22, 163, 74, 0.4)",
              animation: "checkmark 0.5s ease forward"
            }}>✓</div>
            
            <h2 style={{ margin: "0 0 8px", color: isLight ? "#0f172a" : "#4ade80", fontSize: 24, fontWeight: 800 }}>Payment Successful!</h2>
            <p style={{ margin: "0 0 28px", color: isLight ? "#64748b" : "rgba(255,255,255,0.7)", fontSize: 14 }}>
              Thank you! Your donation was processed successfully.
            </p>

            <div style={{
              background: isLight ? "#f8fafc" : "rgba(255,255,255,0.03)",
              border: isLight ? "1px solid #e2e8f0" : "1px solid rgba(255,255,255,0.06)",
              borderRadius: "16px",
              padding: "8px 18px",
              marginBottom: 32,
              textAlign: "left"
            }}>
              <DetailRow label="Donation for:" value={receiptDetails?.purpose} isLight={isLight} />
              <DetailRow label="Amount Paid:" value={`LKR ${Number(receiptDetails?.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} bold isLight={isLight} />
              <DetailRow label="Transaction ID:" value={receiptDetails?.transactionId} isLight={isLight} />
            </div>

            <button
              onClick={handleDone}
              style={{
                width: "100%", background: isLight ? "#0f172a" : "linear-gradient(90deg, #ed9647 0%, #d87e32 100%)",
                color: "white", border: "none",
                padding: "16px 20px", borderRadius: "12px", fontSize: 16, fontWeight: 700,
                cursor: "pointer", letterSpacing: "0.5px",
                boxShadow: isLight ? "none" : "0 8px 20px rgba(237, 150, 71, 0.25)"
              }}
            >
              Done
            </button>
          </div>
        )}

        {step === "receipt" && (
          <div style={{
            background: isLight ? "#ffffff" : "rgba(30, 41, 59, 0.75)",
            backdropFilter: "blur(25px)", border: isLight ? "1px solid #e2e8f0" : "1px solid rgba(255,255,255,0.1)",
            borderRadius: "24px", padding: "36px 32px", width: "100%", maxWidth: "480px",
            boxShadow: "0 24px 50px rgba(0,0,0,0.3)", boxSizing: "border-box", position: "relative", zIndex: 1,
            animation: "fadeIn 0.35s ease",
            color: isLight ? "#0f172a" : "#ffffff"
          }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{
                width: 56, height: 56, borderRadius: "16px",
                background: "linear-gradient(135deg, #e7f5f3, #c9eee8)",
                color: "#0e8a83", display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 12px", fontSize: 24, fontWeight: 800,
                border: "2px solid #e7a93b",
                boxShadow: "0 4px 12px rgba(14, 138, 131, 0.15)"
              }}>M</div>
              <div style={{ color: isLight ? "#17324d" : "#7bcbc4", fontSize: 12, fontWeight: 800, letterSpacing: 1.5, marginBottom: 4 }}>MEALBRIDGE</div>
              <h2 style={{ margin: 0, color: isLight ? "#0f172a" : "#ffffff", fontSize: 22, fontWeight: 700 }}>Donation Receipt</h2>
              <p style={{ margin: "4px 0 0", color: isLight ? "#64748b" : "rgba(255,255,255,0.6)", fontSize: 13 }}>Official Statement of Contribution</p>
            </div>

            <div style={{
              background: isLight ? "#fafafa" : "rgba(15, 23, 42, 0.25)",
              border: isLight ? "1px dashed #cbd5e1" : "1px dashed rgba(255,255,255,0.15)",
              borderRadius: "14px",
              padding: "16px 20px",
              marginBottom: 28
            }}>
              <DetailRow label="Donation for" value={receiptDetails?.purpose} isLight={isLight} />
              <DetailRow label="Date" value={receiptDetails?.date} isLight={isLight} />
              <DetailRow label="Amount Paid" value={`LKR ${Number(receiptDetails?.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} bold isLight={isLight} />
              <DetailRow label="Payment type" value="Visa / Mastercard" isLight={isLight} />
              <DetailRow label="Card Number" value={receiptDetails?.maskedCard} isLight={isLight} />
              <DetailRow label="Transaction ID" value={receiptDetails?.transactionId} isLight={isLight} />
              <DetailRow label="Donation ID" value={receiptDetails?.donationId?.slice(-8)?.toUpperCase() || "-"} isLight={isLight} />
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              <button
                onClick={handleDownloadReceipt}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  width: "100%", background: "#0e8a83", color: "white", border: "none",
                  padding: "14px 20px", borderRadius: "10px", fontSize: 15, fontWeight: 700,
                  cursor: "pointer", boxShadow: "0 6px 15px rgba(14, 138, 131, 0.2)"
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Receipt PDF
              </button>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <button
                  onClick={handlePrintReceipt}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    background: isLight ? "#f1f5f9" : "rgba(255,255,255,0.08)",
                    color: isLight ? "#475569" : "#cbd5e1",
                    border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(255,255,255,0.1)",
                    padding: "12px 14px", borderRadius: "10px", fontSize: 14, fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                  Print
                </button>

                <button
                  onClick={handleCloseReceipt}
                  style={{
                    background: isLight ? "#64748b" : "#334155", color: "white", border: "none",
                    padding: "12px 14px", borderRadius: "10px", fontSize: 14, fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
