import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Search, GraduationCap, Briefcase, MapPin, CheckCircle2, Star, Shield, Sparkles } from 'lucide-react';

const POPULAR = [
  { label: 'KIIT University', hub: 'college' },
  { label: 'Infocity IT Park', hub: 'office' },
  { label: 'Patia', hub: 'locality' },
  { label: 'Chandrasekharpur', hub: 'locality' },
];

const TABS = [
  { key: 'college', label: 'By College', icon: <GraduationCap size={14} /> },
  { key: 'office',  label: 'By Office Hub', icon: <Briefcase size={14} /> },
  { key: 'locality',label: 'By Locality', icon: <MapPin size={14} /> },
];

export const HeroSearch = () => {
  const { filters, setFilters } = useApp();
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [activeHub, setActiveHub] = useState('college');

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, searchQuery: query, search: query, hubType: activeHub }));
  };

  return (
    <section className="rn-hero">
      {/* Background */}
      <div className="rn-hero-bg" />
      <div className="rn-hero-overlay" />

      <div className="rn-hero-content">

        {/* Badge */}
        <div className="rn-hero-badge">
          <Shield size={11} />
          {t('perk1Title')} · Bhubaneswar
        </div>

        {/* Headline */}
        <h1 className="rn-hero-title">
          {t('heroTitle')}
        </h1>
        <p className="rn-hero-sub">
          {t('heroSub')}
        </p>

        {/* Search Box */}
        <div className="rn-search-box">
          {/* Hub Tabs */}
          <div className="rn-search-tabs">
            {TABS.map(tTab => (
              <button
                key={tTab.key}
                className={`rn-search-tab ${activeHub === tTab.key ? 'active' : ''}`}
                onClick={() => setActiveHub(tTab.key)}
                id={`search-tab-${tTab.key}`}
              >
                {tTab.icon} {tTab.label}
              </button>
            ))}
          </div>

          {/* Input Row */}
          <div className="rn-search-row">
            <Search size={18} color="#b0bac5" style={{ flexShrink: 0 }} />
            <input
              className="rn-search-input"
              placeholder={t('searchPlaceholder')}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              id="hero-search-input"
            />
            <button className="rn-search-btn" onClick={handleSearch} id="hero-search-btn">
              <Search size={15} />
              {t('searchBtn')}
            </button>
          </div>
        </div>

        {/* Popular Tags */}
        <div className="rn-popular-tags">
          <span className="rn-popular-label">{t('popularSearches')}</span>

          {POPULAR.map(p => (
            <button
              key={p.label}
              className="rn-popular-tag"
              onClick={() => {
                setActiveHub(p.hub);
                setQuery(p.label);
                setFilters(prev => ({ ...prev, searchQuery: p.label, hubType: p.hub }));
              }}
              id={`popular-tag-${p.label.replace(/\s+/g,'-').toLowerCase()}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="rn-hero-stats">
          <div className="rn-stat">
            <div className="rn-stat-num">500+</div>
            <div className="rn-stat-label">Verified Listings</div>
          </div>
          <div className="rn-stat">
            <div className="rn-stat-num">98%</div>
            <div className="rn-stat-label">Owner Direct</div>
          </div>
          <div className="rn-stat">
            <div className="rn-stat-num">4.8★</div>
            <div className="rn-stat-label">Avg Rating</div>
          </div>
        </div>

      </div>
    </section>
  );
};
