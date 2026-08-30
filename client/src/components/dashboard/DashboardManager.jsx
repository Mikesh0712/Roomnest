import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Heart, Calendar, PlusCircle, Building2, CheckCircle2, XCircle,
  ShieldCheck, MapPin, BarChart3, Clock, FileText, Trash2, Eye,
  User, Lock, AlertCircle, Home, TrendingUp, DollarSign
} from 'lucide-react';

// ─── Tenant Dashboard ────────────────────────────────────
const TenantDashboard = () => {
  const { wishlist, visitBookings, listings, setActiveTab, deleteVisitBooking, rescheduleVisitBooking } = useApp();
  const [editingVisitId, setEditingVisitId] = useState(null);
  const [newDate, setNewDate] = useState('2026-08-25');
  const [newTime, setNewTime] = useState('04:00 PM');

  const handleReschedule = (id) => {
    rescheduleVisitBooking(id, newDate, newTime);
    setEditingVisitId(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--teal), var(--teal-dark))', borderRadius: 20, padding: '28px 28px', color: 'white' }}>
        <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Tenant Dashboard</div>
        <h2 style={{ fontFamily: 'var(--font-h)', fontSize: 26, fontWeight: 800 }}>Your RoomNest Hub</h2>
        <p style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>Manage saved properties, upcoming visits and your rental journey.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'Saved Properties', value: wishlist.length, icon: <Heart size={18} color="var(--scarlet)" />, bg: '#fff0f0' },
          { label: 'Scheduled Visits', value: visitBookings.length, icon: <Calendar size={18} color="var(--teal)" />, bg: 'var(--teal-light)' },
          { label: 'Active Listings', value: listings.length, icon: <Building2 size={18} color="var(--amber-dark)" />, bg: 'var(--amber-light)' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border-col)', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: 'var(--card-shadow)' }}>
            <div style={{ width: 44, height: 44, background: s.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
            <div>
              <div style={{ fontFamily: 'var(--font-h)', fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Wishlist */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-col)', borderRadius: 16, padding: 24, boxShadow: 'var(--card-shadow)' }}>
        <h3 style={{ fontFamily: 'var(--font-h)', fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Heart size={16} color="var(--scarlet)" /> Saved Properties ({wishlist.length})
        </h3>
        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>💔</div>
            <p style={{ fontSize: 14, fontWeight: 600 }}>No saved properties yet</p>
            <button onClick={() => setActiveTab('listings')} style={{ marginTop: 12, padding: '8px 20px', background: 'var(--teal)', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Browse Properties</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {wishlist.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 10, border: '1px solid var(--border-col)' }}>
                <div style={{ width: 50, height: 50, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: 'var(--teal-light)' }}>
                  {item.images?.[0] && <img src={item.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>₹{item.rent?.toLocaleString()}/mo · {item.locality}</div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--teal)', fontFamily: 'var(--font-h)' }}>₹{item.rent?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Visits with Delete & Reschedule Actions */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-col)', borderRadius: 16, padding: 24, boxShadow: 'var(--card-shadow)' }}>
        <h3 style={{ fontFamily: 'var(--font-h)', fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={16} color="var(--teal)" /> Scheduled Visits ({visitBookings.length})
        </h3>
        {visitBookings.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0', fontSize: 14 }}>No visits scheduled yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {visitBookings.map(v => (
              <div key={v.id} style={{ padding: '14px 16px', background: 'var(--teal-light)', border: '1px solid rgba(0,168,150,0.2)', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--teal-dark)' }}>{v.propertyTitle}</div>
                    <div style={{ fontSize: 12, color: 'var(--teal)', marginTop: 2 }}>📅 {v.visitDate} at {v.visitTime} · {v.visitType || 'In-person Visit'}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--teal)', color: 'white', padding: '4px 12px', borderRadius: 100 }}>{v.status}</span>
                    <button
                      onClick={() => setEditingVisitId(editingVisitId === v.id ? null : v.id)}
                      style={{ padding: '5px 10px', background: 'white', border: '1px solid var(--border-col)', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', color: 'var(--text-primary)' }}
                    >
                      📅 Reschedule
                    </button>
                    <button
                      onClick={() => deleteVisitBooking(v.id)}
                      style={{ padding: '5px 10px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', color: '#dc2626' }}
                    >
                      🗑️ Cancel Visit
                    </button>
                  </div>
                </div>

                {/* Inline Reschedule Form */}
                {editingVisitId === v.id && (
                  <div style={{ background: 'white', padding: 12, borderRadius: 10, border: '1px solid var(--border-col)', display: 'flex', itemsAlign: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <input
                      type="date"
                      value={newDate}
                      onChange={e => setNewDate(e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border-col)', fontSize: 12 }}
                    />
                    <select
                      value={newTime}
                      onChange={e => setNewTime(e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border-col)', fontSize: 12 }}
                    >
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                    </select>
                    <button
                      onClick={() => handleReschedule(v.id)}
                      style={{ padding: '6px 14px', background: 'var(--teal)', color: 'white', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Confirm New Time
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const BHUBANESWAR_LOCALITIES = [
  'Jagamara', 'Patia', 'Khandagiri', 'Dumduma', 'Infocity', 'Nayapalli', 'Saheed Nagar', 'Chandrasekharpur'
];

const PROPERTY_TYPES = [
  'Hostel / PG', 'Boys Hostel', 'Girls Hostel', '1BHK Flat', '2BHK Flat', 'Studio Apartment', 'Paying Guest'
];

const TENANT_PREFERENCES = [
  'Boys Only', 'Girls Only', 'Unisex / Boys & Girls', 'Students & Working Professionals', 'Families'
];

const HUB_NAMES = [
  'ITER College (Jagamara)', 'KIIT University (Patia)', 'Infosys SEZ (Infocity)', 'TCS Gitanjali Park (Patia)', 'IIT Bhubaneswar (Jatni)'
];

const AMENITY_OPTIONS = [
  'Home-Style Food Included', 'High Speed Wi-Fi', 'Air Conditioner', 'Attached Toilets', '24/7 CCTV', 'Washing Machine', 'Power Backup', 'Geyser', 'RO Water Purifier', 'Bike Parking'
];

// ─── Owner Dashboard ────────────────────────────────────
const OwnerDashboard = () => {
  const { listings, addPropertyListing, deletePropertyListing, togglePropertyAvailability, visitBookings, showToast } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    rent: '7000',
    deposit: '7000',
    locality: 'Jagamara',
    propertyType: 'Boys Hostel',
    tenantType: 'Boys Only',
    hubName: 'ITER College (Jagamara)',
    selectedAmenities: ['High Speed Wi-Fi', 'RO Water Purifier', 'Power Backup', 'Attached Toilets']
  });

  const toggleAmenity = (name) => {
    setForm(prev => {
      const exists = prev.selectedAmenities.includes(name);
      return {
        ...prev,
        selectedAmenities: exists 
          ? prev.selectedAmenities.filter(a => a !== name)
          : [...prev.selectedAmenities, name]
      };
    });
  };

  const handleAdd = () => {
    const titleToUse = form.title || `${form.propertyType} near ${form.locality}`;
    addPropertyListing({
      title: titleToUse,
      rent: Number(form.rent || 7000),
      deposit: Number(form.deposit || form.rent || 7000),
      locality: form.locality,
      propertyType: form.propertyType,
      tenantType: form.tenantType,
      genderPreference: form.tenantType,
      suitableFor: [form.tenantType.toLowerCase().includes('boy') ? 'boys' : form.tenantType.toLowerCase().includes('girl') ? 'girls' : 'unisex'],
      city: 'Bhubaneswar',
      hubName: form.hubName,
      hubType: 'college',
      lat: form.locality === 'Patia' ? 20.35 : 20.25,
      lng: form.locality === 'Patia' ? 85.81 : 85.79,
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
      amenities: form.selectedAmenities,
      houseRules: { curfew: '10:00 PM Gate Close', foodPreference: 'Meals Available / Self Cook', visitorsPolicy: 'Visitors allowed till 9 PM', petsPolicy: 'Not Allowed' },
      verifiedOwner: true,
      isAvailable: true,
      verificationStatus: 'Verified Owner'
    });
    setShowForm(false);
    setForm({
      title: '',
      rent: '7000',
      deposit: '7000',
      locality: 'Jagamara',
      propertyType: 'Boys Hostel',
      tenantType: 'Boys Only',
      hubName: 'ITER College (Jagamara)',
      selectedAmenities: ['High Speed Wi-Fi', 'RO Water Purifier', 'Power Backup', 'Attached Toilets']
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--amber), var(--orange))', borderRadius: 20, padding: '28px', color: 'white' }}>
        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Owner Dashboard</div>
        <h2 style={{ fontFamily: 'var(--font-h)', fontSize: 26, fontWeight: 800 }}>Manage Your Properties</h2>
        <p style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Add listings with 1-click dropdowns, view visit requests, and delete properties.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'Total Listings', value: listings.length, icon: <Building2 size={18} color="var(--amber-dark)" />, bg: 'var(--amber-light)' },
          { label: 'Visit Requests', value: visitBookings.length, icon: <Calendar size={18} color="var(--teal)" />, bg: 'var(--teal-light)' },
          { label: 'Monthly Views', value: '142', icon: <Eye size={18} color="#8b5cf6" />, bg: '#f3e8ff' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border-col)', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: 'var(--card-shadow)' }}>
            <div style={{ width: 44, height: 44, background: s.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
            <div>
              <div style={{ fontFamily: 'var(--font-h)', fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Owner Listings + Add / Delete Property */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-col)', borderRadius: 16, padding: 24, boxShadow: 'var(--card-shadow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'var(--font-h)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
            <Building2 size={15} style={{ marginRight: 8, color: 'var(--amber-dark)' }} />Your Registered Properties ({listings.length})
          </h3>
          <button className="rn-btn-amber" onClick={() => setShowForm(p => !p)} style={{ padding: '8px 16px', fontSize: 12 }}>
            <PlusCircle size={14} /> Add New Property
          </button>
        </div>

        {/* Dropdown-based Property Creation Form */}
        {showForm && (
          <div style={{ background: 'var(--surface-2)', borderRadius: 14, padding: 20, border: '1px solid var(--border-col)', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-col)', pb: 8 }}>
              📋 Create New Listing (Select Dropdowns)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {/* Title */}
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-sec)', display: 'block', marginBottom: 4 }}>Property Name / Title (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Maa Tarini Boys Hostel / Deluxe Studio"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-col)', fontSize: 13, background: 'var(--surface)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>

              {/* Monthly Rent */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-sec)', display: 'block', marginBottom: 4 }}>Monthly Rent (₹)</label>
                <input
                  type="number"
                  placeholder="7000"
                  value={form.rent}
                  onChange={e => setForm(p => ({ ...p, rent: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-col)', fontSize: 13, background: 'var(--surface)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>

              {/* Security Deposit */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-sec)', display: 'block', marginBottom: 4 }}>Security Deposit (₹)</label>
                <input
                  type="number"
                  placeholder="7000"
                  value={form.deposit}
                  onChange={e => setForm(p => ({ ...p, deposit: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-col)', fontSize: 13, background: 'var(--surface)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>

              {/* Locality Dropdown */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-sec)', display: 'block', marginBottom: 4 }}>📍 Locality / Zone</label>
                <select
                  value={form.locality}
                  onChange={e => setForm(p => ({ ...p, locality: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-col)', fontSize: 13, background: 'var(--surface)', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
                >
                  {BHUBANESWAR_LOCALITIES.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>

              {/* Property Type Dropdown */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-sec)', display: 'block', marginBottom: 4 }}>🏠 Property Category</label>
                <select
                  value={form.propertyType}
                  onChange={e => setForm(p => ({ ...p, propertyType: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-col)', fontSize: 13, background: 'var(--surface)', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
                >
                  {PROPERTY_TYPES.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                </select>
              </div>

              {/* Tenant Preference Dropdown */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-sec)', display: 'block', marginBottom: 4 }}>👥 Gender / Tenant Preference</label>
                <select
                  value={form.tenantType}
                  onChange={e => setForm(p => ({ ...p, tenantType: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-col)', fontSize: 13, background: 'var(--surface)', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
                >
                  {TENANT_PREFERENCES.map(tp => <option key={tp} value={tp}>{tp}</option>)}
                </select>
              </div>

              {/* Nearby Campus / Hub Dropdown */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-sec)', display: 'block', marginBottom: 4 }}>🎓 Nearest College / Landmark</label>
                <select
                  value={form.hubName}
                  onChange={e => setForm(p => ({ ...p, hubName: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-col)', fontSize: 13, background: 'var(--surface)', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
                >
                  {HUB_NAMES.map(hn => <option key={hn} value={hn}>{hn}</option>)}
                </select>
              </div>
            </div>

            {/* Included Amenities 1-Click Toggle Pills */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-sec)', display: 'block', marginBottom: 6 }}>✨ Select Included Amenities (Click to toggle)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {AMENITY_OPTIONS.map(am => {
                  const selected = form.selectedAmenities.includes(am);
                  return (
                    <button
                      key={am}
                      type="button"
                      onClick={() => toggleAmenity(am)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        border: selected ? '1px solid var(--amber-dark)' : '1px solid var(--border-col)',
                        background: selected ? 'var(--amber-light)' : 'var(--surface)',
                        color: selected ? 'var(--amber-dark)' : 'var(--text-sec)'
                      }}
                    >
                      {selected ? '✓ ' : '+ '}{am}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <button className="rn-btn-amber" onClick={handleAdd} style={{ fontSize: 13, padding: '10px 20px' }}>✓ Publish Property Listing</button>
              <button onClick={() => setShowForm(false)} style={{ padding: '10px 18px', border: '1px solid var(--border-col)', borderRadius: 8, background: 'transparent', cursor: 'pointer', fontSize: 13, color: 'var(--text-sec)' }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Listings List with Status Toggle & Delete Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {listings.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 16px', background: 'var(--surface-2)', borderRadius: 12, border: '1px solid var(--border-col)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: 'var(--amber-light)' }}>
                  {item.images?.[0] && <img src={item.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>₹{item.rent?.toLocaleString()}/mo · {item.locality || 'Bhubaneswar'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => togglePropertyAvailability(item.id)}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: item.isAvailable !== false ? '#15803d' : '#9a3412',
                    background: item.isAvailable !== false ? '#dcfce7' : '#ffedd5',
                    border: '1px solid',
                    borderColor: item.isAvailable !== false ? '#86efac' : '#fdba74',
                    padding: '5px 12px',
                    borderRadius: 8,
                    cursor: 'pointer'
                  }}
                  title="Click to toggle availability status"
                >
                  {item.isAvailable !== false ? '● Available' : '○ Occupied / Full'}
                </button>
                <button
                  onClick={() => deletePropertyListing(item.id)}
                  style={{ padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                  title="Delete this property"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {visitBookings.length > 0 && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-sec)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Incoming Visit Requests</div>
            {visitBookings.map(v => (
              <div key={v.id} style={{ padding: '12px 14px', background: 'var(--amber-light)', border: '1px solid #fde68a', borderRadius: 10, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>{v.userName} — {v.visitType}</div>
                  <div style={{ fontSize: 11, color: '#92400e' }}>{v.visitDate} at {v.visitTime}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--amber)', color: 'white', padding: '3px 10px', borderRadius: 100 }}>{v.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Broker Dashboard ────────────────────────────────────
const BrokerDashboard = () => {
  const { listings } = useApp();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', borderRadius: 20, padding: '28px', color: 'white' }}>
        <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Broker Dashboard</div>
        <h2 style={{ fontFamily: 'var(--font-h)', fontSize: 26, fontWeight: 800 }}>Broker Control Center</h2>
        <p style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>Manage your portfolio, track commissions, and leads.</p>
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-col)', borderRadius: 16, padding: 24, boxShadow: 'var(--card-shadow)', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🏘️</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>You manage {listings.length} properties</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Broker features — portfolio management, commission tracker and lead CRM — coming soon.</div>
      </div>
    </div>
  );
};

// ─── Admin Dashboard ────────────────────────────────────
const AdminDashboard = () => {
  const { listings, verifyListing } = useApp();
  const pendingCount = listings.filter(l => (l.verificationStatus || '').toLowerCase().includes('pending')).length;
  const verifiedCount = listings.filter(l => (l.verificationStatus || '').toLowerCase().includes('verified')).length;
  const flaggedCount = listings.filter(l => (l.verificationStatus || '').toLowerCase().includes('flagged')).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: 'linear-gradient(135deg, var(--scarlet), var(--scarlet-dark))', borderRadius: 20, padding: '28px', color: 'white' }}>
        <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Admin Dashboard</div>
        <h2 style={{ fontFamily: 'var(--font-h)', fontSize: 26, fontWeight: 800 }}>Platform Administration</h2>
        <p style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>Review listings, manage verifications, and monitor platform health.</p>
      </div>

      {/* Admin Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'Pending Audit', value: pendingCount, icon: <Clock size={18} color="var(--amber-dark)" />, bg: 'var(--amber-light)' },
          { label: 'Verified Listings', value: verifiedCount, icon: <ShieldCheck size={18} color="var(--teal)" />, bg: 'var(--teal-light)' },
          { label: 'Flagged / Review', value: flaggedCount, icon: <AlertCircle size={18} color="var(--scarlet)" />, bg: '#fff0f0' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border-col)', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: 'var(--card-shadow)' }}>
            <div style={{ width: 44, height: 44, background: s.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
            <div>
              <div style={{ fontFamily: 'var(--font-h)', fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-col)', borderRadius: 16, padding: 24, boxShadow: 'var(--card-shadow)' }}>
        <h3 style={{ fontFamily: 'var(--font-h)', fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>Listing Verification Queue</h3>
        {listings.map(l => {
          const isVerified = (l.verificationStatus || '').toLowerCase().includes('verified');
          const isFlagged = (l.verificationStatus || '').toLowerCase().includes('flagged');

          return (
            <div key={l.id} style={{ padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 10, border: '1px solid var(--border-col)', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</span>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: isVerified ? 'var(--teal-light)' : isFlagged ? '#fee2e2' : 'var(--amber-light)',
                    color: isVerified ? 'var(--teal-dark)' : isFlagged ? '#b91c1c' : '#92400e'
                  }}>
                    {l.verificationStatus || 'Pending Verification'}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{l.locality} · ₹{l.rent?.toLocaleString()}/mo · {l.propertyType}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button onClick={() => verifyListing(l.id, 'Verified Owner')}
                  style={{ padding: '6px 14px', background: 'var(--teal)', color: 'white', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                  ✓ Verify
                </button>
                <button onClick={() => verifyListing(l.id, 'Flagged')}
                  style={{ padding: '6px 14px', background: 'var(--scarlet)', color: 'white', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                  ✗ Flag
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Not Signed In ────────────────────────────────────
const NotSignedIn = ({ setAuthModalOpen }) => (
  <div style={{ maxWidth: 440, margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
    <div style={{ width: 80, height: 80, background: 'var(--surface-2)', border: '2px solid var(--border-col)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 36 }}>🔒</div>
    <h2 style={{ fontFamily: 'var(--font-h)', fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Sign in to view your Dashboard</h2>
    <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6 }}>Your personal dashboard shows saved properties, visit bookings, and role-specific tools.</p>
    <button className="rn-signin-btn" style={{ margin: '0 auto', fontSize: 15, padding: '12px 32px' }} onClick={() => setAuthModalOpen(true)}>
      <User size={16} /> Sign In to Continue
    </button>
  </div>
);

// ─── Main DashboardManager ────────────────────────────────────
export const DashboardManager = () => {
  const { currentUser, currentRole, setAuthModalOpen } = useApp();

  if (!currentUser) return <NotSignedIn setAuthModalOpen={setAuthModalOpen} />;

  const role = currentUser.role;

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 64px' }}>
      {/* Role indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span className={`rn-role-badge ${role}`}>
          {role === 'tenant' && '🏠'}
          {role === 'owner' && '🏢'}
          {role === 'broker' && '🤝'}
          {role === 'admin' && '⚙️'}
          {' '}{role.charAt(0).toUpperCase() + role.slice(1)} Portal
        </span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Signed in as {currentUser.name}</span>
      </div>

      {role === 'tenant' && <TenantDashboard />}
      {role === 'owner' && <OwnerDashboard />}
      {role === 'broker' && <BrokerDashboard />}
      {role === 'admin' && <AdminDashboard />}
    </div>
  );
};
