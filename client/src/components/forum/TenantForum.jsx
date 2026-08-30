import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Users,
  Search,
  PlusCircle,
  MapPin,
  IndianRupee,
  Phone,
  MessageSquare,
  ShieldCheck,
  Filter,
  Sparkles,
  Heart,
  CheckCircle2,
  X,
  Send,
  Home,
  UserCheck
} from 'lucide-react';

export const TenantForum = () => {
  const { forumPosts, addForumPost, showToast } = useApp();
  const { t } = useLanguage();

  const [localityFilter, setLocalityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All'); // 'All' | 'looking' | 'offering'
  const [genderFilter, setGenderFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Post Form State
  const [formData, setFormData] = useState({
    userName: '',
    role: '',
    locality: 'Patia',
    type: 'looking',
    budget: 4500,
    sharingType: 'Double Sharing',
    genderPref: 'Boys Only',
    description: '',
    amenitiesInput: 'WiFi, RO Water, Mess',
    contactPhone: '',
    contactWhatsapp: ''
  });

  const localities = ['All', 'Patia', 'Jagamara', 'Khandagiri', 'Dumduma', 'Chandrasekharpur', 'Saheed Nagar'];

  const filteredPosts = forumPosts.filter(post => {
    if (localityFilter !== 'All' && !post.locality.toLowerCase().includes(localityFilter.toLowerCase())) {
      return false;
    }
    if (typeFilter !== 'All' && post.type !== typeFilter) {
      return false;
    }
    if (genderFilter !== 'All' && !post.genderPref.toLowerCase().includes(genderFilter.toLowerCase())) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const searchable = `${post.userName} ${post.role} ${post.locality} ${post.description} ${post.sharingType}`.toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    return true;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.userName || !formData.description || !formData.contactPhone) {
      showToast('⚠️ Please fill in your name, contact phone and description.');
      return;
    }

    const amenitiesList = formData.amenitiesInput
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);

    addForumPost({
      userName: formData.userName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.userName)}`,
      role: formData.role || 'Student / Working Professional',
      locality: formData.locality,
      type: formData.type,
      budget: Number(formData.budget),
      sharingType: formData.sharingType,
      genderPref: formData.genderPref,
      description: formData.description,
      amenitiesWanted: amenitiesList.length > 0 ? amenitiesList : ['WiFi', 'Clean Washroom'],
      contactPhone: formData.contactPhone,
      contactWhatsapp: formData.contactWhatsapp || formData.contactPhone.replace(/[^0-9]/g, '')
    });

    setIsModalOpen(false);
    setFormData({
      userName: '',
      role: '',
      locality: 'Patia',
      type: 'looking',
      budget: 4500,
      sharingType: 'Double Sharing',
      genderPref: 'Boys Only',
      description: '',
      amenitiesInput: 'WiFi, RO Water, Mess',
      contactPhone: '',
      contactWhatsapp: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Forum Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 dark:from-blue-950 dark:via-indigo-950 dark:to-slate-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-xl border border-blue-400/30 dark:border-indigo-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/20 dark:bg-indigo-500/25 border border-white/30 dark:border-indigo-400/30 px-3.5 py-1 rounded-full text-white dark:text-indigo-200 text-xs font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">
              <Users className="w-3.5 h-3.5 text-white dark:text-indigo-300" />
              Community Co-Living Network
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight text-white drop-shadow-sm">
              {t('forumTitle')}
            </h1>
            <p className="text-blue-50/95 dark:text-slate-300 text-sm font-normal">
              {t('forumSub')}
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-teal-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm shrink-0"
            id="post-forum-btn"
          >
            <PlusCircle className="w-5 h-5" />
            {t('postRequest')}
          </button>
        </div>
      </div>

      {/* Filter and Search Strip */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Locality Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200">
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <select
              value={localityFilter}
              onChange={(e) => setLocalityFilter(e.target.value)}
              className="bg-transparent border-none focus:outline-none cursor-pointer text-slate-800 dark:text-slate-200 font-semibold"
            >
              {localities.map(loc => (
                <option key={loc} value={loc} className="dark:bg-slate-800">{loc === 'All' ? t('allLocalities') : loc}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setTypeFilter('All')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${typeFilter === 'All' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('looking')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${typeFilter === 'looking' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              {t('lookingForRoom')}
            </button>
            <button
              onClick={() => setTypeFilter('offering')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${typeFilter === 'offering' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              {t('offeringShare')}
            </button>
          </div>

          {/* Gender Filter */}
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="All" className="dark:bg-slate-800">Gender: All</option>
            <option value="Boys" className="dark:bg-slate-800">Boys Only</option>
            <option value="Girls" className="dark:bg-slate-800">Girls Only</option>
            <option value="Unisex" className="dark:bg-slate-800">Unisex / Any</option>
          </select>
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search keywords, colleges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-10 pr-4 py-2 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-850"
          />
        </div>
      </div>

      {/* Forum Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
            >
              {/* Top Row: User + Type Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={post.avatar}
                    alt={post.userName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100 dark:border-indigo-900 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">{post.userName}</h3>
                      {post.verified && (
                        <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" title="Phone & Identity Verified" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{post.role}</p>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-normal">{post.postedAt}</span>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    post.type === 'looking'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  }`}
                >
                  {post.type === 'looking' ? 'Looking' : 'Offering'}
                </span>
              </div>

              {/* Meta details strip */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60 text-xs">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Location:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                    {post.locality}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Budget Share:</span>
                  <span className="font-bold text-teal-700 dark:text-teal-400">
                    ₹{post.budget.toLocaleString()}<span className="text-slate-400 dark:text-slate-500 font-normal text-[10px]">/mo</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Room Type:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{post.sharingType}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Preference:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{post.genderPref}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                "{post.description}"
              </p>

              {/* Amenities tags */}
              {post.amenitiesWanted && post.amenitiesWanted.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {post.amenitiesWanted.map((am, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/40 text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {am}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <a
                  href={`https://wa.me/${post.contactWhatsapp}?text=${encodeURIComponent(`Hi ${post.userName}, I saw your post on RoomNest regarding roommate sharing in ${post.locality}. Are you available to discuss?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs transition-colors shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
                <a
                  href={`tel:${post.contactPhone}`}
                  className="flex items-center justify-center gap-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold px-3 py-2 rounded-xl text-xs transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              🔍
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('noPostsFound')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Be the first to post a roommate sharing requirement in this area!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-5 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-sm"
            >
              {t('postRequest')}
            </button>
          </div>
        )}
      </div>

      {/* Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 mb-6">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{t('postModalTitle')}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your post will be immediately visible to students and bachelors in Bhubaneswar.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Selection */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'looking' })}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    formData.type === 'looking'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  {t('lookingForRoom')}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'offering' })}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    formData.type === 'offering'
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  {t('offeringShare')}
                </button>
              </div>

              {/* Name and Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Mishra"
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-850"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Occupation / College</label>
                  <input
                    type="text"
                    placeholder="e.g. KIIT 3rd Year / TCS Dev"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-850"
                  />
                </div>
              </div>

              {/* Locality & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Locality in Bhubaneswar</label>
                  <select
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-850"
                  >
                    {localities.filter(l => l !== 'All').map(loc => (
                      <option key={loc} value={loc} className="dark:bg-slate-800">{loc}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Monthly Budget (₹)</label>
                  <input
                    type="number"
                    required
                    step={250}
                    min={2000}
                    max={25000}
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-850"
                  />
                </div>
              </div>

              {/* Sharing type & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Room / Sharing Type</label>
                  <select
                    value={formData.sharingType}
                    onChange={(e) => setFormData({ ...formData, sharingType: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-850"
                  >
                    <option value="Single Room" className="dark:bg-slate-800">Single Room</option>
                    <option value="Double Sharing" className="dark:bg-slate-800">Double Sharing (2 Sharing)</option>
                    <option value="Triple Sharing" className="dark:bg-slate-800">Triple Sharing (3 Sharing)</option>
                    <option value="Flatmate for 2BHK/3BHK" className="dark:bg-slate-800">Flatmate for 2BHK/3BHK</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Gender Preference</label>
                  <select
                    value={formData.genderPref}
                    onChange={(e) => setFormData({ ...formData, genderPref: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-850"
                  >
                    <option value="Boys Only" className="dark:bg-slate-800">Boys Only</option>
                    <option value="Girls Only" className="dark:bg-slate-800">Girls Only</option>
                    <option value="Unisex / Any" className="dark:bg-slate-800">Unisex / Any</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Details & Preferences *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your habits, preferred move-in date, cleanliness standards, food preferences..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-850 resize-none"
                />
              </div>

              {/* Amenities Wanted */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Key Amenities Wanted (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. WiFi, Air Conditioner, Food Included, Geyser"
                  value={formData.amenitiesInput}
                  onChange={(e) => setFormData({ ...formData, amenitiesInput: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-850"
                />
              </div>

              {/* Phone & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98530 00000"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-850"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">WhatsApp (10 digits)</label>
                  <input
                    type="tel"
                    placeholder="919853000000"
                    value={formData.contactWhatsapp}
                    onChange={(e) => setFormData({ ...formData, contactWhatsapp: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-850"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-teal-600/25 transition-all text-xs flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {t('submitPost')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
