import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { useLanguage } from './context/LanguageContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroSearch } from './components/home/HeroSearch';
import { FilterBar } from './components/listings/FilterBar';
import { ListingCard } from './components/listings/ListingCard';
import { InteractiveMap } from './components/listings/InteractiveMap';
import { PropertyDetailModal } from './components/property/PropertyDetailModal';
import { VisitBookingModal } from './components/property/VisitBookingModal';
import { RelocationHub } from './components/relocation/RelocationHub';
import { TenantForum } from './components/forum/TenantForum';
import { ComparisonModal } from './components/comparison/ComparisonModal';
import { DashboardManager } from './components/dashboard/DashboardManager';
import { AuthModal } from './components/common/AuthModal';
import { CostCalculator } from './components/home/CostCalculator';
import { Sparkles, MapPin, Shield, Wifi, Truck, Coffee, Home, Layers, Users, CheckSquare, X, ArrowRight } from 'lucide-react';

const MainContent = () => {
  const {
    listings,
    filters,
    activeTab,
    setActiveTab,
    toastMessage,
    theme,
    compareList,
    setIsCompareModalOpen,
    clearCompare
  } = useApp();

  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState('split');

  const PERKS = [
    { icon: <Shield size={20} />, title: t('perk1Title'), sub: t('perk1Sub') },
    { icon: <Sparkles size={20} />, title: t('perk2Title'), sub: t('perk2Sub') },
    { icon: <Users size={20} />, title: t('perk3Title'), sub: t('perk3Sub') },
    { icon: <Coffee size={20} />, title: t('perk4Title'), sub: t('perk4Sub') },
  ];

  // Filter listings based on user filter options
  const filteredListings = listings.filter(item => {
    // 1. Max Rent Filter
    if (filters.maxRent && Number(item.rent || 0) > filters.maxRent) return false;

    // 2. Property Type Filter
    if (filters.propertyType && filters.propertyType !== 'All') {
      const target = filters.propertyType.toLowerCase();
      const pType = (item.propertyType || '').toLowerCase();
      const pTitle = (item.title || '').toLowerCase();
      const full = `${pType} ${pTitle}`;

      if (target === 'pg') {
        if (!full.includes('pg') && !full.includes('hostel') && !full.includes('paying guest') && !full.includes('studio')) return false;
      } else if (target === 'flat' || target === '1bhk') {
        if (!full.includes('flat') && !full.includes('bhk') && !full.includes('apartment')) return false;
      } else if (target === 'room') {
        if (!full.includes('room') && !full.includes('sharing') && !full.includes('hostel')) return false;
      } else if (target === 'studio') {
        if (!full.includes('studio') && !full.includes('1bhk')) return false;
      } else {
        if (!full.includes(target)) return false;
      }
    }

    // 3. Tenant / Gender Preference Filter
    if (filters.tenantType && filters.tenantType !== 'All') {
      const target = filters.tenantType.toLowerCase();
      const suitable = Array.isArray(item.suitableFor) ? item.suitableFor.join(' ').toLowerCase() : '';
      const text = `${item.tenantType || ''} ${item.genderPreference || ''} ${item.title || ''} ${suitable}`.toLowerCase();
      
      if (target === 'boys') {
        if (!text.includes('boy') && !text.includes('bachelor') && !text.includes('unisex') && !text.includes('male')) return false;
      } else if (target === 'girls') {
        if (!text.includes('girl') && !text.includes('female') && !text.includes('unisex') && !text.includes('women')) return false;
      } else if (target === 'family') {
        if (!text.includes('family') && !text.includes('couple') && !text.includes('2bhk') && !text.includes('3bhk')) return false;
      } else if (target === 'unisex') {
        if (!text.includes('unisex')) return false;
      } else {
        if (!text.includes(target)) return false;
      }
    }

    // 4. Verified Only Filter
    if (filters.verifiedOnly) {
      if (!item.verifiedOwner && !item.verificationStatus?.toLowerCase().includes('verified')) return false;
    }

    // 5. Available Only Filter
    if (filters.availableOnly) {
      if (item.isAvailable === false) return false;
    }

    // 6. Search Query Filter
    if (filters.search || filters.searchQuery) {
      const q = (filters.search || filters.searchQuery).toLowerCase();
      const searchable = `${item.title || ''} ${item.locality || ''} ${item.address || ''} ${item.propertyType || ''}`.toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    return true;
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={`rn-main-mobile-pad`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--surface-2)' }}>

      {/* Toast */}
      {toastMessage && (
        <div className="rn-toast">
          <Sparkles size={15} color="#4dffd8" />
          {toastMessage}
        </div>
      )}

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="rn-main-mobile-pad" style={{ flex: 1 }}>

        {activeTab === 'listings' && (
          <>
            <HeroSearch />

            {/* Perks Strip */}
            <div className="rn-perks-strip">
              <div className="rn-perks-inner">
                {PERKS.map(p => (
                  <div className="rn-perk" key={p.title}>
                    <div className="rn-perk-icon">{p.icon}</div>
                    <div>
                      <div className="rn-perk-title">{p.title}</div>
                      <div className="rn-perk-sub">{p.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter Bar */}
            <FilterBar viewMode={viewMode} setViewMode={setViewMode} />

            {/* Listings + Map */}
            <div className="rn-listings-area">
              <div className="rn-listings-header">
                <p className="rn-listings-count">
                  {t('showing')} <strong>{filteredListings.length}</strong> {t('of')} {listings.length} {t('propertiesInBBSR')}
                </p>
              </div>

              {viewMode === 'split' ? (
                <div className="rn-listings-grid-split">
                  <div className="rn-listings-cards-col">
                    {filteredListings.length > 0 ? filteredListings.map(item => (
                      <ListingCard key={item.id} listing={item} />
                    )) : (
                      <div className="rn-empty" style={{ gridColumn: '1/-1' }}>
                        <div className="rn-empty-icon">🏠</div>
                        <div className="rn-empty-title">No matching properties found</div>
                        <div className="rn-empty-sub">Try adjusting your filters or budget slider.</div>
                      </div>
                    )}
                  </div>
                  <div className="rn-listings-map-col">
                    <div className="rn-map-panel" style={{ height: '100%' }}>
                      <InteractiveMap />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rn-listings-cards-col">
                  {filteredListings.length > 0 ? filteredListings.map(item => (
                    <ListingCard key={item.id} listing={item} />
                  )) : (
                    <div className="rn-empty" style={{ gridColumn: '1/-1' }}>
                      <div className="rn-empty-icon">🏠</div>
                      <div className="rn-empty-title">No matching properties found</div>
                      <div className="rn-empty-sub">Try adjusting your filters or budget slider.</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cost Calculator Section */}
            <div style={{ background: 'var(--surface-2)', padding: '0 0 48px' }}>
              <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
                <div style={{ marginBottom: 24 }}>
                  <div className="rn-section-label">💰 Financial Planning</div>
                  <h2 className="rn-section-title">{t('calculatorTitle')}</h2>
                  <p className="rn-section-sub">{t('calculatorSub')}</p>
                </div>
                <CostCalculator />
              </div>
            </div>
          </>
        )}

        {activeTab === 'community' && <TenantForum />}
        {activeTab === 'relocation' && <RelocationHub />}
        {activeTab === 'dashboard' && <DashboardManager />}

      </main>

      {/* Floating Property Comparison Bar */}
      {compareList.length > 0 && (
        <div className="rn-compare-tray animate-slide-up">
          <div className="rn-compare-tray-inner">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-teal-500 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-sm">
                {compareList.length}
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs">
                  {compareList.length === 1 ? '1 Property Selected' : `${compareList.length} Properties in Comparison`}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {compareList.length < 2 ? 'Select 1 more to unlock radar & service comparison' : 'Ready for side-by-side radar & services comparison'}
                </p>
              </div>
            </div>

            {/* Selected Thumbnails */}
            <div className="hidden sm:flex items-center gap-2">
              {compareList.map(item => (
                <div key={item.id} className="relative group">
                  <img
                    src={(item.images && item.images[0]) || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=100&q=80'}
                    alt={item.title}
                    className="w-10 h-10 rounded-xl object-cover border-2 border-teal-500 shadow-sm"
                  />
                  <button
                    onClick={() => clearCompare()}
                    className="absolute -top-1.5 -right-1.5 bg-slate-800 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={clearCompare}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-3 py-2"
              >
                {t('clearCompare')}
              </button>
              <button
                onClick={() => setIsCompareModalOpen(true)}
                disabled={compareList.length < 2}
                className={`flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all ${
                  compareList.length >= 2
                    ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
                id="open-compare-btn"
              >
                <span>{t('compareNow')}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <PropertyDetailModal />
      <VisitBookingModal />
      <ComparisonModal />
      <AuthModal />

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Nav */}
      <nav className="rn-mobile-nav">
        <button className={`rn-mobile-nav-btn ${activeTab === 'listings' ? 'active' : ''}`} onClick={() => setActiveTab('listings')}>
          <Home size={20} />
          <span>Find</span>
        </button>
        <button className={`rn-mobile-nav-btn ${activeTab === 'community' ? 'active' : ''}`} onClick={() => setActiveTab('community')}>
          <Users size={20} />
          <span>Forum</span>
        </button>
        <button className={`rn-mobile-nav-btn ${activeTab === 'relocation' ? 'active' : ''}`} onClick={() => setActiveTab('relocation')}>
          <Truck size={20} />
          <span>Services</span>
        </button>
        <button className={`rn-mobile-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          <Layers size={20} />
          <span>Dashboard</span>
        </button>
      </nav>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

