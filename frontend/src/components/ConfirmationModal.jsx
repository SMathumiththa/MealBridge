import React from 'react';
import { createPortal } from 'react-dom';
import { COLORS } from '../theme';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) {
  if (!isOpen) return null;

  return createPortal(
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: 'linear-gradient(145deg, rgba(35,53,41,0.95), rgba(26,58,42,0.95))',
        border: `1px solid ${COLORS.glassBorder}`,
        borderRadius: 24, padding: '32px', width: '100%', maxWidth: 400,
        boxShadow: '0 24px 48px rgba(0,0,0,0.5)', textAlign: 'center',
        animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        <style>
          {`
            @keyframes popIn {
              0% { transform: scale(0.9); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }
          `}
        </style>
        <div style={{ 
          width: 64, height: 64, background: 'rgba(232,146,58,0.15)', border: `2px solid ${COLORS.amber}`,
          color: COLORS.amber, borderRadius: '50%', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', fontSize: 32, margin: '0 auto 24px' 
        }}>
          ?
        </div>
        <h3 style={{ color: 'white', fontSize: 22, margin: '0 0 12px', fontWeight: 700 }}>{title}</h3>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, margin: '0 0 32px', lineHeight: 1.5 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            onClick={onClose}
            style={{ 
              flex: 1, padding: '14px', background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)', color: 'white', 
              borderRadius: 12, fontWeight: 600, cursor: 'pointer', fontSize: 15,
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            style={{ 
              flex: 1, padding: '14px', background: COLORS.amber, 
              border: 'none', color: COLORS.forest, 
              borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: 15,
              boxShadow: '0 4px 12px rgba(232,146,58,0.3)', transition: 'all 0.2s'
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(232,146,58,0.4)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(232,146,58,0.3)'; }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
