// src/services/tourismApi.js
// Dynamic Universal API Layer for Worldwide & Regional Tourism Data

import { TAMIL_NADU_PLACES } from '../data/tamilNaduData.js';
import { MONUMENTS } from '../data/monuments.js';
import { ATTRACTIONS } from '../data/attractions.js';

const API_STORAGE_KEY = 'lm_tn_tourism_dynamic_places_v2';

// Coordinate lookup map for popular global & regional cities
const CITY_COORDINATES = {
  'Agra': { lat: 27.1751, lng: 78.0421 },
  'Paris': { lat: 48.8584, lng: 2.2945 },
  'Rome': { lat: 41.8902, lng: 12.4922 },
  'Jaipur': { lat: 26.9855, lng: 75.8513 },
  'Thanjavur': { lat: 10.7828, lng: 79.1318 },
  'Madurai': { lat: 9.9195, lng: 78.1193 },
  'Chennai': { lat: 13.0827, lng: 80.2707 },
  'Mahabalipuram': { lat: 12.6269, lng: 80.1927 },
  'Kanyakumari': { lat: 8.0883, lng: 77.5385 },
  'Rameswaram': { lat: 9.2876, lng: 79.3129 },
  'Ooty': { lat: 11.4102, lng: 76.6950 },
  'Kodaikanal': { lat: 10.2381, lng: 77.4892 },
  'Tiruchirappalli': { lat: 10.7905, lng: 78.7047 },
  'Kanchipuram': { lat: 12.8342, lng: 79.7036 },
  'Coimbatore': { lat: 11.0168, lng: 76.9558 },
  'Cairo': { lat: 29.9792, lng: 31.1342 },
  'Kyoto': { lat: 35.0116, lng: 135.7681 }
};

/**
 * Enrich destination object with complete universal schema
 */
