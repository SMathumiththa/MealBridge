/**
 * Calculate distance using Haversine formula
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns distance in km
 */
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Calculate AI Match Score for a single NGO
 */
function calculateMatchScore(donation, ngo) {
  let score = 0;
  
  // Weights (Total = 100)
  const DISTANCE_WEIGHT = 45;
  const PRESERVATION_WEIGHT = 20;
  const NEED_WEIGHT = 20;
  const TRUST_WEIGHT = 15;

  // 1. Distance Score (45%)
  let distanceScore = 0;
  const donLat = donation.location?.lat;
  const donLng = donation.location?.lng;
  const donAddress = donation.location?.address ? donation.location.address.toLowerCase() : "";

  let distance = null;
  if (donLat && donLng && ngo.officeLocation?.lat && ngo.officeLocation?.lng) {
    distance = getDistanceFromLatLonInKm(donLat, donLng, ngo.officeLocation.lat, ngo.officeLocation.lng);
  }

  if (distance !== null) {
    // 0km = 100% of weight, > 25km = 0% of weight
    const maxDistance = 25; 
    let normDist = Math.max(0, maxDistance - distance) / maxDistance;
    distanceScore = normDist * DISTANCE_WEIGHT;
  } else if (donAddress && ngo.officeLocation?.address) {
    // String matching fallback
    const ngoAddr = ngo.officeLocation.address.toLowerCase();
    const donParts = donAddress.split(',').map(s => s.trim()).filter(s => s.length > 3);
    let matched = false;
    for (const part of donParts) {
      if (ngoAddr.includes(part)) {
        matched = true;
        break;
      }
    }
    distanceScore = matched ? (DISTANCE_WEIGHT * 0.7) : (DISTANCE_WEIGHT * 0.2); // 70% if string match, 20% if unknown
  } else {
    distanceScore = DISTANCE_WEIGHT * 0.2; // Baseline unknown
  }

  // 2. Food Preservation Factor (20%)
  let preservationScore = PRESERVATION_WEIGHT; // Default full score
  const isPerishable = donation.foodType?.toLowerCase().includes('cooked') || donation.foodType?.toLowerCase().includes('perishable');
  
  if (isPerishable) {
    const hoursToExpiry = (new Date(donation.expiryTime).getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursToExpiry < 6 && distance !== null && distance > 10) {
      // Heavily penalize if it's expiring soon and NGO is > 10km away
      preservationScore = 0;
    } else if (hoursToExpiry < 6 && distance !== null && distance < 5) {
      // Boost if very close and urgent
      preservationScore = PRESERVATION_WEIGHT;
    }
  }

  // 3. Need / Fairness Score (20%)
  // NGOs with fewer donations get higher scores (max 100 donations threshold)
  const totalDonations = ngo.totalDonations || 0;
  let needFactor = Math.max(0, 100 - totalDonations) / 100;
  // Let's make it so even large NGOs get at least half the need score, to not completely punish them
  needFactor = 0.5 + (needFactor * 0.5); 
  let needScore = needFactor * NEED_WEIGHT;

  // 4. Trust Score (15%)
  const rating = ngo.averageRating || 0;
  // If no rating yet (0), give them a neutral 3/5 score so they aren't penalized
  const effectiveRating = (ngo.totalRatings === 0) ? 3 : rating;
  let trustScore = (effectiveRating / 5) * TRUST_WEIGHT;

  // Total
  score = Math.round(distanceScore + preservationScore + needScore + trustScore);
  
  // Cap at 99% because nothing is perfect
  if (score > 99) score = 99;
  if (score < 10) score = 10;

  return score;
}

/**
 * Finds the top best-matching NGOs for a given food donation
 * @param {Object} donation - The created Food object
 * @param {Array} ngos - List of active NGO users
 * @param {number} limit - Number of matches to return (default 5)
 * @returns {Array} Array of best matching NGOs with their scores
 */
const findBestMatches = (donation, ngos, limit = 5) => {
  if (!ngos || ngos.length === 0) return [];

  // Map NGOs with a computed AI Match Score
  let scoredNgos = ngos.map(ngo => {
    return {
      ngo,
      matchPercentage: calculateMatchScore(donation, ngo)
    };
  });

  // Sort by highest match percentage
  scoredNgos.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return scoredNgos.slice(0, limit);
};

module.exports = {
  findBestMatches,
  getDistanceFromLatLonInKm,
  calculateMatchScore
};
