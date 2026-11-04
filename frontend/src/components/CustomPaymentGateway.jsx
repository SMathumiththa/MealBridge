import VisaCardPreview from './VisaCardPreview';
import { useState } from 'react';
import { COLORS } from '../theme';

export default function CustomPaymentGateway({ amount, onPay, onCancel, onChangeAmount, qrCodeImage, initialMethod = 'online' }) {
  const [selectedMethod, setSelectedMethod] = useState(
    initialMethod === 'qr' && qrCodeImage ? 'qr' : initialMethod === 'paypal' ? 'paypal' : 'card'
  );
  const [cardNo, setCardNo] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [qrReceipt, setQrReceipt] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handlePay = () => {
    const canPay = selectedMethod !== "card" || (cardNo.replace(/\s/g, "").length === 16 && expiry && cvv.length >= 3);
    if (!canPay || (selectedMethod === "qr" && !qrReceipt)) return;
    
    setShowConfirmation(true);
  };

  const confirmPayment = () => {
    setShowConfirmation(false);
    setIsProcessing(true);
    // Simulation mode
    setTimeout(() => {
      setIsProcessing(false);
      onPay(selectedMethod, qrReceipt);
    }, 2000);
  };

  const methods = [
    { id: 'card', name: 'Visa Card', icon: '💳' },
    { id: 'paypal', name: 'PayPal', icon: '🅿️' },
    { id: 'qr', name: 'QR Payment', icon: '▦' },
  ];

  return (
    <div style={{ position: 'relative', display: 'flex', width: '100%', minHeight: 540, background: 'linear-gradient(145deg, #10271d, #1d3d2c)', borderRadius: 28, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.45)' }}>
      {showConfirmation && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 5, display: 'grid', placeItems: 'center', padding: 24, background: 'rgba(8, 20, 14, 0.94)' }}>
          <div style={{ width: '100%', maxWidth: 420, padding: '30px 26px', textAlign: 'center', background: 'linear-gradient(160deg, #203b2c, #14291e)', border: `1px solid ${COLORS.mint}55`, borderRadius: 20, boxShadow: '0 24px 60px rgba(0,0,0,0.45)' }}>
            <div style={{ width: 58, height: 58, margin: '0 auto 16px', display: 'grid', placeItems: 'center', borderRadius: '50%', background: `${COLORS.amber}22`, border: `2px solid ${COLORS.amber}`, color: COLORS.amber, fontSize: 26 }}>✓</div>
            <div style={{ color: COLORS.amber, fontSize: 11, fontWeight: 800, letterSpacing: 2, marginBottom: 8 }}>CONFIRM PAYMENT</div>
            <h2 style={{ color: 'white', fontSize: 24, margin: '0 0 10px' }}>Ready to pay?</h2>
            <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: 14, lineHeight: 1.6, margin: '0 0 20px' }}>Please review your payment amount before continuing.</p>
            <div style={{ padding: '14px 16px', marginBottom: 22, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14 }}>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, letterSpacing: 1 }}>TOTAL</div>
              <div style={{ color: COLORS.amber, fontSize: 29, fontWeight: 800, marginTop: 4 }}>LKR {Number(amount).toLocaleString()}</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowConfirmation(false)} style={{ flex: 1, padding: '13px 12px', background: 'rgba(255,255,255,0.07)', color: 'white', border: '1px solid rgba(255,255,255,0.16)', borderRadius: 11, fontWeight: 700, cursor: 'pointer' }}>Go Back</button>
              <button onClick={confirmPayment} style={{ flex: 1.3, padding: '13px 12px', background: COLORS.amber, color: COLORS.forest, border: 'none', borderRadius: 11, fontWeight: 800, cursor: 'pointer' }}>Confirm Payment</button>
            </div>
          </div>
        </div>
      )}
      
      {/* LEFT COLUMN: Payment Methods */}
      <div style={{ width: '40%', padding: '32px 24px', borderRight: `1px solid ${COLORS.glassBorder}`, background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 600, marginBottom: 8, cursor: 'pointer' }} onClick={onChangeAmount}>
          ← Change Amount
        </div>
        <h2 style={{ color: 'white', fontSize: 24, margin: '0 0 24px 0' }}>Checkout</h2>
        
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 16 }}>Select Payment method</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {methods.filter(m => m.id !== 'qr' || qrCodeImage).map(m => (
            <div 
              key={m.id}
              onClick={() => setSelectedMethod(m.id)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px', borderRadius: 12, cursor: 'pointer',
                background: selectedMethod === m.id ? 'rgba(126,200,160,0.16)' : 'rgba(255,255,255,0.025)',
                border: selectedMethod === m.id ? `1px solid ${COLORS.mint}` : '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'white', fontWeight: 600, fontSize: 15 }}>
                <span style={{ fontSize: 20 }}>{m.icon}</span>
                {m.name}
              </div>
              <span style={{ color: selectedMethod === m.id ? COLORS.mint : 'rgba(255,255,255,0.3)' }}>›</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: Card Details */}
      <div style={{ width: '60%', padding: '32px 40px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ color: 'white', fontSize: 20, margin: '0 0 24px 0' }}>Payment details</h2>
        
        {selectedMethod === 'qr' ? (
          <div style={{ display: 'grid', placeItems: 'center', minHeight: 200, marginBottom: 32, padding: 20, background: 'rgba(255,255,255,0.96)', borderRadius: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#17324d', fontSize: 13, fontWeight: 800, marginBottom: 10 }}>SCAN NGO QR TO PAY</div>
              <img src={qrCodeImage} alt="NGO payment QR code" style={{ width: 220, height: 220, objectFit: 'contain', borderRadius: 12 }} />
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: 20 }}>
            <VisaCardPreview
              cardNumber={cardNo ? (cardNo.length >= 16 ? cardNo : cardNo + " •••• •••• ••••".slice(cardNo.length)) : "••••  ••••  ••••  ••••"}
              expiry={expiry || "04/24"}
            />
          </div>
        )}

        {/* Input Fields */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {selectedMethod === 'qr' ? (
            <>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>Scan the NGO QR code, complete payment, then upload your payment receipt.</p>
              <input type="file" accept="image/*,.pdf" onChange={(e) => setQrReceipt(e.target.files?.[0] || null)} style={{ color: 'white', fontSize: 13 }} />
              {qrReceipt && <span style={{ color: COLORS.mint, fontSize: 12 }}>{qrReceipt.name}</span>}
            </>
          ) : selectedMethod === 'paypal' ? (
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>Pay securely through PayPal sandbox checkout.</p>
          ) : (<>
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 6 }}>Enter card no</label>
            <input 
              type="text" 
              maxLength={19}
              placeholder="0000 0000 0000 0000"
              value={cardNo}
              onChange={(e) => setCardNo(formatCardNumber(e.target.value))}
              style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: 10, color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 6 }}>Card holder name</label>
            <input 
              type="text" 
              placeholder="John Doe"
              value={cardName}
              onChange={(e) => setCardName(e.target.value.toUpperCase())}
              style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: 10, color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 6 }}>Expiry Date</label>
              <input 
                type="text" 
                placeholder="MM/YY"
                maxLength={5}
                value={expiry}
                onChange={(e) => {
                   let val = e.target.value.replace(/[^0-9]/g, '');
                   if (val.length > 2) val = val.substring(0,2) + '/' + val.substring(2,4);
                   setExpiry(val);
                }}
                style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: 10, color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box', textAlign: 'center' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 6 }}>CVV</label>
              <input 
                type="password" 
                placeholder="•••"
                maxLength={4}
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: 10, color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box', textAlign: 'center' }}
              />
            </div>
          </div>
          </>)}
        </div>

        <div style={{ marginTop: 32, display: 'flex', gap: 16 }}>
          <button 
            onClick={onCancel}
            style={{ padding: '16px 24px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 15, fontWeight: 600 }}
          >
            Cancel
          </button>
          <button 
            onClick={handlePay}
            disabled={isProcessing || (selectedMethod === 'card' && (cardNo.replace(/\s/g, '').length < 16 || !cardName || !expiry || cvv.length < 3)) || (selectedMethod === 'qr' && !qrReceipt)}
            style={{ 
              flex: 1, padding: '16px', background: isProcessing ? 'rgba(255,255,255,0.2)' : COLORS.amber, 
              color: isProcessing ? 'white' : COLORS.forest, border: 'none', borderRadius: 12, 
              fontWeight: 800, fontSize: 16, cursor: isProcessing ? 'wait' : 'pointer',
              boxShadow: isProcessing ? 'none' : '0 8px 24px rgba(232,146,58,0.3)',
              transition: 'all 0.3s'
            }}
          >
            {isProcessing ? 'Processing Payment...' : selectedMethod === 'paypal' ? `Pay with PayPal — LKR ${Number(amount).toLocaleString()}` : selectedMethod === 'qr' ? 'Continue with QR Payment' : `Pay LKR ${Number(amount).toLocaleString()}`}
          </button>
        </div>

      </div>
    </div>
  );
}