export function enrichDestinationSchema(raw) {
  if (!raw) return null;

  const name = raw.name || 'Tourism Destination';
  const city = raw.city || 'Heritage City';
  const state = raw.state || raw.district || raw.country || 'Tamil Nadu';
  const country = raw.country || 'India';
  const category = (raw.category || 'Monuments & Heritage').toLowerCase();

  // Coordinates
  const cityCoords = CITY_COORDINATES[city] || CITY_COORDINATES['Chennai'];
  const locationCoords = raw.locationCoords || raw.coords || cityCoords;

  // Traveler Suitability Pills ("Best for:")
  let suitableTravellerTypes = raw.suitableTravellerTypes || [];
  if (!suitableTravellerTypes.length) {
    if (category.includes('temple') || category.includes('spiritual')) {
      suitableTravellerTypes = ['Spiritual tourism', 'History lovers', 'Architecture', 'Families'];
    } else if (category.includes('beach') || category.includes('coastal')) {
      suitableTravellerTypes = ['Families', 'Photography', 'Sunset & Relaxation', 'Adventure'];
    } else if (category.includes('hill') || category.includes('waterfall') || category.includes('nature')) {
      suitableTravellerTypes = ['Nature lovers', 'Photography', 'Trekking', 'Families'];
    } else if (category.includes('wildlife')) {
      suitableTravellerTypes = ['Adventure', 'Families', 'Photography', 'Wildlife lovers'];
    } else {
      suitableTravellerTypes = ['History lovers', 'Architecture', 'Families', 'Photography'];
    }
  }

  // Why Famous & Cultural Significance
  const whyFamous = raw.whyFamous || raw.description || `World-renowned destination famous for its architectural mastery, rich history, and cultural heritage in ${city}, ${state}.`;
  const culturalSignificance = raw.culturalSignificance || raw.history || `Holds deep historical and cultural value, reflecting centuries of artistic heritage, engineering achievements, and regional traditions.`;

  // Highlights
  const importantHighlights = raw.importantHighlights || raw.highlights || [
    `Iconic architecture and landmark structures in ${city}`,
    `Vibrant cultural atmosphere and historical significance`,
    `Recommended photography spots and sunset view points`,
    `Accessible tourist facilities and local handicraft markets`
  ];

  // Historical Timeline
  let historyTimeline = raw.historyTimeline;
  if (!historyTimeline || !Array.isArray(historyTimeline)) {
    const eraBuilt = raw.year || raw.builtYear || 'Ancient Era';
    const builder = raw.builtBy || 'Historical Rulers';
    historyTimeline = [
      { era: 'Ancient Period', detail: `Early settlements and cultural roots established in ${city}.` },
      { era: 'Construction & Foundation', detail: `Constructed during ${eraBuilt} under the patronage of ${builder}.` },
      { era: 'Major Historical Events', detail: `Expanded over successive dynasties, standing as a pivotal regional landmark.` },
      { era: 'Modern Period', detail: `Restored and protected as a preserved heritage & tourism monument.` },
      { era: 'Present-Day Importance', detail: `Welcomes worldwide travelers as a iconic UNESCO / Cultural Heritage destination.` }
    ];
  }

  // Category-Adaptive Details
  const isHeritage = category.includes('monument') || category.includes('temple') || category.includes('fort') || category.includes('palace') || category.includes('historical') || category.includes('museum');
  const categoryDetails = raw.categoryDetails || (isHeritage ? {
    type: 'heritage',
    architecturalStyle: raw.architecture || raw.style || 'Dravidian / Classic Architectural Style',
    builtBy: raw.builtBy || 'Heritage Era Rulers',
    constructionEra: raw.builtYear || raw.year || 'Historical Period',
    materials: raw.materials || 'Granite, Carved Stone, and Mortar',
    keyStructures: raw.structures || ['Main Tower & Vimana', 'Sculptured Sanctum', 'Entrance Gopuram'],
    sculpturesArtwork: raw.artwork || 'Intricate stone carvings, relief sculptures, and wall murals',
    engineeringFeats: raw.engineering || 'Monolithic stone carving and ancient architectural precision'
  } : {
    type: 'nature',
    weatherInfo: raw.weather || 'Pleasant tropical climate with cool breezes',
    topActivities: raw.activities || ['Sightseeing & Viewpoints', 'Photography', 'Nature Walk & Relaxation'],
    wildlifeFlora: raw.flora || 'Rich local vegetation and scenic greenery',
    sunsetPoints: raw.sunsetPoints || 'Dedicated sunrise and sunset view decks',
    safetyRules: raw.safetyRules || 'Follow marked trail paths and local safety signage'
  });

  // Visitor Timings & Estimated Crowd Breakdown
  const openingTime = raw.openingTime || '06:00 AM';
  const closingTime = raw.closingTime || '08:00 PM';
  const daysOpen = raw.daysOpen || 'Open Daily';
  const closedDay = raw.closedDay || raw.closureInfo || 'None';
  const avgVisitDuration = raw.recommendedDuration || raw.duration || '2 – 3 Hours';
  const peakHours = raw.avoidPeakTime || raw.peakHours || '11:00 AM – 03:00 PM';
  const lowCrowdHours = raw.bestVisitingTimeWindow || '06:00 AM – 08:30 AM';
  const crowdDataType = raw.crowdDataType || 'Estimated';

  const crowdByTime = raw.crowdByTime || [
    { time: '06:00 AM', level: 'Low' },
    { time: '09:00 AM', level: 'Medium' },
    { time: '12:00 PM', level: 'High' },
    { time: '03:00 PM', level: 'High' },
    { time: '06:00 PM', level: 'Medium' },
    { time: '08:00 PM', level: 'Low' }
  ];

  // Best Time to Visit Reasoning
  const bestTimeToVisitReasoning = raw.bestTimeToVisitReasoning || {
    recommendedWindow: lowCrowdHours,
    reasons: [
      'Lower crowd density & shorter entry queues',
      'Optimal natural lighting for photography & tours',
      'Comfortable outdoor temperatures avoiding midday heat',
      'Sufficient time for a relaxed guided experience'
    ]
  };

  // Ticket Pricing Matrix
  const rawTickets = raw.tickets || {};
  const baseFee = raw.entryFee !== undefined ? raw.entryFee : (rawTickets.adult !== undefined ? rawTickets.adult : 0);
  const isFree = baseFee === 0 || rawTickets.isFree;

  const ticketInfo = {
    isFree,
    priceType: raw.priceType || 'Official',
    adult: isFree ? 0 : baseFee,
    child: isFree ? 0 : (rawTickets.child !== undefined ? rawTickets.child : Math.round(baseFee * 0.5)),
    student: isFree ? 0 : (rawTickets.student !== undefined ? rawTickets.student : Math.round(baseFee * 0.5)),
    senior: isFree ? 0 : (rawTickets.senior !== undefined ? rawTickets.senior : Math.round(baseFee * 0.7)),
    domestic: isFree ? 0 : baseFee,
    foreigner: isFree ? 0 : (rawTickets.foreigner || (baseFee > 0 ? (country === 'India' ? baseFee * 10 : baseFee) : 0)),
    cameraFee: rawTickets.cameraFee || 25,
    parkingFee: rawTickets.parkingFee || 50,
    guideFee: rawTickets.guideFee || 300,
    bookingWebsite: rawTickets.bookingWebsite || null
  };

  // Travel Tips
  const travelTips = raw.travelTips || {
    wear: raw.wear || 'Comfortable walking shoes and modest clothing suitable for cultural sites.',
    carry: raw.carry || 'Water bottle, sun hat, sunglasses, camera, and personal ID.',
    photography: raw.photography || 'Photography permitted in general areas; follow signs near sanctums.',
    etiquette: raw.etiquette || 'Maintain quiet respect; remove shoes at designated entrances where required.',
    accessibility: raw.accessibility || 'Ramps and guided paths available near main entry points.',
    safety: raw.safety || 'Stay hydrated, keep personal belongings secure, and follow official guides.'
  };

  return {
    ...raw,
    id: raw.id,
    name,
    city,
    state,
    country,
    category: raw.category || 'Monuments & Heritage',
    rating: raw.rating || 4.8,
    reviewsCount: raw.reviewsCount || 850,
    imageUrl: raw.imageUrl,
    description: raw.description || `${name} is a iconic destination located in ${city}, ${state}, ${country}.`,
    history: raw.history || raw.description,
    unescoStatus: Boolean(raw.unescoStatus),
    whyFamous,
    culturalSignificance,
    importantHighlights,
    suitableTravellerTypes,
    historyTimeline,
    categoryDetails,
    openingTime,
    closingTime,
    daysOpen,
    closedDay,
    avgVisitDuration,
    peakHours,
    lowCrowdHours,
    crowdLevel: raw.crowdLevel || 'Medium',
    crowdDataType,
    crowdByTime,
    bestTimeToVisitReasoning,
    ticketInfo,
    travelTips,
    locationCoords,
    thingsToSee: raw.thingsToSee || importantHighlights.slice(0, 3),
    thingsToDo: raw.thingsToDo || ['Guided Tour', 'Photography', 'Heritage Walk & Shopping']
  };
}

