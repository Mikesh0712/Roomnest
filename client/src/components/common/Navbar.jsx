import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, Heart, User, Truck, Home, Layers, ChevronDown, Sun, Moon, LogOut, Users, Globe } from 'lucide-react';

export const Navbar = () => {
  const {
    selectedCity, setSelectedCity,
    wishlist, activeTab, setActiveTab,
    setAuthModalOpen, currentUser, setCurrentUser, setCurrentRole,
    theme, toggleTheme
  } = useApp();

  const { language, setLanguage, t } = useLanguage();

  const handleSignOut = () => {
    setCurrentUser(null);
    setCurrentRole('tenant');
  };

  return (
    <header className={`rn-navbar ${theme === 'dark' ? 'rn-navbar-dark' : ''}`}>
      <div className="rn-navbar-inner">

        {/* Logo */}
        <div className="rn-logo" onClick={() => setActiveTab('listings')} id="logo-btn">
          <img src="/logo.png" alt="RoomNest Logo" className="rn-logo-img" />
          <div>
            <div className="rn-logo-text">Room<span>Nest</span></div>
            <div className="rn-logo-sub">{t('tagline')}</div>
          </div>
        </div>

        {/* Nav Tabs */}
        <nav className="rn-nav-tabs">
          <button className={`rn-nav-tab ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => setActiveTab('listings')} id="nav-properties">
            <Home size={14} /> {t('navProperties')}
          </button>
          <button className={`rn-nav-tab ${activeTab === 'community' ? 'active' : ''}`}
            onClick={() => setActiveTab('community')} id="nav-community">
            <Users size={14} /> {t('navCommunity')}
          </button>
          <button className={`rn-nav-tab ${activeTab === 'relocation' ? 'active' : ''}`}
            onClick={() => setActiveTab('relocation')} id="nav-relocation">
            <Truck size={14} /> {t('navRelocation')}
          </button>
          <button className={`rn-nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')} id="nav-dashboard">
            <Layers size={14} /> {t('navDashboard')}
          </button>
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

          {/* Language Selector */}
          <div className="rn-lang-select" title="Change Language">
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

          {/* City Selector */}
          <div className="rn-city-select">
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
          <button className="rn-wishlist-btn" onClick={() => setActiveTab('dashboard')}
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
              <div className="rn-user-info">
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
              {t('signIn')}
            </button>
          )}

        </div>
      </div>
    </header>
  );
};

