import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { createMoneyDonation } from "../api/moneyDonation";
import ChatWidget from "./ChatWidget";
import CustomPaymentGateway from "./CustomPaymentGateway";
import { COLORS } from "../theme";
import toast from "react-hot-toast";

const PAYMENT_METHODS = [
  {
    id: "online",
    icon: "💳",
    title: "Online Card Payment",
    subtitle: "Visa / Mastercard — Instant & secure"
  },
  {
    id: "qr",
    icon: "▦",
    title: "QR Payment",
    subtitle: "Scan NGO QR and upload receipt"
  },
  {
    id: "bank_transfer",
    icon: "🏦",
    title: "Bank Transfer",
    subtitle: "Transfer to the NGO bank account"
  },
  {
    id: "cash_handover",
    icon: "🤝",
    title: "Cash Handover",
    subtitle: "Arrange a direct handover with the NGO"
  }
];

const METHOD_LABELS = {
  online: "Online Card",
  bank_transfer: "Bank Transfer",
  cash_handover: "Cash Hand Over"
};

const CHAT_METHODS = [];

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <span style={{ color: "rgba(255,255,255,0.55)" }}>{label}</span>
      <span style={{ color: "white", fontWeight: 600, textAlign: "right" }}>{value}</span>
    </div>
  );
}

