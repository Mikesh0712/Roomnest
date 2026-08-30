import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Clock, Video, User, Phone, CheckCircle2, Sparkles } from 'lucide-react';

export const VisitBookingModal = () => {
  const { bookingModalListing, setBookingModalListing, scheduleVisit, currentUser } = useApp();

  const [visitDate, setVisitDate] = useState('2026-08-10');
  const [visitTime, setVisitTime] = useState('04:00 PM');
  const [visitType, setVisitType] = useState('Physical In-Person Visit');
  const [userName, setUserName] = useState(currentUser?.name || '');
  const [userPhone, setUserPhone] = useState(currentUser?.phone || '');
  const [userRole, setUserRole] = useState('Student');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!bookingModalListing) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    scheduleVisit({
      propertyId: bookingModalListing.id,
      propertyTitle: bookingModalListing.title,
      userName,
      userPhone,
      userRole,
      visitDate,
      visitTime,
      visitType
    });
    setIsSuccess(true);
  };

  return (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in"
      onClick={() => {
        setBookingModalListing(null);
        setIsSuccess(false);
      }}
    >
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 p-6 relative transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close button */}
        <button
          onClick={() => {
            setBookingModalListing(null);
            setIsSuccess(false);
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">Schedule Room Visit</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1">{bookingModalListing.title}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Visit Type Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Visit Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVisitType('Physical In-Person Visit')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      visitType === 'Physical In-Person Visit'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Physical Visit
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisitType('Live Video Walkthrough')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      visitType === 'Live Video Walkthrough'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    Live Video Tour
                  </button>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Time Slot
                  </label>
                  <select
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500"
                  >
                    <option value="10:00 AM">10:00 AM (Morning)</option>
                    <option value="01:00 PM">01:00 PM (Afternoon)</option>
                    <option value="04:00 PM">04:00 PM (Evening)</option>
                    <option value="06:30 PM">06:30 PM (Late Evening)</option>
                  </select>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Siddharth Das"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500 placeholder:text-slate-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Mobile Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500 placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 transition-all mt-4"
              >
                Confirm Visit Slot
              </button>

            </form>
          </div>
        ) : (
          /* Confirmation Pass Screen */
          <div className="text-center py-6 space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">Visit Confirmed!</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
              Your visit slot pass has been generated. The landlord <strong className="text-slate-900 dark:text-white">{bookingModalListing?.ownerInfo?.name || 'Owner'}</strong> has been notified via SMS & WhatsApp.
            </p>

            <div className="bg-slate-50 dark:bg-slate-850/70 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 space-y-2 max-w-sm mx-auto">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1">
                <span>Date & Time:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{visitDate} @ {visitTime}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1">
                <span>Visit Type:</span>
                <span className="font-bold text-slate-900 dark:text-white">{visitType}</span>
              </div>
              <div className="flex justify-between">
                <span>Address:</span>
                <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{bookingModalListing?.address}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setBookingModalListing(null);
                setIsSuccess(false);
              }}
              className="bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
