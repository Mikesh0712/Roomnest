import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, Heart, User, Truck, Home, Layers, ChevronDown, Sun, Moon, LogOut, Users, Globe, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const {
    selectedCity, setSelectedCity,
    wishlist, activeTab, setActiveTab,
    setAuthModalOpen, currentUser, setCurrentUser, setCurrentRole,
    theme, toggleTheme
  } = useApp();

  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    setCurrentUser(null);
    setCurrentRole('tenant');
    setMobileMenuOpen(false);
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className={`rn-navbar ${theme === 'dark' ? 'rn-navbar-dark' : ''}`}>
      <div className="rn-navbar-inner">

        {/* Logo */}
        <div className="rn-logo" onClick={() => handleNavClick('listings')} id="logo-btn">
          <img src="/logo.png" alt="RoomNest Logo" className="rn-logo-img" />
          <div>
            <div className="rn-logo-text">Room<span>Nest</span></div>
            <div className="rn-logo-sub">{t('tagline')}</div>
          </div>
        </div>

        {/* Desktop Nav Tabs */}
        <nav className="rn-nav-tabs">
          <button className={`rn-nav-tab ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => handleNavClick('listings')} id="nav-properties">
            <Home size={14} /> {t('navProperties')}
          </button>
          <button className={`rn-nav-tab ${activeTab === 'community' ? 'active' : ''}`}
            onClick={() => handleNavClick('community')} id="nav-community">
            <Users size={14} /> {t('navCommunity')}
          </button>
          <button className={`rn-nav-tab ${activeTab === 'relocation' ? 'active' : ''}`}
            onClick={() => handleNavClick('relocation')} id="nav-relocation">
            <Truck size={14} /> {t('navRelocation')}
          </button>
          <button className={`rn-nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')} id="nav-dashboard">
            <Layers size={14} /> {t('navDashboard')}
          </button>
        </nav>

        {/* Right Actions */}
        <div className="rn-navbar-actions">

          {/* Language Selector (Desktop & Tablet) */}
          <div className="rn-lang-select rn-desktop-only" title="Change Language">
            <Globe size={14} color="var(--teal)" />
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              id="language-selector"
              aria-label="Select Interface Language"
            >
              <option value="en">English (EN)</option>
              <option value="hi">हिन्दी (HI)</option>
              <option value="od">ଓଡ଼ିଆ (OD)</option>
            </select>
            <ChevronDown size={11} />
          </div>

          {/* City Selector (Desktop & Tablet) */}
          <div className="rn-city-select rn-desktop-only">
            <MapPin size={14} color="var(--teal)" />
            <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} id="city-selector">
              <option value="Bhubaneswar">Bhubaneswar</option>
              <option value="Cuttack" disabled>Cuttack (Soon)</option>
              <option value="Bangalore" disabled>Bangalore (Soon)</option>
            </select>
            <ChevronDown size={12} />
          </div>

          {/* Theme Toggle */}
          <button className="rn-theme-btn" onClick={toggleTheme} title="Toggle theme" id="theme-toggle">
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Wishlist */}
          <button className="rn-wishlist-btn" onClick={() => handleNavClick('dashboard')}
            title="Wishlist" id="wishlist-btn">
            <Heart size={17} />
            {wishlist.length > 0 && (
              <span className="rn-wishlist-badge">{wishlist.length}</span>
            )}
          </button>

          {/* Sign In / User Menu */}
          {currentUser ? (
            <div className="rn-user-menu" id="user-menu">
              <div className="rn-user-avatar">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="rn-user-info rn-desktop-only">
                <span className="rn-user-name">{currentUser.name.split(' ')[0]}</span>
                <span className="rn-user-role">{currentUser.role}</span>
              </div>
              <button className="rn-signout-btn" onClick={handleSignOut} title="Sign Out" id="signout-btn">
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button className="rn-signin-btn" onClick={() => setAuthModalOpen(true)} id="signin-btn">
              <User size={15} />
              <span className="rn-signin-text">{t('signIn')}</span>
            </button>
          )}

          {/* Mobile Hamburger Button */}
          <button
            className="rn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="rn-mobile-drawer animate-fade-in">
          <div className="rn-mobile-drawer-inner">
            <div className="rn-mobile-drawer-section">
              <div className="rn-mobile-drawer-label">Navigation</div>
              <div className="rn-mobile-drawer-links">
                <button
                  className={`rn-mobile-drawer-link ${activeTab === 'listings' ? 'active' : ''}`}
                  onClick={() => handleNavClick('listings')}
                >
                  <Home size={16} /> {t('navProperties')}
                </button>
                <button
                  className={`rn-mobile-drawer-link ${activeTab === 'community' ? 'active' : ''}`}
                  onClick={() => handleNavClick('community')}
                >
                  <Users size={16} /> {t('navCommunity')}
                </button>
                <button
                  className={`rn-mobile-drawer-link ${activeTab === 'relocation' ? 'active' : ''}`}
                  onClick={() => handleNavClick('relocation')}
                >
                  <Truck size={16} /> {t('navRelocation')}
                </button>
                <button
                  className={`rn-mobile-drawer-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => handleNavClick('dashboard')}
                >
                  <Layers size={16} /> {t('navDashboard')}
                </button>
              </div>
            </div>

            <div className="rn-mobile-drawer-section">
              <div className="rn-mobile-drawer-label">Preferences</div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <div className="rn-lang-select" style={{ flex: 1 }}>
                  <Globe size={14} color="var(--teal)" />
                  <select
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                    aria-label="Select Interface Language"
                    style={{ width: '100%' }}
                  >
                    <option value="en">English (EN)</option>
                    <option value="hi">हिन्दी (HI)</option>
                    <option value="od">ଓଡ଼ିଆ (OD)</option>
                  </select>
                </div>

                <div className="rn-city-select" style={{ flex: 1 }}>
                  <MapPin size={14} color="var(--teal)" />
                  <select
                    value={selectedCity}
                    onChange={e => setSelectedCity(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="Bhubaneswar">Bhubaneswar</option>
                    <option value="Cuttack" disabled>Cuttack</option>
                    <option value="Bangalore" disabled>Bangalore</option>
                  </select>
                </div>
              </div>
            </div>

            {!currentUser && (
              <button
                className="rn-signin-btn"
                style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                onClick={() => { setMobileMenuOpen(false); setAuthModalOpen(true); }}
              >
                <User size={16} /> {t('signIn')}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
