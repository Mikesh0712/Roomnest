import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { calculateSafetyScore } from '../../utils/safetyScore';
import { 
  X, 
  ArrowLeft,
  MapPin, 
  ShieldCheck, 
  Star, 
  Calendar, 
  MessageSquare, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Utensils, 
  Heart, 
  Calculator, 
  ClipboardCheck, 
  Sparkles, 
  Video, 
  UserCheck, 
  Wifi, 
  Shirt, 
  Zap, 
  DollarSign, 
  ChevronRight, 
  Download,
  AlertCircle,
  ShieldAlert,
  Shield,
  Info
} from 'lucide-react';

export const PropertyDetailModal = () => {
  const { 
    activeListing, 
    setActiveListing, 
    selectedProperty,
    setSelectedProperty,
    propertyModalOpen,
    setPropertyModalOpen,
    setBookingModalListing, 
    wishlist, 
    toggleWishlist,
    showToast 
  } = useApp();

  const { t } = useLanguage();

  const modalScrollRef = useRef(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'rules' | 'calculator' | 'checklist' | 'reviews'
  
  // Cost Calculator State
  const [foodCost, setFoodCost] = useState(2400);
  const [elecUnits, setElecUnits] = useState(100); // 100 units * ₹7 = 700
  const [laundryCost, setLaundryCost] = useState(599);
  const [wifiCost, setWifiCost] = useState(499);

  // Move-in Checklist State
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, text: "Verify sub-meter initial reading with landlord", checked: true },
    { id: 2, text: "Inspect AC cooling & Geyser heating in bathroom", checked: true },
    { id: 3, text: "Test both original & duplicate sets of door keys", checked: false },
    { id: 4, text: "Check water purifier (RO) filter status", checked: false },
    { id: 5, text: "Draft standard 11-month Odia Rental Agreement", checked: false }
  ]);

  const active = activeListing || selectedProperty;
  const isOpen = (propertyModalOpen && selectedProperty) || Boolean(activeListing);

  const closeModal = () => {
    setActiveListing(null);
    setSelectedProperty(null);
    setPropertyModalOpen(false);
  };

  // Auto scroll to top on modal open / active property change
  useEffect(() => {
    if (isOpen) {
      setActiveImageIndex(0);
      setActiveTab('overview');
      if (modalScrollRef.current) {
        modalScrollRef.current.scrollTop = 0;
      }
    }
  }, [active?.id, isOpen]);

  // Handle Escape Key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen || !active) return null;

  const isWishlisted = wishlist.some(w => (typeof w === 'string' ? w === active.id : w.id === active.id));
  const estimatedElectricity = elecUnits * 7;
  const rentVal = Number(active.rent || 0);
  const maintVal = Number(active.maintenance || 0);
  const totalMonthlyBudget = rentVal + maintVal + estimatedElectricity + foodCost + laundryCost + wifiCost;

  // Calculate safety score
  const safety = calculateSafetyScore(active);

  const toggleChecklistItem = (id) => {
    setChecklistItems(checklistItems.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleDownloadChecklist = () => {
    showToast('📥 Move-in Checklist PDF downloaded!');
  };

  return (
    <div 
      className="fixed inset-0 z-[1000] flex items-start sm:items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={closeModal}
    >
      
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col my-auto max-h-[92vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Sticky Modal Top Bar with BACK BUTTON */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-850/95 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <button
              onClick={closeModal}
              className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-3.5 py-2 rounded-xl text-xs transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
              title="Return to Home / Properties"
              id="modal-back-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('backToListings')}</span>
            </button>

            <span className="bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {active.propertyType}
            </span>
            {active.verificationStatus?.includes('Verified') && (
              <span className="badge-verified text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {active.verificationStatus}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => toggleWishlist(active)}
              className="p-2 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-700 dark:text-slate-300'}`} />
            </button>
            <button 
              onClick={closeModal}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 dark:hover:text-red-400 text-slate-800 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Scrollable Content */}
        <div ref={modalScrollRef} className="overflow-y-auto p-6 space-y-8 flex-1">
          
          {/* Header & Gallery Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Gallery Left (8 cols) */}
            <div className="lg:col-span-8 space-y-3">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900 shadow-inner border border-slate-200">
                <img 
                  src={(active.images && active.images[activeImageIndex]) || active.thumbnail || (active.images && active.images[0]) || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80'} 
                  alt={active.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Virtual Tour Tag */}
                {active.videoTourUrl && (
                  <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border border-white/20">
                    <Video className="w-4 h-4 text-emerald-400" />
                    360° Virtual Walkthrough Available
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {active.images && active.images.length > 0 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {active.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-20 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx ? 'border-blue-600 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Contact Card Right (4 cols) */}
            <div className="lg:col-span-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <p className="text-xs text-slate-500 font-semibold mb-1">Monthly Rent</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-black text-slate-900 font-heading">
                    ₹{Number(active.rent || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">/ month</span>
                </div>

                {/* Key Term Pills */}
                <div className="space-y-2 text-xs font-medium text-slate-600 mb-6 bg-white p-4 rounded-xl border border-slate-200/80">
                  <div className="flex justify-between">
                    <span>Security Deposit:</span>
                    <span className="font-extrabold text-slate-900">₹{Number(active.deposit || active.securityDeposit || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maintenance:</span>
                    <span className="font-extrabold text-slate-900">₹{active.maintenance || 0}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Electricity Tariff:</span>
                    <span className="font-extrabold text-blue-600">{active.electricityRate || 'Sub-meter / Included'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lock-in Period:</span>
                    <span className="font-extrabold text-slate-900">{active.lockInPeriod || '1 Month'}</span>
                  </div>
                </div>

                {/* Direct Owner Box */}
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">{active.ownerInfo?.name || 'Verified Property Owner'}</p>
                    <p className="text-slate-500">{active.ownerInfo?.type || 'Direct Owner'}</p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    closeModal();
                    setBookingModalListing(active);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  {t('bookVisit')}
                </button>
                <a
                  href={`https://wa.me/${active.ownerInfo?.whatsapp || '919853011223'}?text=Hi,%20I%20saw%20your%20property%20listing%20"${encodeURIComponent(active.title || '')}"%20on%20RoomNest.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  {t('whatsapp')}
                </a>
              </div>

            </div>

          </div>

          {/* AI SCAM & SAFETY ASSESSMENT SECTION */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-indigo-800/50 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-900/60 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                  safety.level === 'safe'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40'
                    : safety.level === 'caution'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-400/40'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-400/40'
                }`}>
                  {safety.score}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <h3 className="font-extrabold text-sm sm:text-base font-heading text-white">
                      {t('aiSafetyAnalysis')}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300">
                    Status: <strong className={safety.level === 'safe' ? 'text-emerald-400' : safety.level === 'caution' ? 'text-amber-400' : 'text-rose-400'}>{safety.label} ({safety.score}/100)</strong>
                  </p>
                </div>
              </div>

              <span className={`text-xs font-bold px-3 py-1 rounded-full self-start sm:self-auto uppercase tracking-wider ${
                safety.level === 'safe'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                  : safety.level === 'caution'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
              }`}>
                {safety.level === 'safe' ? '🟢 Safe Listing' : safety.level === 'caution' ? '🟡 Needs Caution' : '🔴 High Scam Risk'}
              </span>
            </div>

            {safety.level === 'risky' && (
              <div className="bg-rose-950/80 border border-rose-500/50 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-rose-200">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{t('scamWarning')}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200 mb-1">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>Verified Ownership</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  {active.verifiedOwner ? '✅ Government ID & Utility bill physically validated' : '⚠️ Unverified third-party listing. Verify documents in person.'}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200 mb-1">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Fair Pricing Audit</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  {rentVal >= 3500 ? `✅ ₹${rentVal}/mo is within normal market range for ${active.locality}` : '⚠️ Rent is suspiciously below market rate (potential deposit scam).'}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200 mb-1">
                  <Phone className="w-4 h-4 text-indigo-400" />
                  <span>Contact Transparency</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  {active.ownerInfo?.phone ? '✅ Direct active phone & WhatsApp linked' : '⚠️ Missing verified direct phone contact.'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs inside Detail Modal */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview & Amenities' },
              { id: 'rules', label: 'House Rules & Transparency' },
              { id: 'calculator', label: 'Monthly Budget Calculator' },
              { id: 'checklist', label: 'Move-in Checklist' },
              { id: 'reviews', label: `Reviews (${active.reviewCount || 0})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW & AMENITIES */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-heading mb-2">{active.title}</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{active.description}</p>
              </div>

              {/* Amenities Grid */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Included Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Array.isArray(active.amenities) ? active.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs font-semibold text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{typeof item === 'string' ? item : item.name || item.title}</span>
                    </div>
                  )) : (
                    <div className="text-xs text-slate-500">Wi-Fi, Water Purifier, Furnished, Power Backup</div>
                  )}
                </div>

              </div>

              {/* Nearby Services Radar */}
              {active.nearbyServicesRadar && active.nearbyServicesRadar.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Nearby Essential Services Radar</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {active.nearbyServicesRadar.map((srv, idx) => (
                      <div key={idx} className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 text-xs flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900">{srv.name}</p>
                          <p className="text-[10px] text-blue-600 font-bold uppercase">{srv.category}</p>
                        </div>
                        <span className="bg-white text-blue-800 text-[11px] font-extrabold px-2 py-0.5 rounded-md border border-blue-200">
                          {srv.distance}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: HOUSE RULES & TRANSPARENCY */}
          {activeTab === 'rules' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>RoomNest Transparency Guarantee:</strong> All house rules below are verified directly with the owner to eliminate surprises on move-in day.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">Curfew & Gate Timings</span>
                  <p className="text-sm font-extrabold text-slate-900">{active.houseRules?.curfew || (active.houseRules?.curfewEnabled ? `Curfew ${active.houseRules.curfewTime}` : 'No Curfew')}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">Food Restrictions</span>
                  <p className="text-sm font-extrabold text-slate-900">{active.houseRules?.foodPreference || (active.foodIncluded ? 'Hygienic meals included' : 'Self Cook / Tiffin')}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">Visitors & Guest Policy</span>
                  <p className="text-sm font-extrabold text-slate-900">{active.houseRules?.visitorsPolicy || (active.houseRules?.visitorsAllowed ? 'Visitors Allowed' : 'No Visitors')}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">Pet Policy</span>
                  <p className="text-sm font-extrabold text-slate-900">{active.houseRules?.petsPolicy || (active.houseRules?.petsAllowed ? 'Pets Allowed' : 'Not Allowed')}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DYNAMIC MONTHLY COST CALCULATOR */}
          {activeTab === 'calculator' && (
            <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-6 animate-fade-in shadow-xl">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-heading text-white">Interactive Monthly Cost Calculator</h3>
                  <p className="text-xs text-slate-400">Estimate your actual total living cost in Bhubaneswar per month</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Sliders Left */}
                <div className="space-y-4 text-xs font-semibold">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Room Rent & Maintenance:</span>
                      <span className="text-emerald-400 font-bold">₹{rentVal + maintVal}/mo</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Est. Electricity Units ({elecUnits} kWh @ ₹7/unit):</span>
                      <span className="text-blue-400 font-bold">₹{estimatedElectricity}/mo</span>
                    </div>
                    <input 
                      type="range" 
                      min="30" 
                      max="300" 
                      value={elecUnits} 
                      onChange={(e) => setElecUnits(parseInt(e.target.value, 10))}
                      className="w-full accent-blue-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Daily Tiffin / Food Mess Subscription:</span>
                      <span className="text-amber-400 font-bold">₹{foodCost}/mo</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="6000" 
                      step="200"
                      value={foodCost} 
                      onChange={(e) => setFoodCost(parseInt(e.target.value, 10))}
                      className="w-full accent-amber-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>WiFi Fiber Internet Plan:</span>
                      <span className="text-purple-400 font-bold">₹{wifiCost}/mo</span>
                    </div>
                  </div>
                </div>

                {/* Total Budget Card Right */}
                <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 flex flex-col justify-between text-center">
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Total Estimated Monthly Living Budget</span>
                    <div className="text-4xl font-black text-emerald-400 font-heading my-4">
                      ₹{totalMonthlyBudget.toLocaleString('en-IN')}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Includes Rent + Maintenance + Sub-meter Electricity + Tiffin + WiFi + Doorstep Laundry
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: MOVE-IN CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">Tenant Move-In Verification Checklist</h3>
                  <p className="text-xs text-slate-500">Complete these checks prior to paying final security deposit</p>
                </div>
                <button
                  onClick={handleDownloadChecklist}
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>

              <div className="space-y-2">
                {checklistItems.map(item => (
                  <label 
                    key={item.id}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      item.checked ? 'bg-emerald-50/60 border-emerald-200 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <input 
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleChecklistItem(item.id)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-bold">{item.text}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <div className="text-3xl font-black text-blue-600 font-heading">{active.rating || 4.8}</div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 font-semibold mt-1">Based on {active.reviewCount || 0} verified tenant reviews</p>
                </div>
              </div>

              <div className="space-y-3">
                {active.reviews && active.reviews.length > 0 ? (
                  active.reviews.map(rev => (
                    <div key={rev.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{rev.user} ({rev.userRole})</span>
                        <span className="text-slate-400">{rev.date}</span>
                      </div>
                      <p className="text-xs text-slate-700 italic">"{rev.comment}"</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic py-4 text-center">No reviews yet for this listing. Be the first tenant to leave a review!</p>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
