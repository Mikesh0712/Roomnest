import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const initialBhubaneswarListings = [
  {
    id: "rn-bbsr-005",
    title: "Somli Hostel — Home-style Food & Balconies",
    tagline: "Home-style food, attached toilets, private balconies, AC & Non-AC",
    description: "Comfortable PG offering hygienic home-style Odia & North Indian meals thrice daily, attached toilets, private balconies, and options for AC & Non-AC rooms on Khandagiri Marg.",
    address: "Khandagiri Marg, Jagamara, Bhubaneswar",
    locality: "Jagamara",
    city: "Bhubaneswar",
    hubType: "college",
    hubName: "ITER College",
    distanceToHub: "300m from ITER Gate 1",
    lat: 20.2520,
    lng: 85.7975,
    rent: 7500,
    deposit: 7500,
    maintenance: 300,
    electricityRate: "Sub-meter tariff / Included",
    waterCharge: "Included",
    lockInPeriod: "1 Month",
    propertyType: "Hostel / PG",
    tenantType: "Students & Working Professionals",
    genderPreference: "Unisex / Boys & Girls Wings",
    verificationStatus: "Verified Owner",
    isFeatured: true,
    rating: 4.9,
    reviewCount: 29,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80"
    ],
    videoTourUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    amenities: [
      "Home-Style Food Included (3 Meals)",
      "Attached Toilets",
      "Private Balcony",
      "Air Conditioner / Non-AC Options",
      "High Speed Wi-Fi",
      "Hot Water Geyser",
      "AquaGuard RO Purifier"
    ],
    houseRules: {
      curfew: "09:30 PM Entry Deadline",
      foodPreference: "Fresh Home-Style Meals Served Daily",
      visitorsPolicy: "Visitors allowed till 8:30 PM",
      petsPolicy: "Not Allowed",
      smokingDrinking: "Strictly Prohibited",
      securityDepositRefund: "Fully refundable upon checkout"
    },
    nearbyServicesRadar: [
      { name: "ITER SOA University", category: "College", distance: "300m" },
      { name: "Maa Tarini Mess", category: "Meal", distance: "150m" }
    ],
    ownerInfo: {
      name: "Ramesh Chandra Jena",
      type: "Direct Property Owner",
      phone: "+91 98530 11223",
      whatsapp: "919853011223",
      verified: true
    },
    reviews: []
  },
  {
    id: "rn-bbsr-006",
    title: "Delta Boys Hostel — Hi-Speed Wi-Fi & Parking",
    tagline: "Hi-speed Wi-Fi, automatic washing machine & bike parking",
    description: "Modern student & working men hostel equipped with high-speed Wi-Fi, automatic washing machine, power backup, and secure bike parking near Bhujabala Petrol Pump.",
    address: "Near Bhujabala Petrol Pump, Khandagiri",
    locality: "Khandagiri",
    city: "Bhubaneswar",
    hubType: "college",
    hubName: "Khandagiri Hub",
    distanceToHub: "Near Bhujabala Petrol Pump",
    lat: 20.2550,
    lng: 85.7920,
    rent: 6000,
    deposit: 6000,
    maintenance: 200,
    electricityRate: "Sub-meter tariff",
    waterCharge: "Included",
    lockInPeriod: "1 Month",
    propertyType: "Boys Hostel",
    tenantType: "Students & Bachelors",
    genderPreference: "Boys Only",
    verificationStatus: "Verified Owner",
    isFeatured: true,
    rating: 4.8,
    reviewCount: 24,
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80"
    ],
    videoTourUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    amenities: [
      "Hi-Speed Wi-Fi",
      "Automatic Washing Machine",
      "Dedicated Bike Parking",
      "Power Backup Generator",
      "Study Table & Chair",
      "RO Water Purifier"
    ],
    houseRules: {
      curfew: "10:00 PM Curfew",
      foodPreference: "Self Cook / Tiffin Service",
      visitorsPolicy: "Visitors allowed till 9 PM",
      petsPolicy: "Not Allowed",
      smokingDrinking: "Prohibited",
      securityDepositRefund: "Refundable on 30-day notice"
    },
    nearbyServicesRadar: [
      { name: "Bhujabala Petrol Pump", category: "Landmark", distance: "50m" },
      { name: "QuickWash Laundry", category: "Laundry", distance: "200m" }
    ],
    ownerInfo: {
      name: "Ramesh Chandra Jena",
      type: "Direct Property Owner",
      phone: "+91 98530 11223",
      whatsapp: "919853011223",
      verified: true
    },
    reviews: []
  },
  {
    id: "rn-bbsr-007",
    title: "Comfort Paying Guest — Refrigerator & 24/7 CCTV",
    tagline: "Fridge, washing machine, 24/7 CCTV & fully furnished",
    description: "Fully furnished paying guest setup equipped with refrigerator, washing machine, 24/7 CCTV surveillance, and geyser in Phase 4 Dumduma.",
    address: "Phase 4, Dumduma, Bhubaneswar",
    locality: "Dumduma",
    city: "Bhubaneswar",
    hubType: "office",
    hubName: "Dumduma Hub",
    distanceToHub: "Near Dumduma Phase 4 Market",
    lat: 20.2450,
    lng: 85.7850,
    rent: 9000,
    deposit: 9000,
    maintenance: 500,
    electricityRate: "Sub-meter tariff",
    waterCharge: "Included",
    lockInPeriod: "3 Months",
    propertyType: "Paying Guest",
    tenantType: "Professionals & Bachelors",
    genderPreference: "Unisex",
    verificationStatus: "Verified Owner",
    isFeatured: true,
    rating: 4.9,
    reviewCount: 37,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80"
    ],
    videoTourUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    amenities: [
      "Refrigerator Access",
      "Automatic Washing Machine",
      "24/7 CCTV Security",
      "Fully Furnished",
      "Air Conditioner",
      "Geyser",
      "Reserved Parking"
    ],
    houseRules: {
      curfew: "No Curfew (24/7 Gate Access)",
      foodPreference: "All Allowed",
      visitorsPolicy: "Visitors allowed till 9 PM",
      petsPolicy: "Not Allowed",
      smokingDrinking: "Allowed in balcony",
      securityDepositRefund: "Refundable on departure"
    },
    nearbyServicesRadar: [
      { name: "UrbanClean House Cleaning", category: "Cleaning", distance: "300m" }
    ],
    ownerInfo: {
      name: "Ramesh Chandra Jena",
      type: "Direct Property Owner",
      phone: "+91 98530 11223",
      whatsapp: "919853011223",
      verified: true
    },
    reviews: []
  },
  {
    id: "rn-bbsr-008",
    title: "Lucky Hostel — Budget-Friendly Bedding near Amrit Nagar",
    tagline: "Basic bedding, budget-friendly rent, single & shared rooms",
    description: "Budget-friendly accommodation with basic bedding, study desks, purified drinking water, and single & shared options in Amrit Nagar, Jagamara.",
    address: "Amrit Nagar, Jagamara, Bhubaneswar",
    locality: "Jagamara",
    city: "Bhubaneswar",
    hubType: "college",
    hubName: "ITER College",
    distanceToHub: "400m from ITER College",
    lat: 20.2490,
    lng: 85.7960,
    rent: 4500,
    deposit: 4500,
    maintenance: 0,
    electricityRate: "Included in Rent",
    waterCharge: "Included",
    lockInPeriod: "1 Month",
    propertyType: "Budget Student Hostel",
    tenantType: "Students & Bachelors",
    genderPreference: "Boys Only",
    verificationStatus: "Verified Owner",
    isFeatured: false,
    rating: 4.6,
    reviewCount: 19,
    images: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80"
    ],
    videoTourUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    amenities: [
      "Basic Bedding & Mattress",
      "Budget-Friendly Pricing",
      "Single & Shared Room Options",
      "Study Table & Chair",
      "Filtered AquaGuard Water"
    ],
    houseRules: {
      curfew: "10:00 PM Curfew",
      foodPreference: "Affordable meals included",
      visitorsPolicy: "Parents allowed during visiting hours",
      petsPolicy: "Not Allowed",
      smokingDrinking: "Prohibited",
      securityDepositRefund: "Instant refund on exit"
    },
    nearbyServicesRadar: [
      { name: "ITER SOA University", category: "College", distance: "400m" }
    ],
    ownerInfo: {
      name: "Ramesh Chandra Jena",
      type: "Direct Property Owner",
      phone: "+91 98530 11223",
      whatsapp: "919853011223",
      verified: true
    },
    reviews: []
  },
  {
    id: "rn-bbsr-001",
    title: "Starlight Residency - Premium Studio near KIIT Campus 6",
    tagline: "Fully furnished studio for students & working professionals",
    description: "Modern, high-speed WiFi enabled studio apartment situated right next to KIIT Campus 6 and Patia Square. Ideal for students and young professionals seeking quiet study environments and luxury amenities.",
    address: "Plot 412, Lane 3, KIIT Road, Patia",
    locality: "Patia",
    city: "Bhubaneswar",
    hubType: "college",
    hubName: "KIIT University",
    distanceToHub: "350m from KIIT Campus 6",
    lat: 20.3532,
    lng: 85.8164,
    rent: 8500,
    deposit: 8500,
    maintenance: 500,
    electricityRate: "₹7 / unit (sub-meter)",
    waterCharge: "Included",
    lockInPeriod: "3 Months",
    propertyType: "Studio Apartment",
    tenantType: "Bachelors & Professionals",
    genderPreference: "Unisex",
    verificationStatus: "Verified Owner",
    isFeatured: true,
    rating: 4.8,
    reviewCount: 34,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80"
    ],
    videoTourUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    amenities: [
      "High Speed WiFi (200 Mbps)",
      "Air Conditioner",
      "Geyser",
      "RO Water Purifier",
      "Washing Machine Access",
      "Power Backup (DG)",
      "CCTV Security 24/7"
    ],
    houseRules: {
      curfew: "No Curfew (24/7 Smart Key Access)",
      foodPreference: "Veg & Non-Veg Allowed",
      visitorsPolicy: "Visitors allowed till 9:00 PM",
      petsPolicy: "Not Allowed",
      smokingDrinking: "Allowed in balcony only",
      securityDepositRefund: "100% refundable with 30-day notice"
    },
    nearbyServicesRadar: [
      { name: "KIIT Campus 6", category: "College", distance: "350m" },
      { name: "Infocity IT Park", category: "Office", distance: "1.2 km" }
    ],
    ownerInfo: {
      name: "Subhashish Mohanty",
      type: "Direct Property Owner",
      phone: "+91 94370 12345",
      whatsapp: "919437012345",
      verified: true
    },
    reviews: []
  }
];

