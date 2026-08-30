import React from 'react';
import { useApp } from '../../context/AppContext';
import { calculateSafetyScore } from '../../utils/safetyScore';
import {
  X,
  Scale,
  ShieldCheck,
  Zap,
  Trash2,
  Calendar,
  Check,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Shield,
  HelpCircle
} from 'lucide-react';

const AMENITY_KEYS = [
  'Air Conditioner / Non-AC Options',
  'High Speed Wi-Fi',
  'Home-Style Food Included (3 Meals)',
  'Attached Toilets',
  'Hot Water Geyser',
  'AquaGuard RO Purifier',
  'Automatic Washing Machine',
  'Power Backup Generator',
  'Dedicated Bike Parking',
  'Private Balcony'
];

export const PropertyComparisonModal = () => {
  const {
    compareList,
    toggleCompare,
    clearCompare,
    isCompareModalOpen,
    setIsCompareModalOpen,
    setSelectedProperty,
    setActiveListing,
    setPropertyModalOpen,
    setBookingModalListing
  } = useApp();

  if (!isCompareModalOpen) return null;

  const handleOpenDetail = (property) => {
    setSelectedProperty(property);
    setActiveListing(property);
    setPropertyModalOpen(true);
  };

  const handleScheduleVisit = (property) => {
    setBookingModalListing(property);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={() => setIsCompareModalOpen(false)}
    >
      <div
        className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'var(--surface)' }}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between" style={{ borderColor: 'var(--border-col)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold" style={{ background: 'var(--teal-light)', color: 'var(--teal)' }}>
              <Scale size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black" style={{ fontFamily: 'var(--font-h)', color: 'var(--text-primary)' }}>
                Compare Properties ({compareList.length}/3)
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Side-by-side rent, deposits, safety score & amenity analysis in Bhubaneswar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
              >
                <Trash2 size={13} /> Clear All
              </button>
            )}
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
              style={{ color: 'var(--text-sec)' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Content / Comparison Matrix */}
        <div className="p-6 overflow-y-auto flex-1">
          {compareList.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">⚖️</div>
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>No properties added to compare</h3>
              <p className="text-sm mt-1 mb-6" style={{ color: 'var(--text-muted)' }}>
                Click the "Compare" icon on listing cards or property pages to evaluate up to 3 listings side-by-side.
              </p>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-transform active:scale-95"
                style={{ background: 'var(--teal)' }}
              >
                Browse Listings
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Top Cards Comparison Grid */}
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${compareList.length}, minmax(0, 1fr))`
                }}
              >
                {compareList.map((item) => {
                  const safety = calculateSafetyScore(item);
                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl p-4 border flex flex-col justify-between relative shadow-sm"
                      style={{ background: 'var(--surface-2)', borderColor: 'var(--border-col)' }}
                    >
                      {/* Remove Button */}
                      <button
                        onClick={() => toggleCompare(item)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white text-rose-500 shadow-sm transition-all"
                        title="Remove from comparison"
                      >
                        <X size={14} />
                      </button>

                      <div>
                        {/* Image */}
                        <div className="w-full h-36 rounded-xl overflow-hidden mb-3 bg-slate-200">
                          <img
                            src={(item.images && item.images[0]) || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500'}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Badges */}
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                            style={{ background: 'var(--teal-light)', color: 'var(--teal-dark)' }}
                          >
                            {item.propertyType || 'PG'}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                              safety.level === 'safe'
                                ? 'bg-emerald-100 text-emerald-800'
                                : safety.level === 'caution'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            <Shield size={10} /> {safety.score}/100 {safety.label}
                          </span>
                        </div>

                        <h4
                          className="font-bold text-sm line-clamp-2 mb-1 cursor-pointer hover:underline"
                          style={{ color: 'var(--text-primary)' }}
                          onClick={() => handleOpenDetail(item)}
                        >
                          {item.title}
                        </h4>
                        <div className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                          📍 {item.locality || 'Bhubaneswar'} {item.distanceToHub ? `· ${item.distanceToHub}` : ''}
                        </div>

                        {/* Price Display */}
                        <div className="mb-4">
                          <div className="text-xl font-extrabold" style={{ color: 'var(--teal)', fontFamily: 'var(--font-h)' }}>
                            ₹{Number(item.rent || 0).toLocaleString('en-IN')}
                            <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}> / month</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick CTAs */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t" style={{ borderColor: 'var(--border-col)' }}>
                        <button
                          onClick={() => handleOpenDetail(item)}
                          className="px-2.5 py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                          style={{ background: 'var(--surface)', color: 'var(--text-primary)', border: '1px solid var(--border-col)' }}
                        >
                          <ExternalLink size={12} /> Details
                        </button>
                        <button
                          onClick={() => handleScheduleVisit(item)}
                          className="px-2.5 py-2 rounded-xl text-[11px] font-bold text-white flex items-center justify-center gap-1 transition-transform active:scale-95"
                          style={{ background: 'var(--teal)' }}
                        >
                          <Calendar size={12} /> Visit
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Detailed Attribute Comparison Table */}
              <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border-col)' }}>
                <div className="px-4 py-3 font-bold text-xs uppercase tracking-wider bg-slate-50 border-b" style={{ background: 'var(--surface-2)', borderColor: 'var(--border-col)', color: 'var(--text-sec)' }}>
                  💰 Financial Transparency & Tariffs
                </div>

                <div className="divide-y" style={{ borderColor: 'var(--border-col)' }}>
                  {/* Monthly Rent */}
                  <div className="grid grid-cols-4 p-3 text-xs" style={{ background: 'var(--surface)' }}>
                    <div className="font-semibold col-span-1" style={{ color: 'var(--text-sec)' }}>Monthly Rent</div>
                    {compareList.map((item) => (
                      <div key={item.id} className="font-bold col-span-1" style={{ color: 'var(--teal)' }}>
                        ₹{Number(item.rent || 0).toLocaleString('en-IN')}/mo
                      </div>
                    ))}
                  </div>

                  {/* Security Deposit */}
                  <div className="grid grid-cols-4 p-3 text-xs" style={{ background: 'var(--surface)' }}>
                    <div className="font-semibold col-span-1" style={{ color: 'var(--text-sec)' }}>Security Deposit</div>
                    {compareList.map((item) => (
                      <div key={item.id} className="col-span-1 font-medium" style={{ color: 'var(--text-primary)' }}>
                        ₹{Number(item.deposit || item.rent || 0).toLocaleString('en-IN')}
                      </div>
                    ))}
                  </div>

                  {/* Maintenance */}
                  <div className="grid grid-cols-4 p-3 text-xs" style={{ background: 'var(--surface)' }}>
                    <div className="font-semibold col-span-1" style={{ color: 'var(--text-sec)' }}>Maintenance</div>
                    {compareList.map((item) => (
                      <div key={item.id} className="col-span-1 font-medium" style={{ color: 'var(--text-primary)' }}>
                        {item.maintenance ? `₹${item.maintenance}/mo` : 'Included in Rent'}
                      </div>
                    ))}
                  </div>

                  {/* Electricity & Water */}
                  <div className="grid grid-cols-4 p-3 text-xs" style={{ background: 'var(--surface)' }}>
                    <div className="font-semibold col-span-1" style={{ color: 'var(--text-sec)' }}>Electricity & Water</div>
                    {compareList.map((item) => (
                      <div key={item.id} className="col-span-1 font-medium" style={{ color: 'var(--text-primary)' }}>
                        {item.electricityRate || 'Sub-meter tariff (₹7/unit)'}
                      </div>
                    ))}
                  </div>

                  {/* Lock-in Period */}
                  <div className="grid grid-cols-4 p-3 text-xs" style={{ background: 'var(--surface)' }}>
                    <div className="font-semibold col-span-1" style={{ color: 'var(--text-sec)' }}>Lock-in Period</div>
                    {compareList.map((item) => (
                      <div key={item.id} className="col-span-1 font-medium" style={{ color: 'var(--text-primary)' }}>
                        {item.lockInPeriod || '1 Month Notice'}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tenant Preferences & Policies */}
                <div className="px-4 py-3 font-bold text-xs uppercase tracking-wider bg-slate-50 border-b border-t" style={{ background: 'var(--surface-2)', borderColor: 'var(--border-col)', color: 'var(--text-sec)' }}>
                  👥 Tenant Suitability & House Rules
                </div>

                <div className="divide-y" style={{ borderColor: 'var(--border-col)' }}>
                  {/* Gender / Tenant Type */}
                  <div className="grid grid-cols-4 p-3 text-xs" style={{ background: 'var(--surface)' }}>
                    <div className="font-semibold col-span-1" style={{ color: 'var(--text-sec)' }}>Suitable For</div>
                    {compareList.map((item) => (
                      <div key={item.id} className="col-span-1 font-medium" style={{ color: 'var(--text-primary)' }}>
                        {item.genderPreference || item.tenantType || 'Unisex'}
                      </div>
                    ))}
                  </div>

                  {/* Curfew */}
                  <div className="grid grid-cols-4 p-3 text-xs" style={{ background: 'var(--surface)' }}>
                    <div className="font-semibold col-span-1" style={{ color: 'var(--text-sec)' }}>Curfew Timing</div>
                    {compareList.map((item) => (
                      <div key={item.id} className="col-span-1 font-medium" style={{ color: 'var(--text-primary)' }}>
                        {item.houseRules?.curfew || 'No strict curfew (24/7 Access)'}
                      </div>
                    ))}
                  </div>

                  {/* Food / Mess */}
                  <div className="grid grid-cols-4 p-3 text-xs" style={{ background: 'var(--surface)' }}>
                    <div className="font-semibold col-span-1" style={{ color: 'var(--text-sec)' }}>Food / Meals Policy</div>
                    {compareList.map((item) => (
                      <div key={item.id} className="col-span-1 font-medium" style={{ color: 'var(--text-primary)' }}>
                        {item.houseRules?.foodPreference || 'Self-cook / Tiffin allowed'}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities Matrix */}
                <div className="px-4 py-3 font-bold text-xs uppercase tracking-wider bg-slate-50 border-b border-t" style={{ background: 'var(--surface-2)', borderColor: 'var(--border-col)', color: 'var(--text-sec)' }}>
                  ✨ Amenities Matrix
                </div>

                <div className="divide-y" style={{ borderColor: 'var(--border-col)' }}>
                  {AMENITY_KEYS.map((amenityName) => (
                    <div key={amenityName} className="grid grid-cols-4 p-3 text-xs" style={{ background: 'var(--surface)' }}>
                      <div className="font-semibold col-span-1" style={{ color: 'var(--text-sec)' }}>{amenityName}</div>
                      {compareList.map((item) => {
                        const hasAmenity = (item.amenities || []).some(
                          (a) => a.toLowerCase().includes(amenityName.toLowerCase().slice(0, 5))
                        );
                        return (
                          <div key={item.id} className="col-span-1 flex items-center gap-1.5">
                            {hasAmenity ? (
                              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                                <Check size={14} className="stroke-[3]" /> Available
                              </span>
                            ) : (
                              <span className="text-slate-400 font-medium">—</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
