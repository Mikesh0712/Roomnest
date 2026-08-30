import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Phone, User, ShieldCheck } from 'lucide-react';

const ROLE_CONFIG = {
  tenant:  { emoji: '🏠', label: 'Tenant', desc: 'Find & book rooms', color: 'var(--teal)' },
  owner:   { emoji: '🏢', label: 'Owner', desc: 'List your property', color: 'var(--amber-dark)' },
  broker:  { emoji: '🤝', label: 'Broker', desc: 'Manage portfolio', color: '#7c3aed' },
};

const DEMO_USERS = {
  tenant: { name: 'Arjun Sharma', phone: '+91 98765 43210', email: 'arjun@example.com' },
  owner:  { name: 'Subhashish Mohanty', phone: '+91 94370 12345', email: 'subhashish@example.com' },
  broker: { name: 'Priya Dash', phone: '+91 76543 21098', email: 'priya@example.com' },
};

export const AuthModal = () => {
  const { authModalOpen, setAuthModalOpen, setCurrentUser, setCurrentRole, showToast } = useApp();

  const [step, setStep] = useState('role'); // 'role' | 'phone' | 'otp'
  const [selectedRole, setSelectedRole] = useState('tenant');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');

  if (!authModalOpen) return null;

  const handleClose = () => { setAuthModalOpen(false); setStep('role'); };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) { showToast('⚠️ Enter a valid 10-digit phone number'); return; }
    setStep('otp');
    showToast('📩 Demo OTP: 1234');
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (otp !== '1234') { showToast('❌ Incorrect OTP. Try 1234'); return; }
    const demo = DEMO_USERS[selectedRole];
    const userData = { name: name || demo.name, phone, email: demo.email, role: selectedRole };
    setCurrentUser(userData);
    setCurrentRole(selectedRole);
    setAuthModalOpen(false);
    setStep('role');
    showToast(`🎉 Welcome, ${userData.name.split(' ')[0]}! Signed in as ${selectedRole}.`);
  };

  return (
    <div className="rn-modal-overlay" onClick={handleClose}>
      <div className="rn-modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '28px 28px 24px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src="/logo.png" alt="RoomNest" style={{ width: 40, height: 40, borderRadius: 10 }} />
              <div>
                <h3 style={{ fontFamily: 'var(--font-h)', fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>Sign In to RoomNest</h3>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Hyperlocal Rental & Relocation Platform</p>
              </div>
            </div>
            <button className="rn-modal-close" onClick={handleClose} style={{ flexShrink: 0 }}><X size={16} /></button>
          </div>

          {/* Step 1: Role Select */}
          {step === 'role' && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-sec)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>I am signing in as a...</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
                {Object.entries(ROLE_CONFIG).map(([key, cfg]) => (
                  <button key={key} type="button" onClick={() => setSelectedRole(key)}
                    style={{
                      padding: '16px 8px', borderRadius: 12, border: '2px solid', cursor: 'pointer',
                      textAlign: 'center', transition: 'all 0.15s',
                      borderColor: selectedRole === key ? cfg.color : 'var(--border-col)',
                      background: selectedRole === key ? `${cfg.color}15` : 'var(--surface-2)',
                    }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{cfg.emoji}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: selectedRole === key ? cfg.color : 'var(--text-primary)' }}>{cfg.label}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{cfg.desc}</div>
                  </button>
                ))}
              </div>
              <button className="rn-signin-btn" style={{ width: '100%', justifyContent: 'center', fontSize: 14, padding: '13px', marginBottom: 16 }}
                onClick={() => setStep('phone')}>
                Continue with Mobile OTP →
              </button>

              {/* ⚡ 1-Click Quick Demo Sign In */}
              <div style={{ borderTop: '1px solid var(--border-col)', paddingTop: 16, marginTop: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>⚡ 1-Click Quick Hackathon Demo Logins</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => {
                      const userData = { name: 'Ankita Tripathy (Student)', phone: '9876543210', email: 'student.ankita@gmail.com', role: 'tenant' };
                      setCurrentUser(userData);
                      setCurrentRole('tenant');
                      setAuthModalOpen(false);
                      showToast('🎉 Logged in as Student Tenant!');
                    }}
                    style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border-col)', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', color: 'var(--teal-dark)', display: 'flex', alignItems: 'center', justify: 'center', gap: 6 }}
                  >
                    🏠 Quick Login as Student Tenant
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const userData = { name: 'Ramesh Chandra Jena (Owner)', phone: '9853011223', email: 'owner.bbsr@roomnest.in', role: 'owner' };
                      setCurrentUser(userData);
                      setCurrentRole('owner');
                      setAuthModalOpen(false);
                      showToast('🏢 Logged in as Property Owner!');
                    }}
                    style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border-col)', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', color: 'var(--amber-dark)', display: 'flex', alignItems: 'center', justify: 'center', gap: 6 }}
                  >
                    🏢 Quick Login as Property Owner
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const userData = { name: 'RoomNest System Admin', phone: '9999900000', email: 'admin@roomnest.in', role: 'admin' };
                      setCurrentUser(userData);
                      setCurrentRole('admin');
                      setAuthModalOpen(false);
                      showToast('⚙️ Logged in as System Admin!');
                    }}
                    style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border-col)', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', color: 'var(--scarlet)', display: 'flex', alignItems: 'center', justify: 'center', gap: 6 }}
                  >
                    ⚙️ Quick Login as System Admin
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Phone */}
          {step === 'phone' && (
            <form onSubmit={handleSendOtp}>
              <button type="button" onClick={() => setStep('role')}
                style={{ fontSize: 12, color: 'var(--teal)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
                ← Back
              </button>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-sec)', display: 'block', marginBottom: 6 }}>Your Name (optional)</label>
                <input type="text" placeholder="e.g. Rahul Kumar"
                  value={name} onChange={e => setName(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid var(--border-col)', fontSize: 14, fontFamily: 'var(--font-b)', background: 'var(--surface-2)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-sec)', display: 'block', marginBottom: 6 }}>📱 Mobile Number *</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ padding: '11px 12px', background: 'var(--surface-2)', border: '1px solid var(--border-col)', borderRadius: 10, fontSize: 14, fontWeight: 600, color: 'var(--text-sec)', flexShrink: 0 }}>+91</div>
                  <input type="tel" placeholder="10-digit mobile number"
                    value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    style={{ flex: 1, padding: '11px 14px', borderRadius: 10, border: '1px solid var(--border-col)', fontSize: 14, fontFamily: 'var(--font-b)', background: 'var(--surface-2)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
              </div>

              <button type="submit" className="rn-signin-btn" style={{ width: '100%', justifyContent: 'center', fontSize: 14, padding: '13px' }}>
                <Phone size={15} /> Send OTP
              </button>
            </form>
          )}

          {/* Step 3: OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerify}>
              <button type="button" onClick={() => setStep('phone')}
                style={{ fontSize: 12, color: 'var(--teal)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
                ← Back
              </button>

              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📲</div>
                <p style={{ fontSize: 14, color: 'var(--text-sec)', fontWeight: 500 }}>Enter the OTP sent to +91 {phone}</p>
                <p style={{ fontSize: 12, color: 'var(--teal)', fontWeight: 600, marginTop: 4 }}>Demo OTP: 1234</p>
              </div>

              <div style={{ marginBottom: 20 }}>
                <input type="text" placeholder="Enter 4-digit OTP"
                  value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,4))}
                  style={{ width: '100%', padding: '14px', borderRadius: 10, border: '2px solid var(--border-col)', fontSize: 22, fontWeight: 800, textAlign: 'center', letterSpacing: 10, fontFamily: 'var(--font-h)', background: 'var(--surface-2)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>

              <button type="submit" className="rn-signin-btn" style={{ width: '100%', justifyContent: 'center', fontSize: 14, padding: '13px' }}>
                <ShieldCheck size={15} /> Verify & Sign In
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