const initialForumPosts = [
  {
    id: "fp-001",
    type: "looking", // 'looking' | 'offering'
    userName: "Rahul Mohapatra",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    role: "ITER Student (3rd Year CSE)",
    locality: "Jagamara",
    budget: 4500,
    sharingType: "Double Sharing",
    genderPref: "Boys Only",
    description: "Looking for a serious study partner & roommate to share a 2-sharing PG near ITER Gate 1 or Jagamara. Prefer non-smoker.",
    amenitiesWanted: ["High Speed WiFi", "Home-style Food", "Study Table"],
    postedAt: "2 hours ago",
    contactPhone: "+91 98530 11982",
    contactWhatsapp: "919853011982",
    verified: true
  },
  {
    id: "fp-002",
    type: "offering",
    userName: "Priya Dash",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    role: "Infosys Software Engineer",
    locality: "Patia (Near Infocity)",
    budget: 6500,
    sharingType: "Private Room in 2BHK",
    genderPref: "Girls Only",
    description: "1 master bedroom with attached balcony available in a spacious 2BHK flat at Patia Infocity. Cook comes daily for lunch & dinner.",
    amenitiesWanted: ["AC Included", "Daily Cook", "Washing Machine", "Gated Security"],
    postedAt: "5 hours ago",
    contactPhone: "+91 94370 23456",
    contactWhatsapp: "919437023456",
    verified: true
  },
  {
    id: "fp-003",
    type: "looking",
    userName: "Soumya Ranjan",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
    role: "KIIT Student (Campus 6)",
    locality: "Patia",
    budget: 4000,
    sharingType: "Shared PG",
    genderPref: "Boys Only",
    description: "Need 1 bachelor/student to split rent in an independent flat near KIIT Campus 6. Already have high-speed 200 Mbps JioFiber.",
    amenitiesWanted: ["200 Mbps Fiber", "RO Water", "Power Backup"],
    postedAt: "1 day ago",
    contactPhone: "+91 70081 44552",
    contactWhatsapp: "917008144552",
    verified: true
  },
  {
    id: "fp-004",
    type: "offering",
    userName: "Dr. Lipsa Nayak",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    role: "AIIMS Resident Doctor",
    locality: "Dumduma",
    budget: 5500,
    sharingType: "Single Room",
    genderPref: "Girls Only",
    description: "Well-ventilated room available with attached western washroom in Dumduma Phase 4. Peaceful locality, ideal for medical students or doctors.",
    amenitiesWanted: ["Attached Bathroom", "AquaGuard RO", "24/7 Water", "Parking"],
    postedAt: "2 days ago",
    contactPhone: "+91 98610 99881",
    contactWhatsapp: "919861099881",
    verified: true
  },
  {
    id: "fp-005",
    type: "looking",
    userName: "Bikash Jena",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    role: "TCS Developer",
    locality: "Chandrasekharpur",
    budget: 5000,
    sharingType: "3BHK Flat Sharing",
    genderPref: "Unisex / Working",
    description: "Looking for 2 working professionals to rent a modern 3BHK flat in Chandrasekharpur / Sailashree Vihar. Split deposit & bills equally.",
    amenitiesWanted: ["Modular Kitchen", "Refrigerator", "Bike Parking"],
    postedAt: "3 days ago",
    contactPhone: "+91 99370 55667",
    contactWhatsapp: "919937055667",
    verified: true
  }
];

