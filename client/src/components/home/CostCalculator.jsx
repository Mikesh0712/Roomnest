import React, { useState } from 'react';
import { Calculator, Utensils, Zap, Shirt, Wifi, Package } from 'lucide-react';

const ROOM_TYPES = [
  { label: 'PG / Shared Room', rent: 5500 },
  { label: 'Studio Apartment', rent: 8500 },
  { label: '1 BHK', rent: 12000 },
  { label: '2 BHK (shared)', rent: 8000 },
];

export const CostCalculator = () => {
  const [rent, setRent] = useState(8500);
  const [customRent, setCustomRent] = useState('');
  const [elecUnits, setElecUnits] = useState(80);
  const [mealPlan, setMealPlan] = useState(2400);
  const [laundry, setLaundry] = useState(499);
  const [wifi, setWifi] = useState(499);
  const [misc, setMisc] = useState(1000);
  const [selectedType, setSelectedType] = useState(1);

  const effectiveRent = customRent ? Number(customRent) : rent;
  const electricity = elecUnits * 7;
  const total = effectiveRent + electricity + mealPlan + laundry + wifi + misc;

  const rows = [
    { icon: <Package size={14} />, label: 'Monthly Rent', amount: effectiveRent, color: 'var(--teal)' },
    { icon: <Zap size={14} />, label: `Electricity (${elecUnits} units × ₹7)`, amount: electricity, color: 'var(--amber)' },
    { icon: <Utensils size={14} />, label: 'Meals / Tiffin', amount: mealPlan, color: 'var(--orange)' },
    { icon: <Shirt size={14} />, label: 'Laundry', amount: laundry, color: '#8b5cf6' },
    { icon: <Wifi size={14} />, label: 'WiFi / Internet', amount: wifi, color: '#3b82f6' },
    { icon: <Package size={14} />, label: 'Miscellaneous', amount: misc, color: '#718096' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

      {/* Left: Controls */}
      <div className="rn-calc">
        <div className="rn-calc-header">
          <div className="rn-calc-icon"><Calculator size={22} /></div>
          <div>
            <div className="rn-calc-title">Monthly Budget Planner</div>
            <div className="rn-calc-sub">Adjust sliders to estimate your living cost</div>
          </div>
        </div>

        {/* Quick Room Type Select */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-sec)', marginBottom: 8, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>Room Type</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ROOM_TYPES.map((t, i) => (
              <button key={i}
                onClick={() => { setSelectedType(i); setRent(t.rent); setCustomRent(''); }}
                style={{
                  padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  border: '1px solid', transition: 'all 0.15s',
                  background: selectedType === i ? 'var(--teal)' : 'var(--surface-2)',
                  color: selectedType === i ? 'white' : 'var(--text-sec)',
                  borderColor: selectedType === i ? 'var(--teal)' : 'var(--border-col)'
                }}
              >{t.label}</button>
            ))}
          </div>
        </div>

        {/* Custom rent */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sec)', display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            Monthly Rent <strong style={{ color: 'var(--teal)' }}>₹{effectiveRent.toLocaleString()}</strong>
          </label>
          <input type="number" placeholder="Or enter custom rent..."
            value={customRent} onChange={e => setCustomRent(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-col)',
              fontSize: 14, fontFamily: 'var(--font-b)', background: 'var(--surface-2)', color: 'var(--text-primary)',
              outline: 'none'
            }}
          />
        </div>

        {/* Electricity slider */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sec)', display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            Electricity Units / month <strong style={{ color: 'var(--amber)' }}>{elecUnits} units = ₹{electricity}</strong>
          </label>
          <input type="range" className="rn-rent-slider" min={20} max={300} step={10}
            value={elecUnits} onChange={e => setElecUnits(Number(e.target.value))}
            style={{ '--thumb-color': 'var(--amber)' }}
          />
        </div>

        {/* Meal Plan */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sec)', display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            Meals / Tiffin <strong style={{ color: 'var(--orange)' }}>₹{mealPlan.toLocaleString()}</strong>
          </label>
          <input type="range" className="rn-rent-slider" min={0} max={6000} step={200}
            value={mealPlan} onChange={e => setMealPlan(Number(e.target.value))} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>
            <span>Self Cook</span><span>Full Meal Service</span>
          </div>
        </div>

        {/* Laundry */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sec)', display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            Laundry <strong style={{ color: '#8b5cf6' }}>₹{laundry}/mo</strong>
          </label>
          <input type="range" className="rn-rent-slider" min={0} max={1500} step={100}
            value={laundry} onChange={e => setLaundry(Number(e.target.value))} />
        </div>

        {/* WiFi */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sec)', display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            WiFi / Internet <strong style={{ color: '#3b82f6' }}>₹{wifi}/mo</strong>
          </label>
          <input type="range" className="rn-rent-slider" min={0} max={1200} step={100}
            value={wifi} onChange={e => setWifi(Number(e.target.value))} />
        </div>

        {/* Misc */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sec)', display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            Miscellaneous <strong style={{ color: 'var(--slate)' }}>₹{misc}</strong>
          </label>
          <input type="range" className="rn-rent-slider" min={0} max={5000} step={250}
            value={misc} onChange={e => setMisc(Number(e.target.value))} />
        </div>
      </div>

      {/* Right: Breakdown */}
      <div className="rn-calc">
        <h3 style={{ fontFamily: 'var(--font-h)', fontSize: 18, fontWeight: 800, marginBottom: 20, color: 'var(--text-primary)' }}>
          📊 Cost Breakdown
        </h3>

        {/* Bar chart visual */}
        <div style={{ marginBottom: 24 }}>
          {rows.map((r, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sec)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: r.color }}>{r.icon}</span> {r.label}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: r.color }}>₹{r.amount.toLocaleString()}</span>
              </div>
              <div style={{ height: 6, background: 'var(--border-col)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 3,
                  background: r.color,
                  width: `${Math.min(100, (r.amount / total) * 100)}%`,
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="rn-calc-total">
          <div>
            <div className="rn-calc-total-label">Estimated Monthly Budget</div>
            <div style={{ fontSize: 11, color: 'var(--teal-dark)', marginTop: 2 }}>All expenses combined</div>
          </div>
          <div className="rn-calc-total-amount">₹{total.toLocaleString()}</div>
        </div>

        {/* Tips */}
        <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--amber-light)', borderRadius: 10, border: '1px solid #fde68a' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#92400e', marginBottom: 4 }}>💡 Money-Saving Tips</div>
          <ul style={{ fontSize: 11, color: '#92400e', paddingLeft: 14, lineHeight: 1.7 }}>
            <li>Share a 2BHK to split rent (saves ₹3,000-5,000/mo)</li>
            <li>Monthly tiffin subscriptions are cheaper than daily orders</li>
            <li>Negotiate 2-3 month advance for better rent deals</li>
          </ul>
        </div>

        <button className="rn-btn-amber" style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}>
          📋 Download Budget Report
        </button>
      </div>

    </div>
  );
};
