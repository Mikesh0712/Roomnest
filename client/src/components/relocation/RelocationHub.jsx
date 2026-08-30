import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Truck, 
  Utensils, 
  Shirt, 
  Wifi, 
  Wrench, 
  CheckCircle2, 
  Phone, 
  Calculator, 
  Sparkles, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const RelocationHub = () => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState('tiffin'); // 'tiffin' | 'movers' | 'laundry' | 'utilities'
  
  // Packers & Movers Calculator State
  const [bhkSize, setBhkSize] = useState('single');
  const [distanceKm, setDistanceKm] = useState(5);

  const calculateMovingCost = () => {
    let base = 1500;
    if (bhkSize === '1bhk') base = 2800;
    if (bhkSize === '2bhk') base = 4500;
    if (bhkSize === '3bhk') base = 6500;
    return base + (distanceKm * 40);
  };

  const handleBookService = (serviceName) => {
    showToast(`🎉 Enquiry submitted for ${serviceName}! A partner will call you in 10 mins.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-800 to-slate-900 dark:from-emerald-950 dark:via-slate-900 dark:to-blue-950 text-white p-8 rounded-3xl relative overflow-hidden shadow-xl border border-teal-400/30 dark:border-emerald-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/20 dark:bg-emerald-500/25 border border-white/30 dark:border-emerald-400/30 px-3.5 py-1 rounded-full text-white dark:text-emerald-200 text-xs font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">
            <Truck className="w-3.5 h-3.5 text-white dark:text-emerald-300" />
            Hyperlocal Relocation Ecosystem
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight text-white drop-shadow-sm">
            Relocate with Ease in <span className="text-teal-200 dark:text-emerald-400 font-extrabold">Bhubaneswar</span>
          </h1>
          <p className="text-teal-50/95 dark:text-slate-300 text-sm font-normal leading-relaxed">
            Everything you need for seamless relocation: Verified home meal tiffins, local packers & movers, student doorstep laundry, and high-speed fiber internet setup.
          </p>
        </div>
      </div>

      {/* Relocation Category Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('tiffin')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'tiffin'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Utensils className="w-4 h-4" />
          Meal & Tiffin Services
        </button>

        <button
          onClick={() => setActiveTab('movers')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'movers'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Truck className="w-4 h-4" />
          Packers & Movers Estimator
        </button>

        <button
          onClick={() => setActiveTab('homeservices')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'homeservices'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
          id="tab-homeservices"
        >
          <Wrench className="w-4 h-4" />
          Home Services
        </button>
      </div>

      {/* CATEGORY 1: MEAL & TIFFIN SERVICES */}
      {activeTab === 'tiffin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Patia & KIIT Zone
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading mt-2">Maa Tarini Home Tiffin Express</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Authentic Odia & North Indian home-cooked daily meals</p>
              </div>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-heading">₹2,400 / mo</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <p className="font-bold text-slate-900 dark:text-white">🍱 Sample Menu Highlight:</p>
              <p>Rice/Roti, Dalma, Mixed Veg, Fish Curry or Chicken Curry (Wed/Sun special), Salad & Papad</p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">⚡ Free 30-min Doorstep Delivery</span>
              <button
                onClick={() => handleBookService('Maa Tarini Tiffin')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                Order Free Trial Meal
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Jagamara & ITER Zone
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading mt-2">Homely Bytes Student Mess</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Hygienic student meal subscription with low spices</p>
              </div>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-heading">₹2,100 / mo</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <p className="font-bold text-slate-900 dark:text-white">🍱 Sample Menu Highlight:</p>
              <p>Special student thali, Paneer butter masala, Chapati, Dal fry, Kheer on Fridays</p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">⚡ Breakfast & Dinner Included</span>
              <button
                onClick={() => handleBookService('Homely Bytes Mess')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                Order Free Trial Meal
              </button>
            </div>
          </div>

        </div>
      )}

      {/* CATEGORY 2: PACKERS & MOVERS ESTIMATOR */}
      {activeTab === 'movers' && (
        <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6 animate-fade-in shadow-xl border border-slate-800">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-white">Bhubaneswar Local Shifting Cost Estimator</h3>
              <p className="text-xs text-slate-300">Calculate instant price quotes for moving luggage & furniture across Bhubaneswar</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  1. Select Inventory Volume
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  {[
                    { id: 'single', label: 'Single Room / PG' },
                    { id: '1bhk', label: '1BHK Apartment' },
                    { id: '2bhk', label: '2BHK Apartment' },
                    { id: '3bhk', label: '3BHK Villa / Flat' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setBhkSize(item.id)}
                      className={`p-3 rounded-xl border transition-all text-left ${
                        bhkSize === item.id 
                          ? 'bg-blue-600 border-blue-500 text-white shadow-md' 
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2 text-slate-200">
                  <span>2. Shifting Distance ({distanceKm} km within BBSR):</span>
                  <span className="text-blue-400">{distanceKm} km</span>
                </div>
                <input 
                  type="range"
                  min="2"
                  max="35"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col justify-between text-center">
              <div>
                <span className="text-xs text-slate-300 uppercase font-bold tracking-wider">Estimated Local Moving Rate</span>
                <div className="text-4xl font-black text-blue-400 font-heading my-4">
                  ₹{calculateMovingCost().toLocaleString('en-IN')}
                </div>
                <ul className="text-[11px] text-slate-300 text-left space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Dedicated Chhota Hathi / Tata Ace Truck</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 2 Professional Helpers Included</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Mattress & Electronics Bubble Wrapping</li>
                </ul>
              </div>

              <button
                onClick={() => handleBookService('Kalinga Swift Packers & Movers')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all mt-4 shadow-md"
              >
                Book Packer & Mover Truck
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 3: HOME SERVICES (Laundry, WiFi, Repair) */}
      {activeTab === 'homeservices' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center">
              <Shirt className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">CleanNest Student Laundry</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Doorstep wash, dry & iron package with 24-hour turnaround.</p>
            <span className="block text-xl font-extrabold text-slate-900 dark:text-white font-heading">₹599 / month (30kg)</span>
            <button 
              onClick={() => handleBookService('CleanNest Laundry')}
              className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-sm"
            >
              Subscribe Plan
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 flex items-center justify-center">
              <Wifi className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">JioFiber / Airtel FastConnect</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Instant high speed fiber router installation within 4 hours.</p>
            <span className="block text-xl font-extrabold text-slate-900 dark:text-white font-heading">From ₹499 / month</span>
            <button 
              onClick={() => handleBookService('High Speed Fiber Internet')}
              className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-sm"
            >
              Request Fiber Slot
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">Verified Electrician & Plumber</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">On-demand doorstep repair for sub-meters, geysers & taps.</p>
            <span className="block text-xl font-extrabold text-slate-900 dark:text-white font-heading">₹199 Visit Fee</span>
            <button 
              onClick={() => handleBookService('Electrician & Plumber')}
              className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-sm"
            >
              Book Technician
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