export const AppProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState('tenant');
  const [selectedCity, setSelectedCity] = useState('Bhubaneswar');
  const [listings, setListings] = useState(initialBhubaneswarListings);
  const [wishlist, setWishlist] = useState([]);
  const [theme, setTheme] = useState('light'); // 'light' | 'dark'
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  const [activeListing, setActiveListing] = useState(null);
  const [bookingModalListing, setBookingModalListing] = useState(null);
  const [hoveredListingId, setHoveredListingId] = useState(null);
  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'relocation' | 'community' | 'dashboard'
  
  // Comparison State
  const [compareList, setCompareList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Forum State
  const [forumPosts, setForumPosts] = useState(initialForumPosts);
  const [forumFilter, setForumFilter] = useState({
    locality: 'All',
    type: 'All',
    genderPref: 'All',
    maxBudget: 15000
  });
  
  const [visitBookings, setVisitBookings] = useState([
    {
      id: "visit-101",
      propertyId: "rn-bbsr-001",
      propertyTitle: "Starlight Residency - Premium Studio near KIIT Campus 6",
      userName: "Ankita Tripathy",
      userPhone: "+91 98530 11223",
      visitDate: "2026-08-10",
      visitTime: "04:00 PM",
      visitType: "Physical In-Person Visit",
      status: "Confirmed"
    }
  ]);

  const [filters, setFilters] = useState({
    search: '',
    hubType: 'all',
    locality: 'all',
    maxRent: 30000,
    genderPreference: 'All',
    propertyType: 'All',
    verifiedOnly: false
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // null = not signed in

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Toggle wishlist (stores full listing objects)
  const toggleWishlist = (listing) => {
    const exists = wishlist.some(w => w.id === listing.id);
    if (exists) {
      setWishlist(wishlist.filter(w => w.id !== listing.id));
      showToast('Removed from your Wishlist');
    } else {
      setWishlist([...wishlist, listing]);
      showToast('Saved to your Wishlist ❤️');
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Schedule visit handler
  const scheduleVisit = (visitData) => {
    const newVisit = {
      id: `visit-${Date.now().toString().slice(-4)}`,
      status: 'Confirmed',
      ...visitData
    };
    setVisitBookings([newVisit, ...visitBookings]);
    showToast('🎉 Visit Scheduled Successfully!');
  };

  // Cancel / Delete visit booking
  const deleteVisitBooking = (id) => {
    setVisitBookings(prev => prev.filter(v => v.id !== id && v._id !== id));
    showToast('🗑️ Visit booking cancelled successfully!');
  };

  // Reschedule visit booking
  const rescheduleVisitBooking = (id, newDate, newTime) => {
    setVisitBookings(prev => prev.map(v => (v.id === id || v._id === id) ? { ...v, visitDate: newDate, visitTime: newTime, status: 'Rescheduled' } : v));
    showToast('📅 Visit rescheduled successfully!');
  };

  // Add new property listing
  const addPropertyListing = (newProp) => {
    const formatted = {
      id: `rn-bbsr-${Date.now().toString().slice(-4)}`,
      rating: 5.0,
      reviewCount: 0,
      verificationStatus: "Pending Admin Verification",
      reviews: [],
      ...newProp
    };
    setListings([formatted, ...listings]);
    showToast('✅ Property submitted for verification!');
  };

  // Delete property listing
  const deletePropertyListing = (id) => {
    setListings(prev => prev.filter(item => item.id !== id && item._id !== id));
    showToast('🗑️ Property listing deleted successfully!');
  };

  // Verify listing status (Admin)
  const verifyListing = (id, newStatus = 'Verified Owner') => {
    setListings(prev => prev.map(item => (item.id === id || item._id === id) ? {
      ...item,
      verificationStatus: newStatus,
      verifiedOwner: newStatus.includes('Verified')
    } : item));
    showToast(`Property status updated to "${newStatus}"!`);
  };

  // Toggle property availability (Owner)
  const togglePropertyAvailability = (id) => {
    setListings(prev => prev.map(item => {
      if (item.id === id || item._id === id) {
        const nextStatus = !item.isAvailable;
        showToast(nextStatus ? 'Listing marked as Available' : 'Listing marked as Occupied/Unavailable');
        return { ...item, isAvailable: nextStatus };
      }
      return item;
    }));
  };

  // Toggle listing in comparison
  const toggleCompare = (listing) => {
    const exists = compareList.some(item => item.id === listing.id);
    if (exists) {
      setCompareList(compareList.filter(item => item.id !== listing.id));
      showToast('Removed from property comparison');
    } else {
      if (compareList.length >= 3) {
        showToast('⚠️ Maximum 3 properties can be compared at once.');
        return;
      }
      setCompareList([...compareList, listing]);
      showToast(`Added "${listing.title.slice(0, 24)}..." to comparison!`);
    }
  };

  const clearCompare = () => {
    setCompareList([]);
    showToast('Comparison list cleared');
  };

  // Add Forum post
  const addForumPost = (postData) => {
    const newPost = {
      id: `fp-${Date.now().toString().slice(-4)}`,
      postedAt: "Just now",
      verified: true,
      ...postData
    };
    setForumPosts([newPost, ...forumPosts]);
    showToast('🎉 Roommate sharing request published to Community Board!');
  };

  // Delete Forum post
  const deleteForumPost = (id) => {
    setForumPosts(prev => prev.filter(p => p.id !== id));
    showToast('🗑️ Forum post deleted successfully');
  };

  return (
    <AppContext.Provider value={{
      currentRole,
      setCurrentRole,
      selectedCity,
      setSelectedCity,
      listings,
      setListings,
      wishlist,
      toggleWishlist,
      activeListing,
      setActiveListing,
      bookingModalListing,
      setBookingModalListing,
      hoveredListingId,
      setHoveredListingId,
      activeTab,
      setActiveTab,
      visitBookings,
      scheduleVisit,
      deleteVisitBooking,
      rescheduleVisitBooking,
      filters,
      setFilters,
      authModalOpen,
      setAuthModalOpen,
      currentUser,
      setCurrentUser,
      toastMessage,
      showToast,
      addPropertyListing,
      deletePropertyListing,
      togglePropertyAvailability,
      verifyListing,
      theme,
      toggleTheme,
      selectedProperty,
      setSelectedProperty,
      propertyModalOpen,
      setPropertyModalOpen,
      compareList,
      setCompareList,
      toggleCompare,
      clearCompare,
      isCompareModalOpen,
      setIsCompareModalOpen,
      forumPosts,
      setForumPosts,
      forumFilter,
      setForumFilter,
      addForumPost,
      deleteForumPost
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

