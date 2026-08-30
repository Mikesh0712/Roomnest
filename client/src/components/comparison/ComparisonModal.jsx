import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { calculateSafetyScore } from '../../utils/safetyScore';
import {
  X,
  ShieldCheck,
  Star,
  Layers,
  Utensils,
  TrendingUp,
  Activity
} from 'lucide-react';

export const ComparisonModal = () => {
  const {
    compareList,
    toggleCompare,
    clearCompare,
    isCompareModalOpen,
    setIsCompareModalOpen,
    setSelectedProperty,
    setPropertyModalOpen,
    setBookingModalListing
  } = useApp();
  const { t } = useLanguage();
  const modalScrollRef = useRef(null);

  // Scroll to top when comparison modal opens or changes
  useEffect(() => {
    if (isCompareModalOpen && modalScrollRef.current) {
      modalScrollRef.current.scrollTop = 0;
    }
  }, [isCompareModalOpen, compareList.length]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCompareModalOpen) {
        setIsCompareModalOpen(false);
      }
    };
    if (isCompareModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCompareModalOpen, setIsCompareModalOpen]);

  if (!isCompareModalOpen || compareList.length === 0) return null;

  const maxRent = Math.max(...compareList.map(p => Number(p.rent || 0)), 10000);

  // Compute metrics for radar comparison
  const propertyMetrics = compareList.map(item => {
    const safety = calculateSafetyScore(item);
    const rent = Number(item.rent || 0);
    const amenitiesCount = Array.isArray(item.amenities) ? item.amenities.length : 4;
    const rating = Number(item.rating || 4.5);

    // Normalize metrics between 20 and 100
    const valueScore = Math.min(100, Math.max(30, Math.round((1 - (rent / 15000)) * 50 + (amenitiesCount * 8))));
    const amenityScore = Math.min(100, Math.max(30, amenitiesCount * 14));
    const safetyVal = safety.score;
    const locationScore = item.distanceToHub?.includes('300m') || item.distanceToHub?.includes('350m') ? 95 : 80;
    const reviewScore = Math.min(100, Math.round(rating * 20));

    return {
      id: item.id,
      title: item.title,
      rent,
      safety,
      amenitiesCount,
      rating,
      valueScore,
      amenityScore,
      safetyVal,
      locationScore,
      reviewScore
    };
  });

  const colors = [
    {
      stroke: '#0d9488',
      fill: 'rgba(13, 148, 136, 0.25)',
      dot: '#0f766e',
      bg: 'bg-teal-50/70 dark:bg-teal-950/25',
      border: 'border-teal-200 dark:border-teal-800/50',
      text: 'text-teal-700 dark:text-teal-300',
      badgeBg: 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300'
    },
    {
      stroke: '#6366f1',
      fill: 'rgba(99, 102, 241, 0.25)',
      dot: '#4338ca',
      bg: 'bg-indigo-50/70 dark:bg-indigo-950/25',
      border: 'border-indigo-200 dark:border-indigo-800/50',
      text: 'text-indigo-700 dark:text-indigo-300',
      badgeBg: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300'
    },
    {
      stroke: '#f59e0b',
      fill: 'rgba(245, 158, 11, 0.25)',
      dot: '#b45309',
      bg: 'bg-amber-50/70 dark:bg-amber-950/25',
      border: 'border-amber-200 dark:border-amber-800/50',
      text: 'text-amber-700 dark:text-amber-300',
      badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
    }
  ];

  // Radar Polygon Points Calculator (Center at 150, 150; radius 105)
  const getRadarPolygon = (metrics) => {
    const center = 150;
    const r = 105;
    const angles = [-Math.PI / 2, -Math.PI / 10, 3 * Math.PI / 10, 7 * Math.PI / 10, 11 * Math.PI / 10];
    const vals = [
      metrics.valueScore / 100,
      metrics.amenityScore / 100,
      metrics.safetyVal / 100,
      metrics.locationScore / 100,
      metrics.reviewScore / 100
    ];

    const points = angles.map((angle, i) => {
      const radius = r * vals[i];
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      return `${x},${y}`;
    });

    return points.join(' ');
  };

  const handleOpenDetails = (property) => {
    setSelectedProperty(property);
    setPropertyModalOpen(true);
  };

  const handleBookVisit = (property) => {
    setBookingModalListing(property);
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-start sm:items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={() => setIsCompareModalOpen(false)}
      id="comparison-modal-backdrop"
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col my-auto max-h-[92vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-850/90 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300 rounded-xl flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-heading">
                {t('comparisonTitle')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comparing {compareList.length} properties in Bhubaneswar with Area Ecosystem Radar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors px-2 py-1"
            >
              {t('clearCompare')}
            </button>
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="p-2 rounded-full bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div ref={modalScrollRef} className="overflow-y-auto p-4 sm:p-6 space-y-8 flex-1 custom-scroll">
          
          {/* Top Row: Property Cards Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {compareList.map((item, idx) => {
              const col = colors[idx % colors.length];

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl p-4 border relative transition-all ${col.bg} ${col.border}`}
                >
                  <button
                    onClick={() => toggleCompare(item)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 hover:bg-red-50 dark:hover:bg-red-950/60 hover:text-red-600 dark:hover:text-red-400 text-slate-400 dark:text-slate-400 shadow-sm border border-slate-200 dark:border-slate-700 transition-all z-10"
                    title="Remove from compare"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div className="aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-slate-900">
                    <img
                      src={(item.images && item.images[0]) || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${col.badgeBg}`}>
                        Option #{idx + 1}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        {item.locality}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white text-xs line-clamp-1" title={item.title}>
                      {item.title}
                    </h3>

                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-base font-extrabold text-teal-700 dark:text-teal-400">
                        ₹{Number(item.rent).toLocaleString()}<span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">/mo</span>
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {item.rating || '4.8'}
                      </div>
                    </div>

                    {/* Quick Action buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => handleOpenDetails(item)}
                        className="w-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2 rounded-xl text-[11px] border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleBookVisit(item)}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-xl text-[11px] transition-colors shadow-xs"
                      >
                        Visit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Middle Row: Radar Chart Comparison & Budget Bar Plotter */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-slate-50/80 dark:bg-slate-850/50 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
            
            {/* SVG Radar Chart (7 cols) */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm font-heading">
                  Hyperlocal Multi-Axis Radar Plotter
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4 text-center">
                Comparing Value, Safety Score, Locality Proximity, Rating & Amenities
              </p>

              {/* Radar Graphic */}
              <div className="relative w-[280px] sm:w-[300px] h-[280px] sm:h-[300px]">
                <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible">
                  {/* Concentric Polygons */}
                  {[0.2, 0.4, 0.6, 0.8, 1.0].map((level, i) => {
                    const center = 150;
                    const r = 105 * level;
                    const angles = [-Math.PI / 2, -Math.PI / 10, 3 * Math.PI / 10, 7 * Math.PI / 10, 11 * Math.PI / 10];
                    const pts = angles.map(a => `${center + r * Math.cos(a)},${center + r * Math.sin(a)}`).join(' ');
                    return (
                      <polygon
                        key={i}
                        points={pts}
                        fill="none"
                        stroke="#94a3b8"
                        strokeOpacity="0.4"
                        strokeWidth="1"
                        strokeDasharray={level === 1.0 ? 'none' : '3 3'}
                      />
                    );
                  })}

                  {/* Axis Lines */}
                  {[-Math.PI / 2, -Math.PI / 10, 3 * Math.PI / 10, 7 * Math.PI / 10, 11 * Math.PI / 10].map((angle, i) => {
                    const center = 150;
                    const r = 105;
                    return (
                      <line
                        key={i}
                        x1={center}
                        y1={center}
                        x2={center + r * Math.cos(angle)}
                        y2={center + r * Math.sin(angle)}
                        stroke="#94a3b8"
                        strokeOpacity="0.4"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* Render Polygons for each compared property */}
                  {propertyMetrics.map((pm, idx) => (
                    <polygon
                      key={pm.id}
                      points={getRadarPolygon(pm)}
                      fill={colors[idx % colors.length].fill}
                      stroke={colors[idx % colors.length].stroke}
                      strokeWidth="2.5"
                      className="transition-all duration-500"
                    />
                  ))}

                  {/* Labels on vertices */}
                  <text x="150" y="30" textAnchor="middle" fill="currentColor" className="text-slate-700 dark:text-slate-300" fontSize="10" fontWeight="bold">
                    {t('radarValue')}
                  </text>
                  <text x="262" y="115" textAnchor="start" fill="currentColor" className="text-slate-700 dark:text-slate-300" fontSize="10" fontWeight="bold">
                    {t('radarAmenities')}
                  </text>
                  <text x="225" y="272" textAnchor="middle" fill="currentColor" className="text-slate-700 dark:text-slate-300" fontSize="10" fontWeight="bold">
                    {t('radarSafety')}
                  </text>
                  <text x="75" y="272" textAnchor="middle" fill="currentColor" className="text-slate-700 dark:text-slate-300" fontSize="10" fontWeight="bold">
                    {t('radarLocation')}
                  </text>
                  <text x="38" y="115" textAnchor="end" fill="currentColor" className="text-slate-700 dark:text-slate-300" fontSize="10" fontWeight="bold">
                    {t('radarReviews')}
                  </text>
                </svg>
              </div>

              {/* Radar Legend */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-3">
                {propertyMetrics.map((pm, idx) => (
                  <div key={pm.id} className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors[idx % colors.length].stroke }}
                    />
                    <span className="max-w-[140px] truncate">{pm.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rent & Safety Bar Chart (5 cols) */}
            <div className="lg:col-span-5 space-y-4 bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  Rent & Safety Index Comparison
                </h4>
              </div>

              <div className="space-y-4">
                {propertyMetrics.map((pm, idx) => {
                  const percentRent = Math.round((pm.rent / maxRent) * 100);
                  const col = colors[idx % colors.length];

                  return (
                    <div key={pm.id} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                        <span className="truncate max-w-[180px]">{pm.title}</span>
                        <span className="text-teal-700 dark:text-teal-400">₹{pm.rent.toLocaleString()}/mo</span>
                      </div>

                      {/* Rent Bar */}
                      <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${percentRent}%`,
                            backgroundColor: col.stroke
                          }}
                        />
                      </div>

                      <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          Safety: <strong className="text-slate-800 dark:text-slate-200">{pm.safetyVal}/100</strong>
                        </span>
                        <span>{pm.amenitiesCount} Amenities included</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Section: Nearby Ecosystem & Services Present in Area */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm font-heading">
                  {t('nearbyServicesComparison')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Walkability to home-cooked meals, college gates, laundries and daily essentials
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {compareList.map((item) => {
                const services = item.nearbyServicesRadar || [
                  { name: "Local Mess & Tiffin", category: "Meal", distance: "200m" },
                  { name: "Bus / Auto Stand", category: "Transport", distance: "400m" }
                ];

                return (
                  <div key={item.id} className="bg-slate-50 dark:bg-slate-850/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{item.title}</h4>
                      <span className="text-[10px] font-bold bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-400 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                        {item.locality}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {services.map((srv, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-center justify-between bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700 text-xs shadow-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">{srv.name}</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">{srv.category}</span>
                          </div>
                          <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200/50 dark:border-emerald-800/40">
                            {srv.distance}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Full Attributes Comparison Matrix */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm font-heading">
              Detailed Property Attribute Matrix
            </h3>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm bg-white dark:bg-slate-900">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    <th className="p-3 font-extrabold w-48">Feature / Metric</th>
                    {compareList.map((item, idx) => (
                      <th key={item.id} className="p-3 font-extrabold text-slate-900 dark:text-white">
                        Option #{idx + 1}: {item.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="p-3 font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-850/60">Property Type</td>
                    {compareList.map(item => (
                      <td key={item.id} className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                        {item.propertyType}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-850/60">Suitable For</td>
                    {compareList.map(item => (
                      <td key={item.id} className="p-3 text-slate-700 dark:text-slate-300">
                        {item.genderPreference || item.tenantType || 'Bachelors & Students'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-850/60">Monthly Rent</td>
                    {compareList.map(item => (
                      <td key={item.id} className="p-3 font-extrabold text-teal-700 dark:text-teal-400">
                        ₹{Number(item.rent).toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-850/60">Security Deposit</td>
                    {compareList.map(item => (
                      <td key={item.id} className="p-3 font-semibold text-slate-700 dark:text-slate-300">
                        ₹{Number(item.deposit || item.rent).toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-850/60">Curfew / Gates</td>
                    {compareList.map(item => (
                      <td key={item.id} className="p-3 font-medium text-slate-700 dark:text-slate-300">
                        {item.houseRules?.curfew || 'No Curfew'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-850/60">Verification Status</td>
                    {compareList.map(item => (
                      <td key={item.id} className="p-3">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md text-[11px] border border-emerald-200/50 dark:border-emerald-800/40">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {item.verificationStatus || 'Verified Owner'}
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