export default function DonationCheckoutModal({ open, onClose, fundraiser, onSuccess, onOnlinePay, currentUserId }) {
  const [step, setStep] = useState("amount");
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [donorNote, setDonorNote] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [pendingConfirmation, setPendingConfirmation] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptBlobUrl, setReceiptBlobUrl] = useState(null);

  useEffect(() => {
    if (showReceipt && confirmation?.donation?.receiptUrl) {
      fetch(confirmation.donation.receiptUrl)
        .then(res => res.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          setReceiptBlobUrl(url);
        })
        .catch(err => {
          console.error("Error fetching receipt for iframe:", err);
          setReceiptBlobUrl(confirmation.donation.receiptUrl);
        });
    }
    
    return () => {
      if (receiptBlobUrl && receiptBlobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(receiptBlobUrl);
      }
    };
  }, [showReceipt, confirmation?.donation?.receiptUrl]);

  if (!open || !fundraiser) return null;

  const ngo = fundraiser.ngoId || {};
  const settings = ngo.donationSettings || {};
  const remainingAmount = Math.max(0, Number(fundraiser.amountNeeded || 0) - Number(fundraiser.amountRaised || 0));
  const goalReached = remainingAmount <= 0;

  const resetAndClose = () => {
    setStep("amount");
    setAmount("");
    setSelectedMethod(null);
    setDonorNote("");
    setReceiptFile(null);
    setShowChat(false);
    setConfirmation(null);
    setPendingConfirmation(null);
    setShowReceipt(false);
    onClose();
  };

  const validateAmount = () => {
    if (goalReached) {
      toast.error("This fundraiser goal is already fully funded");
      return false;
    }
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return false;
    }
    if (Number(amount) > remainingAmount) {
      toast.error(`Maximum donation is LKR ${remainingAmount.toLocaleString()} (remaining to goal)`);
      return false;
    }
    return true;
  };

  const handleSelectMethod = (methodId) => {
    if (!validateAmount()) return;
    setSelectedMethod(methodId);
    setShowChat(false);
    setStep(methodId === "online" || methodId === "qr" ? "custom_checkout" : "details");
  };

  const handleOnlinePay = () => {
    if (!validateAmount()) return;
    setPendingConfirmation({ method: "online", action: "redirect" });
  };



  const handleSubmitPending = async (method) => {
    if (!validateAmount()) return;

    if (method === "bank_transfer" && !receiptFile) {
      toast.error("Please upload your payment receipt");
      return;
    }

    setPendingConfirmation({ method });
  };

  const confirmPendingDonation = async () => {
    const method = pendingConfirmation?.method;
    if (!method) return;
    setPendingConfirmation(null);
    if (pendingConfirmation.action === "redirect") {
      onOnlinePay({
        amount,
        requestId: fundraiser._id,
        purpose: fundraiser.purpose,
        maxAmount: remainingAmount
      });
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("moneyRequestId", fundraiser._id);
      fd.append("amount", Number(amount));
      fd.append("donationMethod", method);
      fd.append("donorNote", donorNote.trim());
      if (receiptFile) fd.append("receipt", receiptFile);

      const res = await createMoneyDonation(fd);
      setConfirmation({
        donation: res?.data,
        method,
        pending: true
      });
      onSuccess?.(res?.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit donation");
    } finally {
      setLoading(false);
    }
  };

  const methodLabel = METHOD_LABELS[pendingConfirmation?.method] || "Payment";

  const renderBankDetails = () => (
    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 16, marginBottom: 16, textAlign: "left" }}>
      <div style={{ fontSize: 12, color: COLORS.amber, fontWeight: 700, marginBottom: 10, letterSpacing: "0.5px" }}>BANK TRANSFER DETAILS</div>
      <InfoRow label="Bank" value={settings.bankName} />
      <InfoRow label="Account No." value={settings.accountNumber} />
      <InfoRow label="Branch" value={settings.branch} />
      <InfoRow label="SWIFT (Foreign)" value={settings.swift} />
      {!settings.bankName && !settings.accountNumber && (
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: "8px 0 0" }}>
          NGO has not added bank details yet. Use chat below to contact them.
        </p>
      )}
    </div>
  );

  const renderReceiptUpload = () => (
    <div style={{ marginBottom: 16, textAlign: "left" }}>
      <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 8, fontWeight: 600 }}>
        Upload Payment Receipt *
      </label>
      <input
        type="file"
        accept="image/*,.pdf"
        onChange={e => setReceiptFile(e.target.files?.[0] || null)}
        style={{ width: "100%", color: "white", fontSize: 13 }}
      />
      {receiptFile && <div style={{ fontSize: 12, color: COLORS.mint, marginTop: 6 }}>{receiptFile.name}</div>}
    </div>
  );

  const renderAppChat = () => (
    <div style={{ marginBottom: 16, textAlign: "left" }}>
      {!showChat ? (
        <button
          type="button"
          onClick={() => setShowChat(true)}
          style={{
            width: "100%",
            background: "rgba(126, 200, 160, 0.12)",
            color: COLORS.mint,
            border: `1px solid ${COLORS.mint}55`,
            padding: "12px 16px",
            borderRadius: 12,
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 14
          }}
        >
          💬 Chat with NGO in App
        </button>
      ) : (
        <ChatWidget
          moneyRequestId={fundraiser._id}
          currentUserId={currentUserId}
          otherUserId={ngo._id}
          compact
          title={`Chat with ${ngo.name || "NGO"}`}
        />
      )}
    </div>
  );

  const renderDetails = () => {
    const method = selectedMethod;

    if (method === "online") {
      return (
        <>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, margin: "0 0 20px" }}>
            Pay securely with Visa or Mastercard. Payment is processed instantly.
          </p>
          <button
            onClick={handleOnlinePay}
            style={{ width: "100%", background: "linear-gradient(90deg, #ed9647, #d87e32)", color: "white", padding: 16, border: "none", borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: "pointer" }}
          >
            Continue to Card Payment — LKR {Number(amount).toLocaleString()}
          </button>
        </>
      );
    }

    if (method === "bank_transfer") {
      return (
        <>
          {renderBankDetails()}
          {renderReceiptUpload()}
          <textarea
            placeholder="Optional note (reference number, date...)"
            value={donorNote}
            onChange={e => setDonorNote(e.target.value)}
            rows={2}
            style={{ width: "100%", padding: 12, marginBottom: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "white", fontSize: 13, boxSizing: "border-box", fontFamily: "inherit" }}
          />
          {renderAppChat()}
          <button disabled={loading} onClick={() => handleSubmitPending("bank_transfer")} style={{ width: "100%", background: COLORS.mint, color: COLORS.forest, padding: 16, border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>
            {loading ? "Submitting..." : "I've Transferred — Submit Receipt"}
          </button>
        </>
      );
    }

    if (method === "cash_handover") {
      return (
        <>
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 16, marginBottom: 16, textAlign: "left" }}>
            <div style={{ fontSize: 12, color: COLORS.amber, fontWeight: 700, marginBottom: 10 }}>MEET THE NGO</div>
            <InfoRow label="Organization" value={ngo.organization || ngo.name} />
            <InfoRow label="Phone" value={ngo.phone} />
            <InfoRow label="Office Address" value={settings.officeAddress} />
          </div>
          <textarea
            placeholder="When & where can you hand over? (optional)"
            value={donorNote}
            onChange={e => setDonorNote(e.target.value)}
            rows={2}
            style={{ width: "100%", padding: 12, marginBottom: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "white", fontSize: 13, boxSizing: "border-box", fontFamily: "inherit" }}
          />
          {renderAppChat()}
          <button disabled={loading} onClick={() => handleSubmitPending("cash_handover")} style={{ width: "100%", background: "rgba(126,200,160,0.2)", color: COLORS.mint, padding: 16, border: `1px solid ${COLORS.mint}`, borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>
            {loading ? "Submitting..." : "Request Cash Handover"}
          </button>
        </>
      );
    }



    return null;
  };

  if (step === "custom_checkout" && !confirmation) {
    return createPortal(
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 999999, display: "flex", alignItems: "center", justifyContent: "center", padding: 40, boxSizing: "border-box", overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 850 }}>
          <CustomPaymentGateway 
            amount={amount} 
            qrCodeImage={settings.qrCodeImage}
            initialMethod={selectedMethod}
            onChangeAmount={() => setStep("amount")}
            onCancel={resetAndClose}
            onPay={async (method, receiptFile) => {
              try {
                const data = method === "qr" ? (() => {
                  const fd = new FormData();
                  fd.append("moneyRequestId", fundraiser._id);
                  fd.append("amount", Number(amount));
                  fd.append("donationMethod", "qr_payment");
                  fd.append("receipt", receiptFile);
                  return fd;
                })() : { moneyRequestId: fundraiser._id, amount: Number(amount), donationMethod: "online", paymentStatus: "success" };
                const res = await createMoneyDonation(data);
                setConfirmation({
                  donation: res?.data,
                  method,
                  pending: method === "qr"
                });
                onSuccess?.(res?.data);
              } catch (err) {
                toast.error(err?.response?.data?.message || "Payment failed");
              }
            }} 
          />
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 999999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, boxSizing: "border-box" }}>
      <div style={{
        background: "linear-gradient(160deg, rgba(35,53,41,0.97), rgba(26,58,42,0.98))",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 24,
        width: "100%",
        maxWidth: step === "method" ? 520 : showChat && CHAT_METHODS.includes(selectedMethod) ? 520 : 480,
        maxHeight: "92vh",
        overflowY: "auto",
        padding: "32px 28px",
        boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
        boxSizing: "border-box"
      }}>
        {pendingConfirmation ? (
          <div style={{ textAlign: "center", padding: "12px 4px 8px" }}>
            <div style={{ width: 68, height: 68, borderRadius: "50%", background: "rgba(232,146,58,0.16)", border: `2px solid ${COLORS.amber}`, color: COLORS.amber, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 30 }}>✓</div>
            <div style={{ color: COLORS.amber, fontSize: 11, fontWeight: 800, letterSpacing: 2, marginBottom: 9 }}>CONFIRM DONATION</div>
            <h2 style={{ color: "white", margin: "0 0 10px", fontSize: 25 }}>Ready to complete your donation?</h2>
            <p style={{ color: "rgba(255,255,255,0.62)", margin: "0 0 22px", fontSize: 14, lineHeight: 1.6 }}>You are donating this amount through {methodLabel.toLowerCase()}.</p>
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: "16px 18px", marginBottom: 22 }}>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, marginBottom: 5 }}>TOTAL DONATION</div>
              <div style={{ color: COLORS.amber, fontSize: 30, fontWeight: 800 }}>LKR {Number(amount).toLocaleString()}</div>
              <div style={{ color: "white", fontSize: 13, marginTop: 8 }}>{methodLabel}</div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setPendingConfirmation(null)} style={{ flex: 1, background: "rgba(255,255,255,0.07)", color: "white", border: "1px solid rgba(255,255,255,0.16)", padding: "14px 12px", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>Go Back</button>
              <button onClick={confirmPendingDonation} style={{ flex: 1.35, background: COLORS.amber, color: COLORS.forest, border: "none", padding: "14px 12px", borderRadius: 12, fontWeight: 800, cursor: "pointer" }}>Confirm Donation</button>
            </div>
          </div>
        ) : confirmation ? (
          <div style={{ textAlign: "center", padding: "18px 4px 8px" }}>
            <div style={{ width: 68, height: 68, borderRadius: 20, background: confirmation.pending ? "rgba(232,146,58,0.18)" : "rgba(126,200,160,0.18)", border: `2px solid ${confirmation.pending ? COLORS.amber : COLORS.mint}`, color: confirmation.pending ? COLORS.amber : COLORS.mint, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28, fontWeight: 800 }}>
              {confirmation.pending ? "⌛" : "✓"}
            </div>
            
            <div style={{ color: COLORS.amber, fontSize: 12, fontWeight: 800, letterSpacing: 2, marginBottom: 8 }}>MEALBRIDGE</div>
            <h2 style={{ color: "white", margin: "0 0 8px", fontSize: 25 }}>
              {confirmation.pending ? "Payment Submitted!" : "Payment Success!"}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.62)", margin: "0 0 22px", fontSize: 14, lineHeight: 1.6 }}>
              {confirmation.pending ? "Your payment details were sent to the NGO. They will verify and confirm your donation." : "Your donation was completed successfully. Your receipt has been sent to your email."}
            </p>
            
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "8px 16px", textAlign: "left", marginBottom: 20 }}>
              <InfoRow label="Amount" value={`LKR ${Number(confirmation.donation?.amount || amount).toLocaleString()}`} />
              <InfoRow label="Ref Number" value={`#${confirmation.donation?._id?.substring(0, 8) || "PENDING"}`} />
              <InfoRow label="Payment method" value={confirmation.method === "qr" ? "QR Payment" : confirmation.method === "paypal" ? "PayPal" : "Online Card"} />
              <InfoRow label="Campaign" value={fundraiser.purpose} />
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
              <button onClick={resetAndClose} style={{ flex: 1, background: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,255,255,0.16)", padding: "14px 16px", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>
                Done
              </button>
              
              {confirmation.donation?.receiptUrl && (
                <button onClick={() => setShowReceipt(true)} style={{ flex: 1.5, background: COLORS.mint, color: COLORS.forest, border: "none", padding: "14px 16px", borderRadius: 12, fontWeight: 800, cursor: "pointer" }}>
                  View Receipt
                </button>
              )}
            </div>
          </div>
        ) : <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: COLORS.amber, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>DONATE NOW</div>
          <h2 style={{ color: "white", margin: "0 0 8px", fontSize: 24 }}>{fundraiser.purpose}</h2>
          <p style={{ color: "rgba(255,255,255,0.55)", margin: 0, fontSize: 13 }}>
            by {ngo.name || "Verified NGO"} • Goal LKR {fundraiser.amountNeeded?.toLocaleString()}
          </p>
          <p style={{ color: goalReached ? "#f87171" : COLORS.mint, margin: "8px 0 0", fontSize: 13, fontWeight: 600 }}>
            {goalReached ? "Goal fully funded" : `Remaining: LKR ${remainingAmount.toLocaleString()}`}
          </p>
        </div>}

        {!confirmation && step === "amount" && (
          <>
            <input
              type="number"
              min="1"
              max={goalReached ? undefined : remainingAmount}
              placeholder={goalReached ? "Goal reached" : `Max LKR ${remainingAmount.toLocaleString()}`}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              disabled={goalReached}
              style={{ width: "100%", padding: 16, marginBottom: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "white", fontSize: 18, fontWeight: 600, textAlign: "center", boxSizing: "border-box" }}
            />
            {!goalReached && (
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "0 0 12px", textAlign: "center" }}>
                You can donate up to LKR {remainingAmount.toLocaleString()}
              </p>
            )}
            <button
              onClick={() => validateAmount() && setStep("method")}
              disabled={goalReached}
              style={{ width: "100%", background: COLORS.amber, color: COLORS.forest, padding: 16, border: "none", borderRadius: 12, fontWeight: 800, fontSize: 16, cursor: "pointer" }}
            >
              Choose Payment Method →
            </button>
          </>
        )}

        {!confirmation && step === "method" && (
          <>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 14, textAlign: "center" }}>
              Donating <b style={{ color: "white" }}>LKR {Number(amount).toLocaleString()}</b> — choose how to pay
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {PAYMENT_METHODS.map(m => (
                <button
                  key={m.id}
                  onClick={() => handleSelectMethod(m.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    width: "100%",
                    textAlign: "left",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 14,
                    padding: "14px 16px",
                    cursor: "pointer",
                    color: "white"
                  }}
                >
                  <span style={{ fontSize: 28 }}>{m.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{m.title}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>{m.subtitle}</div>
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.35)" }}>›</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep("amount")} style={{ display: "block", margin: "16px auto 0", background: "none", border: "none", color: COLORS.amber, cursor: "pointer", fontSize: 13 }}>
              ← Change amount
            </button>
          </>
        )}

        {!confirmation && step === "details" && (
          <>
            <div style={{ fontSize: 12, color: COLORS.mint, fontWeight: 700, marginBottom: 16, textAlign: "center" }}>
              {METHOD_LABELS[selectedMethod]} • LKR {Number(amount).toLocaleString()}
            </div>
            {renderDetails()}
            <button onClick={() => { setStep("method"); setShowChat(false); }} style={{ display: "block", margin: "16px auto 0", background: "none", border: "none", color: COLORS.amber, cursor: "pointer", fontSize: 13 }}>
              ← Choose different method
            </button>
          </>
        )}

        {!confirmation && <button onClick={resetAndClose} style={{ display: "block", margin: "20px auto 0", background: "none", border: "none", color: "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: 13, textDecoration: "underline" }}>
          Cancel
        </button>}
      </div>

      {showReceipt && confirmation?.donation?.receiptUrl && createPortal(
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 9999999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, boxSizing: "border-box" }} onClick={() => setShowReceipt(false)}>
          <div style={{ background: "#f8fafc", padding: 16, borderRadius: 16, width: "100%", maxWidth: 800, height: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 25px 60px rgba(0,0,0,0.5)", overflow: "hidden" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, padding: "0 8px" }}>
              <h3 style={{ color: "#111", margin: 0, fontSize: 18, fontWeight: 700 }}>🧾 Your Donation Receipt</h3>
              <button onClick={() => setShowReceipt(false)} style={{ background: "rgba(15,23,42,0.1)", border: "none", color: "#111", fontSize: 20, width: 36, height: 36, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
            <div style={{ flex: 1, overflow: "hidden", borderRadius: 12, border: "1px solid rgba(15,23,42,0.1)", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {receiptBlobUrl ? (
                <iframe src={receiptBlobUrl} style={{ width: "100%", height: "100%", border: "none" }} title="Receipt Document" />
              ) : (
                <div style={{ color: "#6b7280" }}>Loading receipt...</div>
              )}
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button onClick={() => setShowReceipt(false)} style={{ background: "rgba(15,23,42,0.06)", color: "#111", border: "none", padding: "12px 24px", borderRadius: 12, fontWeight: 600, cursor: "pointer" }}>Close</button>
              <a href={confirmation.donation.receiptUrl} download={`Donation_Receipt_${confirmation.donation._id}.pdf`} target="_blank" rel="noreferrer" style={{ background: COLORS.mint, color: COLORS.forest, textDecoration: "none", padding: "12px 24px", borderRadius: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                ⬇ Download PDF
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>,
    document.body
  );
}

export { METHOD_LABELS, PAYMENT_METHODS };
