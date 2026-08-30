import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { SlidersHorizontal, ShieldCheck, Grid3x3, LayoutList, RotateCcw, ChevronDown } from 'lucide-react';

export const FilterBar = ({ viewMode, setViewMode }) => {
  const { filters, setFilters, listings: allListings } = useApp();
  const { t } = useLanguage();
  const [showRentPopup, setShowRentPopup] = useState(false);

  const TENANT_OPTS = [
    { value: 'All', label: t('filterTenantAll') },
    { value: 'Boys', label: t('filterTenantBoys') },
    { value: 'Girls', label: t('filterTenantGirls') },
    { value: 'Unisex', label: t('filterTenantUnisex') },
    { value: 'Family', label: t('filterTenantFamily') }
  ];

  const TYPE_OPTS = [
    { value: 'All', label: t('filterTypeAll') },
    { value: 'PG', label: t('filterTypePG') },
    { value: 'Flat', label: t('filterTypeFlat') },
    { value: 'Room', label: t('filterTypeRoom') },
    { value: 'Studio', label: t('filterTypeStudio') },
    { value: '1BHK', label: t('filterType1BHK') }
  ];

  const setFilter = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));

  const resetAll = () => setFilters({
    searchQuery: '', hubType: 'college',
    maxRent: 20000, tenantType: 'All', propertyType: 'All',
    verifiedOnly: false, availableOnly: false
  });

  return (
    <div className="rn-filter-bar">
      <div className="rn-filter-inner">

        {/* Verified toggle */}
        <button
          className={`rn-filter-chip ${filters.verifiedOnly ? 'active' : ''}`}
          onClick={() => setFilter('verifiedOnly', !filters.verifiedOnly)}
          id="filter-verified"
        >
          <ShieldCheck size={13} />
          {t('filterVerified')}
        </button>

        {/* Available toggle */}
        <button
          className={`rn-filter-chip ${filters.availableOnly ? 'active' : ''}`}
          onClick={() => setFilter('availableOnly', !filters.availableOnly)}
          id="filter-available"
        >
          ✅ {t('filterAvailable')}
        </button>

        {/* Tenant type */}
        <div style={{ position: 'relative' }}>
          <select
            value={filters.tenantType || 'All'}
            onChange={e => setFilter('tenantType', e.target.value)}
            className="rn-filter-chip"
            style={{ cursor: 'pointer', paddingRight: 28 }}
            id="filter-tenant"
          >
            {TENANT_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Property type */}
        <select
          value={filters.propertyType || 'All'}
          onChange={e => setFilter('propertyType', e.target.value)}
          className="rn-filter-chip"
          style={{ cursor: 'pointer' }}
          id="filter-type"
        >
          {TYPE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {/* Rent range */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            className={`rn-filter-chip ${filters.maxRent < 20000 ? 'active' : ''}`}
            style={{ gap: 8 }}
            onClick={() => setShowRentPopup(p => !p)}
            id="filter-rent-btn"
          >
            <SlidersHorizontal size={13} />
            {t('budget')}: ₹{(filters.maxRent || 20000).toLocaleString()}
            <ChevronDown size={12} />
          </button>

          {showRentPopup && (
            <div style={{
              position:'absolute', top:'100%', left:0, marginTop:8,
              background:'white', border:'1px solid var(--border)',
              borderRadius:12, padding:'16px 20px', boxShadow:'0 8px 24px rgba(0,0,0,0.12)',
              zIndex:60, width:260
            }}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
                <span style={{fontSize:13,fontWeight:600,color:'var(--navy)'}}>Max Budget</span>
                <strong style={{fontSize:14,color:'var(--teal)'}}>₹{(filters.maxRent||20000).toLocaleString()}/mo</strong>
              </div>
              <input
                type="range"
                className="rn-rent-slider"
                min={3000} max={30000} step={500}
                value={filters.maxRent || 20000}
                onChange={e => setFilter('maxRent', Number(e.target.value))}
                id="filter-rent-slider"
              />
              <div style={{display:'flex',justifyContent:'space-between',marginTop:6,fontSize:11,color:'var(--slate-light)'}}>
                <span>₹3,000</span><span>₹30,000</span>
              </div>
              <button
                onClick={() => setShowRentPopup(false)}
                style={{
                  marginTop:12,width:'100%',background:'var(--teal)',color:'white',
                  border:'none',borderRadius:8,padding:'8px 0',fontSize:13,fontWeight:600,cursor:'pointer'
                }}
              >Apply</button>
            </div>
          )}
        </div>

        {/* Reset */}
        <button className="rn-filter-chip" onClick={resetAll} id="filter-reset" style={{ marginLeft: 4 }}>
          <RotateCcw size={12} />
          Reset
        </button>

        {/* View Toggle */}
        <div className="rn-view-toggle">
          <button
            className={`rn-view-btn ${viewMode === 'split' ? 'active' : ''}`}
            onClick={() => setViewMode('split')}
            title="Map + List"
            id="view-split"
          >
            <LayoutList size={16} />
          </button>
          <button
            className={`rn-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid"
            id="view-grid"
          >
            <Grid3x3 size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};
