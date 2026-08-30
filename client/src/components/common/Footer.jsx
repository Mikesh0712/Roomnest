import React from 'react';
import { Heart } from 'lucide-react';

export const Footer = () => (
  <footer className="rn-footer">
    <div className="rn-footer-inner">
      <div className="rn-footer-grid">

        {/* Brand */}
        <div>
          <div className="rn-footer-logo-text">Room<span>Nest</span></div>
          <p className="rn-footer-tagline">
            Hyperlocal rental & relocation platform for students, professionals & families in Bhubaneswar.
          </p>
          <div style={{
            marginTop: 20, padding: '14px 16px',
            background: 'rgba(0,168,150,0.1)',
            border: '1px solid rgba(0,168,150,0.2)',
            borderRadius: 10
          }}>
            <span style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Tagline</span>
            <p style={{ fontSize: 14, color: 'white', fontWeight: 700, fontStyle: 'italic', marginTop: 4 }}>
              "Find More Than a Room. Find Your Next Home."
            </p>
          </div>
        </div>

        {/* Explore */}
        <div className="rn-footer-col">
          <h4>Explore</h4>
          <ul>
            <li>PG Rooms</li>
            <li>Flats & Apartments</li>
            <li>Studio Rooms</li>
            <li>Shared Rooms</li>
            <li>1BHK / 2BHK</li>
          </ul>
        </div>

        {/* Services */}
        <div className="rn-footer-col">
          <h4>Services</h4>
          <ul>
            <li>Meal & Tiffin</li>
            <li>Packers & Movers</li>
            <li>Doorstep Laundry</li>
            <li>WiFi Setup</li>
            <li>Cost Calculator</li>
          </ul>
        </div>

        {/* Expansion */}
        <div className="rn-footer-col">
          <h4>Expansion</h4>
          <ul>
            <li style={{ color: '#4dffd8', fontWeight: 600 }}>● Phase 1: Bhubaneswar ✓</li>
            <li>○ Phase 2: Cuttack, Rourkela</li>
            <li>○ Phase 3: Bangalore, Pune</li>
            <li>○ Phase 4: Pan-India</li>
          </ul>
        </div>

      </div>

      <hr className="rn-footer-divider" />

      <div className="rn-footer-bottom">
        <span>© 2026 RoomNest Technologies. All rights reserved.</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          Made with <Heart size={12} color="#e53e3e" fill="#e53e3e" /> for Bhubaneswar
        </span>
      </div>
    </div>
  </footer>
);
