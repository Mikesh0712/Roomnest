import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';

const GOOGLE_MAPS_KEY = "AIzaSyCa4V70pvnLnAf9Fj4cXB-dTkB_LWt31ZI";

export const InteractiveMap = () => {
  const { listings, activeListing, setActiveListing, setSelectedProperty, setPropertyModalOpen, hoveredListingId } = useApp();
  const [mapEngine, setMapEngine] = useState('google'); // 'google' | 'leaflet'
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  // Leaflet Map Initialization & Markers
  useEffect(() => {
    if (mapEngine !== 'leaflet' || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [20.30, 85.81],
        zoom: 12,
        scrollWheelZoom: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add markers for Bhubaneswar properties
    listings.forEach(listing => {
      if (listing.lat && listing.lng) {
        const isHovered = hoveredListingId === listing.id;

        // Custom HTML Price Pin Icon
        const priceLabel = `₹${((listing.rent || 0) / 1000).toFixed(1)}k`;
        const pinHtml = `
          <div class="flex flex-col items-center cursor-pointer group">
            <div class="px-2.5 py-1 rounded-full text-xs font-black shadow-lg border transition-all ${
              isHovered 
                ? 'bg-blue-600 text-white border-white scale-110 z-50' 
                : 'bg-slate-900 text-white border-slate-700 hover:bg-blue-600'
            }">
              ${priceLabel}
            </div>
            <div class="w-2 h-2 bg-blue-600 rotate-45 -mt-1 shadow-md"></div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: pinHtml,
          className: 'custom-map-pin',
          iconSize: [50, 30],
          iconAnchor: [25, 30]
        });

        const marker = L.marker([listing.lat, listing.lng], { icon: customIcon }).addTo(map);
        const imgUrl = (listing.images && listing.images[0]) || listing.thumbnail || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300';
        
        const popupContent = document.createElement('div');
        popupContent.className = "p-2 max-w-[200px]";
        popupContent.innerHTML = `
          <img src="${imgUrl}" class="w-full h-24 object-cover rounded-lg mb-2" />
          <div class="text-[11px] font-bold text-blue-600 uppercase">${listing.propertyType || 'PG'}</div>
          <h4 class="font-bold text-xs text-slate-900 line-clamp-1 mb-1">${listing.title}</h4>
          <div class="text-xs font-black text-slate-900 mb-2">₹${Number(listing.rent || 0).toLocaleString('en-IN')}/mo</div>
          <button id="map-btn-${listing.id}" class="w-full bg-blue-600 text-white text-xs font-bold py-1.5 rounded-lg hover:bg-blue-700">
            View Details
          </button>
        `;

        marker.bindPopup(popupContent);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`map-btn-${listing.id}`);
          if (btn) {
            btn.onclick = () => {
              setSelectedProperty(listing);
              setActiveListing(listing);
              setPropertyModalOpen(true);
            };
          }
        });

        markersRef.current[listing.id] = marker;
      }
    });

  }, [listings, hoveredListingId, mapEngine]);

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-3xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100 flex flex-col">
      
      {/* Map Switcher Control Bar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 shadow-md z-20">
        <div className="flex items-center gap-1.5">
          <span className="text-blue-600 font-bold">📍 Bhubaneswar Map</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setMapEngine('google')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              mapEngine === 'google' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🗺️ Google Maps
          </button>
          <button
            onClick={() => setMapEngine('leaflet')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              mapEngine === 'leaflet' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🌿 Leaflet OSM
          </button>
        </div>
      </div>

      {/* Map Content View */}
      {mapEngine === 'google' ? (
        <iframe
          title="Google Maps Hyperlocal Bhubaneswar"
          width="100%"
          height="100%"
          style={{ border: 0, minHeight: '500px', flex: 1 }}
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_KEY}&q=Jagamara+Khandagiri+Bhubaneswar+Odisha&zoom=13`}
        />
      ) : (
        <div ref={mapContainerRef} className="w-full h-full min-h-[500px] flex-1" />
      )}
    </div>
  );
};
