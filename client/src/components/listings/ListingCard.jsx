import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { calculateSafetyScore } from '../../utils/safetyScore';
import {
  Heart, MapPin, ShieldCheck, Star, Check, Calendar,
  Wifi, Clock, Utensils, ChevronLeft, ChevronRight,
  Building2, Users, BedDouble, Home, CheckSquare, Square,
  ShieldAlert, Shield
} from 'lucide-react';

const PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop&q=80',
];

function pickImage(listing) {
  if (listing.images && listing.images.length > 0) return listing.images;
  const idx = (listing.id?.charCodeAt(listing.id.length - 1) || 0) % PLACEHOLDERS.length;
  return [PLACEHOLDERS[idx], PLACEHOLDERS[(idx+1) % PLACEHOLDERS.length]];
}

export const ListingCard = ({ listing }) => {
  const {
    wishlist,
    toggleWishlist,
    setSelectedProperty,
    setPropertyModalOpen,
    setActiveListing,
    compareList,
    toggleCompare
  } = useApp();

  const { t } = useLanguage();
  const [imgIdx, setImgIdx] = useState(0);
  const images = pickImage(listing);
  const inWishlist = wishlist.some(w => w.id === listing.id);
  const isCompared = compareList.some(c => c.id === listing.id);

  // Compute safety assessment
  const safety = calculateSafetyScore(listing);

  const openDetail = () => {
    setSelectedProperty(listing);
    setActiveListing(listing);
    setPropertyModalOpen(true);
  };

  return (
    <div className={`rn-card ${isCompared ? 'rn-card-compared' : ''}`} id={`listing-card-${listing.id}`}>

      {/* Image */}
      <div className="rn-card-img" onClick={openDetail}>
        <img
          src={images[imgIdx]}
          alt={listing.title}
          onError={e => { e.target.src = PLACEHOLDERS[0]; }}
        />

        {/* Badges Overlay */}
        <div className="rn-card-badges">
          {/* AI Safety Score Badge */}
          <span
            className={`rn-safety-badge rn-safety-${safety.level}`}
            title={`AI Safety Assessment: ${safety.score}/100 - ${safety.label}`}
          >
            <span className="rn-safety-dot" />
            {safety.level === 'safe' ? '🟢' : safety.level === 'caution' ? '🟡' : '🔴'} {safety.score}/100 {t(safety.level)}
          </span>

          {listing.verifiedOwner && (
            <span className="rn-badge rn-badge-verified">
              <ShieldCheck size={10} /> {t('verified')}
            </span>
          )}
          {listing.isFeatured && (
            <span className="rn-badge rn-badge-featured">⚡ {t('featured')}</span>
          )}
          {listing.isAvailable && (
            <span className="rn-badge rn-badge-live">
              <span className="rn-badge-live-dot" /> {t('available')}
            </span>
          )}
        </div>

        {/* Compare Checkbox Button */}
        <button
          className={`rn-card-compare-btn ${isCompared ? 'active' : ''}`}
          onClick={e => { e.stopPropagation(); toggleCompare(listing); }}
          title={isCompared ? "Remove from comparison" : "Add to comparison"}
          id={`compare-btn-${listing.id}`}
        >
          {isCompared ? <CheckSquare size={14} color="#00a896" /> : <Square size={14} color="#718096" />}
          <span>{t('compare')}</span>
        </button>

        {/* Wishlist */}
        <button
          className={`rn-card-wishlist ${inWishlist ? 'loved' : ''}`}
          onClick={e => { e.stopPropagation(); toggleWishlist(listing); }}
          id={`wishlist-btn-${listing.id}`}
        >
          <Heart size={15} fill={inWishlist ? '#e53e3e' : 'none'} color={inWishlist ? '#e53e3e' : '#4a5568'} />
        </button>

        {/* Image Nav */}
        {images.length > 1 && (
          <>
            <button
              onClick={e => { e.stopPropagation(); setImgIdx(i => Math.max(0, i-1)); }}
              style={{
                position:'absolute', left:8, top:'50%', transform:'translateY(-50%)',
                background:'rgba(255,255,255,0.9)', border:'none', borderRadius:'50%',
                width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center',
                cursor:'pointer', opacity: imgIdx === 0 ? 0.3 : 1, zIndex: 10
              }}
            ><ChevronLeft size={14} /></button>
            <button
              onClick={e => { e.stopPropagation(); setImgIdx(i => Math.min(images.length-1, i+1)); }}
              style={{
                position:'absolute', right:8, top:'50%', transform:'translateY(-50%)',
                background:'rgba(255,255,255,0.9)', border:'none', borderRadius:'50%',
                width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center',
                cursor:'pointer', opacity: imgIdx === images.length-1 ? 0.3 : 1, zIndex: 10
              }}
            ><ChevronRight size={14} /></button>
            <div className="rn-card-img-nav">
              {images.map((_, i) => (
                <div key={i} className={`rn-card-img-dot ${i === imgIdx ? 'active' : ''}`} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Body */}
      <div className="rn-card-body" onClick={openDetail}>

        {/* Hub tag */}
        {listing.nearbyHub && (
          <div className="rn-card-hub">
            📍 {listing.nearbyHub.name} · {listing.nearbyHub.distance}
          </div>
        )}

        <h3 className="rn-card-title">{listing.title}</h3>

        <div className="rn-card-location">
          <MapPin size={11} />
          {listing.locality}, {listing.city || 'Bhubaneswar'}
        </div>

        {/* Amenities */}
        <div className="rn-card-amenities">
          {Array.isArray(listing.amenities) ? (
            listing.amenities.slice(0, 4).map((a, i) => (
              <span className="rn-amenity" key={i}><Check size={10} /> {typeof a === 'string' ? a : a.title || a.name}</span>
            ))
          ) : (
            <>
              {listing.amenities?.wifi !== false && (
                <span className="rn-amenity"><Wifi size={10} /> WiFi</span>
              )}
              {listing.amenities?.meals && (
                <span className="rn-amenity"><Utensils size={10} /> Meals</span>
              )}
              {listing.tenantType && listing.tenantType !== 'All' && (
                <span className="rn-amenity"><Users size={10} /> {listing.tenantType}</span>
              )}
              {listing.propertyType && (
                <span className="rn-amenity"><BedDouble size={10} /> {listing.propertyType}</span>
              )}
            </>
          )}
        </div>

        {/* House Rules */}
        {listing.houseRules && (
          <div className="rn-rules-strip">
            {listing.houseRules.curfew && (
              <span className={`rn-rule-chip ${listing.houseRules.curfew.toLowerCase().includes('no curfew') ? 'green' : 'amber'}`}>
                🕙 {listing.houseRules.curfew}
              </span>
            )}
            {listing.houseRules.smokingDrinking && (
              <span className={`rn-rule-chip ${listing.houseRules.smokingDrinking.toLowerCase().includes('not allowed') ? '' : 'green'}`}>
                🚭 {listing.houseRules.smokingDrinking}
              </span>
            )}
            {listing.houseRules.petsPolicy && (
              <span className="rn-rule-chip">
                🐾 {listing.houseRules.petsPolicy}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="rn-card-footer">
          <div>
            <div className="rn-card-rent">
              ₹{Number(listing.rent).toLocaleString()}
              <span>{t('perMonth')}</span>
            </div>
            {listing.securityDeposit && (
              <div style={{ fontSize: 11, color: 'var(--slate-light)', marginTop: 2 }}>
                {t('deposit')}: ₹{Number(listing.securityDeposit).toLocaleString()}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 6 }}>
            {listing.rating && (
              <div className="rn-card-rating">
                <Star size={11} fill="#f59e0b" color="#f59e0b" />
                {listing.rating} ({listing.reviewCount || 0})
              </div>
            )}
            <button
              className="rn-card-cta"
              onClick={e => { e.stopPropagation(); openDetail(); }}
              id={`view-btn-${listing.id}`}
            >
              {t('viewDetails')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