export class TourismApiService {
  /**
   * Get all tourist destinations (combining Monuments, Regional Places, Attractions)
   */
  static getAllDestinations() {
    const rawPlaces = this.getPlaces();
    const map = new Map();

    // 1. Add MONUMENTS
    (MONUMENTS || []).forEach(m => {
      if (m && m.id) map.set(m.id, enrichDestinationSchema(m));
    });

    // 2. Add TAMIL_NADU_PLACES
    (rawPlaces || []).forEach(p => {
      if (p && p.id && !map.has(p.id)) {
        map.set(p.id, enrichDestinationSchema(p));
      }
    });

    // 3. Add ATTRACTIONS
    (ATTRACTIONS || []).forEach(a => {
      if (a && a.id && !map.has(a.id)) {
        map.set(a.id, enrichDestinationSchema({
          id: a.id,
          name: a.name,
          city: a.city,
          state: a.country || 'Tamil Nadu',
          country: a.country || 'India',
          category: 'Tourist Destination',
          imageUrl: a.imageUrl,
          description: a.description,
          entryFee: a.price || 0,
          rating: a.rating || 4.8
        }));
      }
    });

    return Array.from(map.values());
  }

  /**
   * Get places from local dynamic store
   */
  static getPlaces() {
    try {
      const stored = localStorage.getItem(API_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.warn('[TourismApi] Failed to parse cached places:', err);
    }
    this.savePlaces(TAMIL_NADU_PLACES);
    return TAMIL_NADU_PLACES;
  }

  static savePlaces(places) {
    try {
      localStorage.setItem(API_STORAGE_KEY, JSON.stringify(places));
    } catch (err) {
      console.error('[TourismApi] Failed to save places:', err);
    }
  }

  /**
   * Fetch single destination by ID or Name
   */
  static getPlaceById(id) {
    if (!id) return null;
    const all = this.getAllDestinations();
    const target = all.find(p => p.id === id || p.name.toLowerCase().includes(String(id).toLowerCase()));
    return target || null;
  }

  /**
   * Universal Smart Global Filter
   */
  static filterPlaces({ country = 'All', category = 'all', city = 'All Cities', searchQuery = '', maxBudget = null }) {
    let list = this.getAllDestinations();

    if (country && country !== 'All') {
      const c = country.toLowerCase();
      list = list.filter(p => p.country.toLowerCase().includes(c));
    }

    if (category && category !== 'all') {
      const cat = category.toLowerCase();
      list = list.filter(p => p.category.toLowerCase().includes(cat));
    }

    if (city && city !== 'All Cities') {
      const ct = city.toLowerCase();
      list = list.filter(p => p.city.toLowerCase().includes(ct) || p.state.toLowerCase().includes(ct));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        (p.nameTa && p.nameTa.includes(q)) ||
        p.city.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (maxBudget !== null && !isNaN(maxBudget)) {
      list = list.filter(p => (p.ticketInfo?.adult || 0) <= maxBudget);
    }

    return list;
  }

  /**
   * Get geographically nearby places based on coordinates or city
   */
  static getNearbyDestinations(currentDest, maxCount = 4) {
    if (!currentDest) return [];
    const all = this.getAllDestinations();
    const currentId = currentDest.id;
    const currentCity = (currentDest.city || '').toLowerCase();
    const currentState = (currentDest.state || '').toLowerCase();

    // Calculate distance if lat/lng available
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const candidates = all.filter(p => p.id !== currentId);

    if (currentDest.locationCoords?.lat && currentDest.locationCoords?.lng) {
      candidates.forEach(p => {
        if (p.locationCoords?.lat && p.locationCoords?.lng) {
          p.distanceKm = Math.round(calculateDistance(
            currentDest.locationCoords.lat, currentDest.locationCoords.lng,
            p.locationCoords.lat, p.locationCoords.lng
          ));
        } else {
          p.distanceKm = p.city.toLowerCase() === currentCity ? 10 : 150;
        }
      });
      candidates.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
    } else {
      candidates.sort((a, b) => {
        const aSameCity = a.city.toLowerCase() === currentCity ? 0 : a.state.toLowerCase() === currentState ? 1 : 2;
        const bSameCity = b.city.toLowerCase() === currentCity ? 0 : b.state.toLowerCase() === currentState ? 1 : 2;
        return aSameCity - bSameCity;
      });
    }

    return candidates.slice(0, maxCount);
  }

  static updateLiveCrowdStatus(placeId, newCrowdLevel) {
    const places = this.getPlaces();
    const target = places.find(p => p.id === placeId);
    if (target) {
      target.crowdLevel = newCrowdLevel;
      this.savePlaces(places);
    }
    return target;
  }

  static getCrowdBadge(crowdLevel, lang = 'en') {
    const level = (crowdLevel || 'Low').toLowerCase();
    if (level === 'high') {
      return { label: lang === 'ta' ? 'அதிக கூட்டம்' : 'High Crowd', bg: '#fee2e2', color: '#991b1b', icon: 'group' };
    } else if (level === 'medium') {
      return { label: lang === 'ta' ? 'மிதமான கூட்டம்' : 'Medium Crowd', bg: '#fef3c7', color: '#92400e', icon: 'person' };
    } else {
      return { label: lang === 'ta' ? 'குறைந்த கூட்டம்' : 'Low Crowd', bg: '#d1fae5', color: '#065f46', icon: 'person_check' };
    }
  }
}

