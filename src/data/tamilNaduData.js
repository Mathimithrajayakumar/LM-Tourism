// src/data/tamilNaduData.js
// Hierarchical Dataset for India -> Tamil Nadu Tourism Experience

export const TAMIL_NADU_CATEGORIES = [
  { id: "all", name: "All Places", icon: "explore", nameTa: "அனைத்து இடங்கள்", nameHi: "सभी स्थान" },
  { id: "temples", name: "Temples & Spiritual", icon: "temple_hindu", nameTa: "கோவில்கள் & ஆன்மீகம்", nameHi: "मंदिर और आध्यात्मिक" },
  { id: "historical", name: "Historical & Heritage", icon: "castle", nameTa: "வரலாறு & பாரம்பரியம்", nameHi: "ऐतिहासिक और धरोहर" },
  { id: "beaches", name: "Beaches & Coastal", icon: "beach_access", nameTa: "கடற்கரைகள்", nameHi: "समुद्र तट" },
  { id: "hillstations", name: "Hill Stations", icon: "landscape", nameTa: "மலை வாசஸ்தலங்கள்", nameHi: "हिल स्टेशन" },
  { id: "waterfalls", name: "Waterfalls", icon: "waterfall_chart", nameTa: "அருவிகள்", nameHi: "झरने" },
  { id: "wildlife", name: "Wildlife & Sanctuaries", icon: "pets", nameTa: "வனவிலங்கு சரணாலயங்கள்", nameHi: "वन्यजीव अभ्यारण्य" },
  { id: "museums", name: "Museums & Art", icon: "museum", nameTa: "அருங்காட்சியகங்கள்", nameHi: "संग्रहालय" },
  { id: "forts", name: "Forts & Palaces", icon: "fort", nameTa: "கோட்டைகள் & அரண்மனைகள்", nameHi: "किले और महल" },
  { id: "cultural", name: "Cultural Places", icon: "theater_comedy", nameTa: "கலாச்சார இடங்கள்", nameHi: "सांस्कृतिक स्थल" },
  { id: "hiddengems", name: "Hidden Gems", icon: "auto_awesome", nameTa: "மறைக்கப்பட்ட இடங்கள்", nameHi: "अनोखे छिपे स्थान" }
];

export const TAMIL_NADU_CITIES = [
  "All Cities",
  "Chennai",
  "Mahabalipuram",
  "Thanjavur",
  "Madurai",
  "Rameswaram",
  "Kanyakumari",
  "Ooty",
  "Kodaikanal",
  "Yercaud",
  "Coimbatore",
  "Tiruchirappalli",
  "Chidambaram",
  "Kanchipuram",
  "Dhanushkodi",
  "Courtallam",
  "Dharmapuri",
  "Cuddalore"
];

