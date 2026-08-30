/**
 * Safety Score & Scam Detection Engine for RoomNest Listings
 * Evaluates listing trustworthiness based on multiple safety signals.
 */

export const calculateSafetyScore = (listing) => {
  if (!listing) return { score: 100, level: 'safe', label: 'Safe & Verified', badgeColor: 'emerald', flags: [] };

  let score = 100;
  const flags = [];

  // 1. Photos Check
  const images = listing.images || [];
  if (images.length === 0) {
    score -= 30;
    flags.push({
      type: 'danger',
      title: 'No Real Photos Uploaded',
      description: 'Listing does not have any authentic verified images.',
      penalty: -30
    });
  } else if (images.length === 1) {
    score -= 10;
    flags.push({
      type: 'warning',
      title: 'Only 1 Photo Available',
      description: 'Limited visual verification. Ask for a live video tour before booking.',
      penalty: -10
    });
  }

  // 2. Rent Anomaly Check (Median Bhubaneswar student/bachelor rent ~ ₹7,500)
  const rent = Number(listing.rent || 0);
  if (rent > 0 && rent < 3500) {
    score -= 25;
    flags.push({
      type: 'danger',
      title: 'Unusually Low Price Trap',
      description: `Rent (₹${rent}/mo) is >50% below locality average. High likelihood of bait-and-switch.`,
      penalty: -25
    });
  }

  // 3. Owner Verification
  const isVerifiedOwner =
    listing.verifiedOwner === true ||
    (listing.verificationStatus && listing.verificationStatus.toLowerCase().includes('verified')) ||
    (listing.ownerInfo && listing.ownerInfo.verified === true);

  if (!isVerifiedOwner) {
    score -= 20;
    flags.push({
      type: 'warning',
      title: 'Unverified Owner / Broker',
      description: 'Landlord identity & property documents have not been physically audited by RoomNest team.',
      penalty: -20
    });
  }

  // 4. Contact Information Check
  const hasPhone = listing.ownerInfo?.phone || listing.phone;
  const hasWhatsapp = listing.ownerInfo?.whatsapp || listing.whatsapp;
  if (!hasPhone && !hasWhatsapp) {
    score -= 15;
    flags.push({
      type: 'danger',
      title: 'Missing Direct Contact Channel',
      description: 'No verified direct phone or WhatsApp channel provided by publisher.',
      penalty: -15
    });
  }

  // 5. Ratings and Reviews Check
  const rating = Number(listing.rating || 0);
  const reviewCount = Number(listing.reviewCount || (listing.reviews ? listing.reviews.length : 0));
  if (rating === 0 && reviewCount === 0) {
    score -= 10;
    flags.push({
      type: 'info',
      title: 'New / Unreviewed Property',
      description: 'No student or tenant reviews recorded yet for this accommodation.',
      penalty: -10
    });
  }

  // Keep score within 10 to 100
  score = Math.max(10, Math.min(100, score));

  let level = 'safe'; // 'safe' | 'caution' | 'risky'
  let label = 'Safe';
  let badgeColor = 'emerald';

  if (score < 50) {
    level = 'risky';
    label = 'Risky';
    badgeColor = 'rose';
  } else if (score < 75) {
    level = 'caution';
    label = 'Caution';
    badgeColor = 'amber';
  }

  return {
    score,
    level,
    label,
    badgeColor,
    flags
  };
};