export const TAMIL_NADU_PLACES = [
  // 🛕 TEMPLES
  {
    id: "brihadeeswarar-temple",
    name: "Brihadeeswarar Temple (Big Temple)",
    nameTa: "பிரகதீஸ்வரர் கோவில் (தஞ்சை பெரிய கோவில்)",
    nameHi: "बृहदेश्वर मंदिर (तंजावुर)",
    country: "India",
    state: "Tamil Nadu",
    city: "Thanjavur",
    district: "Thanjavur",
    category: "temples",
    rating: 4.9,
    reviewsCount: 14200,
    isFeatured: true,
    unescoStatus: true,
    builtBy: "Emperor Raja Raja Chola I",
    builtYear: "1010 CE",
    architecture: "Dravidian Chola Architecture",
    imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1621831873401-86c7744aa209?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "A UNESCO World Heritage Site built by King Raja Raja Chola I. One of the largest South Indian temples with a 216-foot monolithic vimana spire.",
    descriptionTa: "ராஜா ராஜ சோழனால் கட்டப்பட்ட யுனெஸ்கோ உலகப் பாரம்பரியக் களம். 216 அடி உயர ஒரே கல்லால் ஆன விமான கோபுரம் கொண்டது.",
    history: "Constructed between 1003 and 1010 CE as a grand statement of Chola Empire power. The apex block (Kumbam) weighs nearly 80 tonnes and was carved from a single granite block.",
    openingTime: "06:00 AM",
    closingTime: "08:30 PM",
    specialTimings: "Sanctum closed 12:30 PM - 04:00 PM",
    closureInfo: "Open all 7 days",
    crowdLevel: "Medium", // Low, Medium, High
    crowdDataType: "Estimated", // Clearly labeled as estimated historical pattern
    crowdNote: "Estimated based on historical visitor patterns. Peak on Pradosham & festival days.",
    peakHours: "07:30 AM - 10:30 AM & 05:00 PM - 07:30 PM",
    suggestedVisitTime: "06:00 AM - 07:30 AM or 04:00 PM - 05:00 PM",
    tickets: {
      adult: 0,
      child: 0,
      foreigner: 0,
      cameraFee: 30,
      isFree: true,
      bookingWebsite: "https://hrce.tn.gov.in",
      bookingStatusText: "Free Entry — HR&CE Official Portal Available"
    },
    bestTime: "October to March",
    bestSeason: "Winter & Pongal Festival (January)",
    howToReach: {
      air: "Tiruchirappalli International Airport (TRZ) - 60 km",
      rail: "Thanjavur Junction (TJ) - 2 km",
      road: "Direct NH-67 connectivity from Chennai (340 km) and Trichy (55 km)"
    },
    audioGuideText: "Welcome to the Brihadeeswarar Temple in Thanjavur. Built over a thousand years ago by Emperor Raja Raja Chola I, this granite marvel features a shadowless tower design and a massive monolithic Nandi statue.",
    hasAr3d: true,
    arModelName: "Brihadeeswarar",
    locationCoords: { lat: 10.7828, lng: 79.1318 },
    nearby: {
      restaurants: ["Sathars Restaurant", "Vasantha Bhavan Thanjavur", "Hotel Tamil Nadu Restaurant"],
      hotels: ["GRT Great Trails Thanjavur", "Hotel Sangam", "Svatma Heritage Resort"],
      hospitals: ["Thanjavur Medical College Hospital (Ph: 04362-240011)"],
      police: "Thanjavur West Police Station (Ph: 100 / 04362-230100)"
    }
  },
  {
    id: "meenakshi-amman-temple",
    name: "Meenakshi Amman Temple",
    nameTa: "மதுரை மீனாட்சி அம்மன் கோவில்",
    nameHi: "मीनाक्षी अम्मन मंदिर (मदुरै)",
    country: "India",
    state: "Tamil Nadu",
    city: "Madurai",
    district: "Madurai",
    category: "temples",
    rating: 4.9,
    reviewsCount: 18900,
    isFeatured: true,
    unescoStatus: false,
    builtBy: "Pandyan Kings & Thirumalai Nayak",
    builtYear: "14th - 17th Century CE",
    architecture: "Dravidian Architecture with 14 Tower Gopurams",
    imageUrl: "https://images.unsplash.com/photo-1609946782701-7901968840b2?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1609946782701-7901968840b2?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Historic temple complex dedicated to Goddess Meenakshi and Lord Sundareswarar, famed for its 1,000 pillar hall and colorful sculpted gopurams.",
    descriptionTa: "14 வண்ணமயமான கோபுரங்கள் மற்றும் 1000 கால் மண்டபம் கொண்ட உலகப் புகழ்பெற்ற மதுரை மீனாட்சி சுந்தரேஸ்வரர் கோவில்.",
    history: "Originally constructed by Pandyan rulers, rebuilt and vastly expanded by Thirumalai Nayak in the 17th century with intricate stucco sculptures.",
    openingTime: "05:00 AM",
    closingTime: "09:30 PM",
    specialTimings: "Temple closed 12:30 PM - 04:00 PM for afternoon rituals",
    closureInfo: "Open all days",
    crowdLevel: "High",
    crowdDataType: "Estimated",
    crowdNote: "Estimated crowd based on temple pilgrimage patterns. Heaviest during Chithirai festival.",
    peakHours: "06:00 AM - 11:00 AM & 06:00 PM - 09:00 PM",
    suggestedVisitTime: "05:00 AM sharp or 04:00 PM - 05:30 PM",
    tickets: {
      adult: 0,
      child: 0,
      foreigner: 50,
      specialDarshan: 100,
      isFree: false,
      bookingWebsite: "https://maduraimeenakshi.hrce.tn.gov.in",
      bookingStatusText: "Special Darshan Booking Available via HR&CE Portal"
    },
    bestTime: "October to March",
    bestSeason: "Chithirai Thiruvizha (April/May)",
    howToReach: {
      air: "Madurai Airport (IXM) - 12 km",
      rail: "Madurai Junction (MDU) - 1.5 km",
      road: "Central Bus Stand Mattuthavani & Periyar Bus Stand"
    },
    audioGuideText: "Greetings from Madurai Meenakshi Temple. Notice the 14 soaring towers adorned with thousands of colorful mythological figures.",
    hasAr3d: true,
    arModelName: "MeenakshiTemple",
    locationCoords: { lat: 9.9195, lng: 78.1193 },
    nearby: {
      restaurants: ["Murugan Idli Shop", "Amma Mess", "Sree Sabarees"],
      hotels: ["Heritage Madurai", "Courtyard by Marriott Madurai", "Hotel Tamil Nadu"],
      hospitals: ["Rajaji Government Hospital Madurai (Ph: 0452-2532535)"],
      police: "Madurai Town Police Station (Ph: 100 / 0452-2338201)"
    }
  },

  // 🏛 HISTORICAL & HERITAGE
  {
    id: "shore-temple-mahabalipuram",
    name: "Shore Temple & Pancha Rathas",
    nameTa: "மாமல்லபுரம் கடற்கரைக் கோவில் & பஞ்ச ரதங்கள்",
    nameHi: "शोर मंदिर महाबलीपुरम",
    country: "India",
    state: "Tamil Nadu",
    city: "Mahabalipuram",
    district: "Chengalpattu",
    category: "historical",
    rating: 4.8,
    reviewsCount: 11500,
    isFeatured: true,
    unescoStatus: true,
    builtBy: "Pallava Dynasty (Narasimhavarman II)",
    builtYear: "700 - 728 CE",
    architecture: "Pallava Rock-Cut Architecture",
    imageUrl: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "UNESCO monument complex overlooking the Bay of Bengal. Features structural granite shore temple, monolithic Pancha Rathas, and Arjuna's Penance.",
    descriptionTa: "வங்காள விரிகுடாவை நோக்கிய யுனெஸ்கோ கலைச்சின்னம். பல்லவர் கால பாறை குடைவரை சிற்பங்கள் மற்றும் பஞ்ச ரதங்கள் கொண்டது.",
    history: "Built during the reign of King Rajasimha. Served as a busy port city connecting ancient Tamil Nadu with Southeast Asia.",
    openingTime: "06:00 AM",
    closingTime: "06:00 PM",
    specialTimings: "Sound & Light show at 06:30 PM (Weekends)",
    closureInfo: "Open all 7 days",
    crowdLevel: "Medium",
    crowdDataType: "Estimated",
    crowdNote: "Estimated crowd. Weekend afternoons experience heavy tour bus traffic.",
    peakHours: "10:00 AM - 01:00 PM & 03:30 PM - 05:30 PM",
    suggestedVisitTime: "06:00 AM - 08:30 AM (Sunrise & cool breeze)",
    tickets: {
      adult: 40,
      child: 0,
      foreigner: 600,
      isFree: false,
      bookingWebsite: "https://asi.payumoney.com",
      bookingStatusText: "Official ASI Online E-Ticket Booking Available"
    },
    bestTime: "November to February",
    bestSeason: "Mamallapuram Dance Festival (Dec - Jan)",
    howToReach: {
      air: "Chennai International Airport (MAA) - 55 km",
      rail: "Chengalpattu Junction (CGL) - 29 km",
      road: "Scenic East Coast Road (ECR) from Chennai (50 km)"
    },
    audioGuideText: "Welcome to the Shore Temple of Mahabalipuram, crafted out of solid blocks of granite by Pallava sculptors overlooking the ocean waves.",
    hasAr3d: true,
    arModelName: "ShoreTemple",
    locationCoords: { lat: 12.6169, lng: 80.1993 },
    nearby: {
      restaurants: ["Moonrakers", "Bambroo Restaurant", "Wharf 2.0 at Radisson Blu"],
      hotels: ["Radisson Blu Resort Temple Bay", "InterContinental Chennai ECR"],
      hospitals: ["Mahabalipuram Primary Health Centre (Ph: 044-27442232)"],
      police: "Mahabalipuram Police Station (Ph: 044-27442229)"
    }
  },

  // 🏖 BEACHES
  {
    id: "marina-beach-chennai",
    name: "Marina Beach",
    nameTa: "மெரினா பீச் (சென்னை)",
    nameHi: "मरीना बीच (चेन्नई)",
    country: "India",
    state: "Tamil Nadu",
    city: "Chennai",
    district: "Chennai",
    category: "beaches",
    rating: 4.7,
    reviewsCount: 32000,
    isFeatured: true,
    unescoStatus: false,
    builtBy: "Natural Coastline / Sir Mountstuart Grant Duff",
    builtYear: "1884 CE",
    architecture: "Natural Sandy Beach & Heritage Promenade",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "The world's second-longest urban beach stretching 13 km along the Coromandel Coast. Famous for lighthouse, horse rides, and street food.",
    descriptionTa: "13 கி.மீ நீளம் கொண்ட உலகின் இரண்டாவது மிக நீண்ட நகர்ப்புற கடற்கரை.",
    history: "Renovated into a promenade in 1884 by Governor Grant Duff. Features statues of Tamil scholars and leader memorials.",
    openingTime: "24 Hours Open",
    closingTime: "24 Hours Open",
    specialTimings: "Lighthouse open 10:00 AM - 01:00 PM & 03:00 PM - 05:00 PM (Closed Mondays)",
    closureInfo: "Beach open 24/7",
    crowdLevel: "High",
    crowdDataType: "Estimated",
    crowdNote: "Estimated crowd based on urban evening crowds. Heaviest Saturday & Sunday evenings.",
    peakHours: "05:00 PM - 09:00 PM (Weekends)",
    suggestedVisitTime: "05:30 AM - 07:30 AM (Sunrise & Jogging) or 05:00 PM - 07:00 PM",
    tickets: {
      adult: 0,
      child: 0,
      foreigner: 0,
      isFree: true,
      bookingWebsite: null,
      bookingStatusText: "Online booking unavailable — check at venue (Free Public Beach)"
    },
    bestTime: "November to February",
    bestSeason: "Pongal & Evenings year-round",
    howToReach: {
      air: "Chennai Airport (MAA) - 18 km",
      rail: "Chennai Central (MAS) - 4 km, Chepauk / Light House MRTS Station - 500m",
      road: "Kamarajar Salai (Beach Road) bus routes"
    },
    audioGuideText: "Welcome to Marina Beach, stretching 13 kilometers along the azure waters of the Bay of Bengal.",
    hasAr3d: false,
    locationCoords: { lat: 13.0499, lng: 80.2824 },
    nearby: {
      restaurants: ["Nair Mess", "Sundari Akka Kadai", "Hot Breads", "Ratna Cafe"],
      hotels: ["The Park Chennai", "Taj Coromandel", "Clarion Hotel"],
      hospitals: ["Government Kasturba Gandhi Hospital (Ph: 044-28545001)"],
      police: "Marina Beach Police Station (Ph: 100 / 044-28441088)"
    }
  },

  // ⛰ HILL STATIONS
  {
    id: "ooty-nilgiris",
    name: "Ooty (Udhagamandalam) & Toy Train",
    nameTa: "ஊட்டி (உதகமண்டலம்) & பொம்மை ரயில்",
    nameHi: "ऊटी (उधगमंडलम) और टॉय ट्रेन",
    country: "India",
    state: "Tamil Nadu",
    city: "Ooty",
    district: "Nilgiris",
    category: "hillstations",
    rating: 4.8,
    reviewsCount: 22000,
    isFeatured: true,
    unescoStatus: true,
    builtBy: "John Sullivan (British Era Discovery)",
    builtYear: "1821 CE",
    architecture: "Colonial Hill Station & Nilgiri Mountain Railway",
    imageUrl: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Queen of Hill Stations set at 2,240m altitude. Famous for tea gardens, Ooty Lake, Botanical Garden, Doddabetta Peak, and UNESCO Toy Train.",
    descriptionTa: "மலைகளின் அரசி என அழைக்கப்படும் ஊட்டி. தேயிலைத் தோட்டங்கள், ஏரி, தாவரவியல் பூங்கா கொண்டது.",
    history: "Discovered as a cool summer retreat by Collector John Sullivan in 1819. The Nilgiri Mountain Railway rack system was completed in 1908.",
    openingTime: "08:30 AM",
    closingTime: "06:30 PM",
    specialTimings: "Botanical Garden 07:00 AM - 06:30 PM",
    closureInfo: "Open all 7 days",
    crowdLevel: "High",
    crowdDataType: "Estimated",
    crowdNote: "Estimated crowd based on seasonal tourist rushes (April-June Summer & Long Weekends).",
    peakHours: "10:00 AM - 04:00 PM (Summer April-June & May Flower Show)",
    suggestedVisitTime: "08:30 AM - 11:00 AM for Lake & Doddabetta",
    tickets: {
      adult: 50,
      child: 25,
      foreigner: 100,
      toyTrainTicket: 205,
      isFree: false,
      bookingWebsite: "https://www.irctc.co.in",
      bookingStatusText: "Toy Train Tickets Available via IRCTC Official Portal"
    },
    bestTime: "October to June",
    bestSeason: "May Summer Festival & October Autumn",
    howToReach: {
      air: "Coimbatore International Airport (CJB) - 88 km",
      rail: "Udhagamandalam Railway Station (UAM) via Mettupalayam (MTP)",
      road: "Gudalur / Coonoor mountain roads (36 Hairpin bends via Kallatti)"
    },
    audioGuideText: "Welcome to Ooty, 7,300 feet above sea level in the Nilgiri Hills. Experience mist-covered valleys and tea plantations.",
    hasAr3d: false,
    locationCoords: { lat: 11.4102, lng: 76.6950 },
    nearby: {
      restaurants: ["Earl's Secret", "Shinkows Chinese", "Nahar Sidewalk Cafe"],
      hotels: ["Savoy IHCL SeleQtions Ooty", "Sterling Ooty Fern Hill"],
      hospitals: ["Government District Head Quarters Hospital Ooty (Ph: 0423-2442212)"],
      police: "Ooty Town Police Station (Ph: 100 / 0423-2444004)"
    }
  },

  // 🌊 WATERFALLS
  {
    id: "hogenakkal-falls",
    name: "Hogenakkal Falls",
    nameTa: "ஒகேனக்கல் அருவி",
    nameHi: "होगेनक्कल झरना (धर्मपुरी)",
    country: "India",
    state: "Tamil Nadu",
    city: "Dharmapuri",
    district: "Dharmapuri",
    category: "waterfalls",
    rating: 4.7,
    reviewsCount: 12800,
    isFeatured: true,
    unescoStatus: false,
    builtBy: "Kaveri River Natural Formation",
    builtYear: "Ancient",
    architecture: "Natural Carbonatite Rock Canyon Cascades",
    imageUrl: "https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Known as the 'Niagara of India' where the Kaveri river splits into multiple roaring cascades. Famous for Coracle (Parisal) round boat rides and herbal oil massages.",
    descriptionTa: "இந்தியாவின் நயாகரா என்றழைக்கப்படும் ஒகேனக்கல் அருவி. பரிசல் சவாரி மற்றும் மூலிகை எண்ணெய் மசாஜிற்கு புகழ்பெற்றது.",
    history: "Name means 'Smoky Rocks' in Kannada/Tamil due to the mist generated when water plunges onto carbonatite rocks.",
    openingTime: "08:00 AM",
    closingTime: "05:30 PM",
    specialTimings: "Coracle rides depend on water flow safety level",
    closureInfo: "Boating may close during heavy monsoon floods",
    crowdLevel: "Medium",
    crowdDataType: "Estimated",
    crowdNote: "Estimated crowd. Heavy on weekend holidays and post-monsoon months.",
    peakHours: "10:30 AM - 02:30 PM (Sundays)",
    suggestedVisitTime: "08:00 AM - 10:30 AM",
    tickets: {
      adult: 10,
      child: 5,
      foreigner: 50,
      coracleRidePerHead: 750,
      isFree: false,
      bookingWebsite: null,
      bookingStatusText: "Online booking unavailable — check at venue (TTDC Counter)"
    },
    bestTime: "August to January",
    bestSeason: "Post-Monsoon (Sept - Nov)",
    howToReach: {
      air: "Bengaluru International Airport (BLR) - 180 km",
      rail: "Dharmapuri Railway Station (DPJ) - 46 km",
      road: "Direct state buses from Dharmapuri & Salem (85 km)"
    },
    audioGuideText: "Feel the mist of Hogenakkal Falls. Step into a traditional circular woven coracle boat to glide right up to the roaring granite gorge cascades.",
    hasAr3d: false,
    locationCoords: { lat: 12.1182, lng: 77.7770 },
    nearby: {
      restaurants: ["TTDC Hotel Tamil Nadu Restaurant", "Fish Fry Stalls by River"],
      hotels: ["Hotel Tamil Nadu Hogenakkal", "Deeyam Resort"],
      hospitals: ["Pennagaram Government Hospital (Ph: 04342-255230)"],
      police: "Hogenakkal Police Station (Ph: 100 / 04342-256222)"
    }
  },

  // 🐘 WILDLIFE & SANCTUARIES
  {
    id: "mudumalai-national-park",
    name: "Mudumalai Tiger Reserve & Elephant Camp",
    nameTa: "முதுமலை புலிகள் காப்பகம் & யானைகள் முகாம்",
    nameHi: "मुदुमलाई टाइगर रिजर्व",
    country: "India",
    state: "Tamil Nadu",
    city: "Nilgiris",
    district: "Nilgiris",
    category: "wildlife",
    rating: 4.8,
    reviewsCount: 8900,
    isFeatured: true,
    unescoStatus: true,
    builtBy: "Tamil Nadu Forest Department",
    builtYear: "1940 CE",
    architecture: "Nilgiri Biosphere Reserve Forest",
    imageUrl: "https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "UNESCO Nilgiri Biosphere sanctuary home to Bengal Tigers, Indian Leopards, Asiatic Elephants, and Theppakadu Elephant Camp (location of Oscar-winning 'The Elephant Whisperers').",
    descriptionTa: "யானைகள், புலிகள் மற்றும் 'தி எலிஃபென்ட் விஸ்பரர்ஸ்' ஆவணப்படம் படமாக்கப்பட்ட தெப்பக்காடு யானைகள் முகாம் அமைந்த இடம்.",
    history: "Declared a sanctuary in 1940 and tiger reserve in 2007. Connects Bandipur and Wayanad reserves.",
    openingTime: "06:00 AM",
    closingTime: "06:00 PM",
    specialTimings: "Forest Safaris: 06:00 AM - 09:00 AM & 03:00 PM - 06:00 PM",
    closureInfo: "Safari subject to weather & seasonal closure in severe summer",
    crowdLevel: "Medium",
    crowdDataType: "Estimated",
    crowdNote: "Estimated crowd based on forest safari slot allocations.",
    peakHours: "06:30 AM Safari & 03:30 PM Safari",
    suggestedVisitTime: "06:00 AM (Morning Safari)",
    tickets: {
      adult: 45,
      child: 20,
      foreigner: 350,
      busSafari: 340,
      jeepSafari: 2500,
      isFree: false,
      bookingWebsite: "https://mudumalaitigerreserve.com",
      bookingStatusText: "Official Safari Booking Available via Forest Dept Portal"
    },
    bestTime: "October to May",
    bestSeason: "Winter & Early Summer (Wildlife spotting)",
    howToReach: {
      air: "Coimbatore Airport (CJB) - 160 km & Mysore Airport (MYQ) - 90 km",
      rail: "Udhagamandalam (Ooty) - 36 km & Mysore Junction - 90 km",
      road: "NH-181 connecting Ooty to Mysore through forest checkpoints"
    },
    audioGuideText: "Welcome to Mudumalai Tiger Reserve. Visit Theppakadu Elephant Camp to watch majestic Asian elephants.",
    hasAr3d: false,
    locationCoords: { lat: 11.5623, lng: 76.5345 },
    nearby: {
      restaurants: ["Forest Canteen Theppakadu", "Bamboo Banks Restaurant"],
      hotels: ["Jungle Hut Masinagudi", "Wild Planet Resort"],
      hospitals: ["Gudalur Govt Hospital (Ph: 04262-261225)"],
      police: "Masinagudi Police Station (Ph: 100 / 04262-226222)"
    }
  },

  // 📸 HIDDEN GEMS & LESSER-KNOWN PLACES
  {
    id: "pichavaram-mangrove",
    name: "Pichavaram Mangrove Forest",
    nameTa: "பிச்சாவரம் அலையாத்தி காடுகள்",
    nameHi: "पिछावरम मैंग्रोव वन",
    country: "India",
    state: "Tamil Nadu",
    city: "Cuddalore",
    district: "Cuddalore",
    category: "hiddengems",
    rating: 4.8,
    reviewsCount: 6500,
    isFeatured: true,
    unescoStatus: false,
    builtBy: "Natural Mangrove Estuary Ecosystem",
    builtYear: "Ancient",
    architecture: "World's 2nd Largest Mangrove Channel Forest",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "The world's second-largest mangrove forest spanning 1,100 hectares with over 4,400 intricate water channels. Famous for wooden rowboat tours under green tree canopies.",
    descriptionTa: "உலகின் 2வது பெரிய அலையாத்தி காடு. 4,400 க்கும் மேற்பட்ட சிறிய நீர்வழிகள் மற்றும் படகு சவாரி கொண்டது.",
    history: "Protected ecosystem featuring Avicennia and Rhizophora trees whose intertwined roots buffer coastal storms.",
    openingTime: "08:00 AM",
    closingTime: "05:00 PM",
    specialTimings: "Row boating 09:00 AM - 04:30 PM",
    closureInfo: "Boating closed during high tide storm warnings",
    crowdLevel: "Low",
    crowdDataType: "Estimated",
    crowdNote: "Estimated crowd. Generally quiet on weekdays.",
    peakHours: "10:30 AM - 01:30 PM",
    suggestedVisitTime: "08:30 AM - 10:30 AM (Cool weather & birdwatching)",
    tickets: {
      adult: 10,
      child: 5,
      foreigner: 50,
      rowBoat4Seater: 400,
      motorBoat8Seater: 1800,
      isFree: false,
      bookingWebsite: null,
      bookingStatusText: "Online booking unavailable — check at venue (TTDC Boat House)"
    },
    bestTime: "November to February",
    bestSeason: "Migratory Bird Season (Nov - Feb)",
    howToReach: {
      air: "Puducherry Airport (PNY) - 65 km & Trichy (TRZ) - 150 km",
      rail: "Chidambaram Railway Station (CDM) - 14 km",
      road: "Direct buses from Chidambaram (14 km) and Cuddalore (45 km)"
    },
    audioGuideText: "Duck down as your wooden boat slips beneath dense mangrove tree arches.",
    hasAr3d: false,
    locationCoords: { lat: 11.4276, lng: 79.7915 },
    nearby: {
      restaurants: ["Chidambaram New Palace Hotel", "TTDC Pichavaram Canteen"],
      hotels: ["Arul Mount Resort Pichavaram", "Hotel Saradharam Chidambaram"],
      hospitals: ["Rajah Muthiah Medical College Hospital Chidambaram (Ph: 04144-238000)"],
      police: "Killai Police Station (Ph: 100 / 04144-247222)"
    }
  }
];

export const EMERGENCY_CONTACTS = {
  helpline: "1800-425-31111 (Tamil Nadu Tourism Toll-Free)",
  police: "100",
  ambulance: "108",
  womenHelpline: "1091",
  touristPolice: "044-25305000",
  hospitals: [
    { city: "Chennai", name: "Rajiv Gandhi Govt General Hospital", phone: "044-25305000" },
    { city: "Madurai", name: "GRH Government Rajaji Hospital", phone: "0452-2532535" },
    { city: "Coimbatore", name: "PSG Hospitals", phone: "0422-2570170" },
    { city: "Thanjavur", name: "Thanjavur Medical College Hospital", phone: "04362-240011" },
    { city: "Ooty", name: "Government District Hospital Ooty", phone: "0423-2442212" }
  ]
};
