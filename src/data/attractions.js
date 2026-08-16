// src/data/attractions.js
// Structured destinations & attractions dataset with sample booking information.

export const DESTINATIONS = [
  {
    id: "paris",
    name: "Paris",
    country: "France",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop",
    attractionsCount: 5,
    description: "The City of Light, world-famous for art, gastronomy, fashion, and iconic historical monuments."
  },
  {
    id: "rome",
    name: "Rome",
    country: "Italy",
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1200&auto=format&fit=crop",
    attractionsCount: 5,
    description: "The Eternal City, steeped in nearly three millennia of globally influential art and architecture."
  },
  {
    id: "agra",
    name: "Agra",
    country: "India",
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200&auto=format&fit=crop",
    attractionsCount: 4,
    description: "Home of the majestic Taj Mahal and historic red sandstone Mughal fortresses along the Yamuna river."
  },
  {
    id: "new-york",
    name: "New York",
    country: "USA",
    imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1200&auto=format&fit=crop",
    attractionsCount: 4,
    description: "The Big Apple, featuring world-renowned landmarks, museums, green parks, and soaring skyscrapers."
  },
  {
    id: "cairo",
    name: "Cairo & Giza",
    country: "Egypt",
    imageUrl: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=1200&auto=format&fit=crop",
    attractionsCount: 4,
    description: "Gateway to the ancient Pyramids of Giza, the Great Sphinx, and millennia of Pharaonic history."
  },
  {
    id: "beijing",
    name: "Beijing",
    country: "China",
    imageUrl: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=1200&auto=format&fit=crop",
    attractionsCount: 3,
    description: "China's imperial capital, home to the Great Wall, Forbidden City, and centuries of ancient heritage."
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "UAE",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop",
    attractionsCount: 3,
    description: "A futuristic metropolis known for ultra-modern architecture, luxury shopping, and desert heritage."
  },
  {
    id: "sydney",
    name: "Sydney",
    country: "Australia",
    imageUrl: "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?q=80&w=1200&auto=format&fit=crop",
    attractionsCount: 3,
    description: "Australia's harbour city, famous for its Opera House, iconic bridges, and pristine coastline."
  },
  {
    id: "jaipur",
    name: "Jaipur",
    country: "India",
    imageUrl: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?q=80&w=1200&auto=format&fit=crop",
    attractionsCount: 3,
    description: "The Pink City of Rajasthan, famous for royal palaces, hilltop forts, and vibrant heritage markets."
  }
];

export const ATTRACTIONS = [
  // PARIS
  {
    id: "eiffel-tower-attr",
    monumentId: "eiffel-tower",
    city: "Paris",
    country: "France",
    name: "Eiffel Tower",
    imageUrl: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=1200&auto=format&fit=crop",
    description: "The iconic wrought-iron lattice tower offering panoramic views of Paris from three observation levels.",
    rating: 4.8,
    openingHours: "09:15 AM - 10:45 PM",
    duration: "2 - 3 Hours",
    price: 25,
    currency: "$",
    ticketTypes: [
      { id: "standard", name: "Standard Summit Access", price: 25 },
      { id: "skip", name: "Fast-Track Priority Access", price: 45 },
      { id: "child", name: "Child / Youth (4-11 yrs)", price: 15 }
    ]
  },
  {
    id: "louvre-museum",
    monumentId: null,
    city: "Paris",
    country: "France",
    name: "Louvre Museum",
    imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1200&auto=format&fit=crop",
    description: "The world's largest art museum, home to the Mona Lisa, Venus de Milo, and over 35,000 historic masterworks.",
    rating: 4.9,
    openingHours: "09:00 AM - 06:00 PM (Closed Tue)",
    duration: "3 - 4 Hours",
    price: 22,
    currency: "$",
    ticketTypes: [
      { id: "standard", name: "Timed Entry Ticket", price: 22 },
      { id: "guided", name: "Guided Masterpiece Tour", price: 55 },
      { id: "youth", name: "Youth Access (Under 18)", price: 0 }
    ]
  },
  {
    id: "arc-de-triomphe",
    monumentId: null,
    city: "Paris",
    country: "France",
    name: "Arc de Triomphe",
    imageUrl: "https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?q=80&w=1200&auto=format&fit=crop",
    description: "Triumphal arch honouring those who fought for France, featuring a rooftop terrace over the Champs-Élysées.",
    rating: 4.7,
    openingHours: "10:00 AM - 10:30 PM",
    duration: "1 - 2 Hours",
    price: 16,
    currency: "$",
    ticketTypes: [
      { id: "standard", name: "Rooftop Access Ticket", price: 16 },
      { id: "combined", name: "Arc + River Cruise Pass", price: 32 }
    ]
  },
  {
    id: "notre-dame",
    monumentId: null,
    city: "Paris",
    country: "France",
    name: "Notre-Dame Cathedral",
    imageUrl: "https://images.unsplash.com/photo-1478358161113-b0e11994a36b?q=80&w=1200&auto=format&fit=crop",
    description: "French Gothic cathedral masterpiece situated on the Île de la Cité, famous for its gargoyles and rose windows.",
    rating: 4.8,
    openingHours: "08:00 AM - 06:45 PM",
    duration: "1 - 2 Hours",
    price: 14,
    currency: "$",
    ticketTypes: [
      { id: "standard", name: "Crypt & Treasury Pass", price: 14 },
      { id: "tour", name: "Historic Parvis Walking Tour", price: 28 }
    ]
  },
  {
    id: "versailles",
    monumentId: null,
    city: "Paris",
    country: "France",
    name: "Palace of Versailles",
    imageUrl: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=1200&auto=format&fit=crop",
    description: "Opulent royal residence of French kings, featuring the Hall of Mirrors and magnificent geometric gardens.",
    rating: 4.8,
    openingHours: "09:00 AM - 05:30 PM (Closed Mon)",
    duration: "4 - 5 Hours",
    price: 24,
    currency: "$",
    ticketTypes: [
      { id: "passport", name: "Full Passport Access", price: 24 },
      { id: "fountain", name: "Passport + Musical Gardens", price: 32 }
    ]
  },

  // ROME
  {
    id: "colosseum-attr",
    monumentId: "colosseum",
    city: "Rome",
    country: "Italy",
    name: "Colosseum",
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1200&auto=format&fit=crop",
    description: "The world's largest ancient amphitheatre, arena of ancient gladiators and Imperial Roman spectacles.",
    rating: 4.8,
    openingHours: "08:30 AM - 07:15 PM",
    duration: "2 - 3 Hours",
    price: 18,
    currency: "$",
    ticketTypes: [
      { id: "standard", name: "Colosseum, Forum & Palatine", price: 18 },
      { id: "arena", name: "Full Arena Floor Access", price: 28 },
      { id: "underground", name: "Underground Dungeons Tour", price: 42 }
    ]
  },
  {
    id: "pantheon-rome",
    monumentId: null,
    city: "Rome",
    country: "Italy",
    name: "The Pantheon",
    imageUrl: "https://images.unsplash.com/photo-1542820229-081e0c12af0b?q=80&w=1200&auto=format&fit=crop",
    description: "Best-preserved Roman temple turned church, featuring the world's largest unreinforced concrete dome.",
    rating: 4.8,
    openingHours: "09:00 AM - 07:00 PM",
    duration: "1 Hour",
    price: 5,
    currency: "$",
    ticketTypes: [
      { id: "standard", name: "Entry Ticket", price: 5 },
      { id: "audio", name: "Entry + Official Audio Guide", price: 12 }
    ]
  },
  {
    id: "trevi-fountain",
    monumentId: null,
    city: "Rome",
    country: "Italy",
    name: "Trevi Fountain",
    imageUrl: "https://images.unsplash.com/photo-1525874684015-5837e4437750?q=80&w=1200&auto=format&fit=crop",
    description: "Baroque masterwork fountain carved against Palazzo Poli, famous for coin-tossing traditions to ensure a return to Rome.",
    rating: 4.8,
    openingHours: "24 Hours Open",
    duration: "45 Mins",
    price: 0,
    currency: "$",
    ticketTypes: [
      { id: "free", name: "Public Viewing (Free)", price: 0 },
      { id: "underground", name: "Underground Aqueduct Tour", price: 15 }
    ]
  },
  {
    id: "roman-forum",
    monumentId: null,
    city: "Rome",
    country: "Italy",
    name: "Roman Forum",
    imageUrl: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?q=80&w=1200&auto=format&fit=crop",
    description: "The rectangular plaza surrounded by ruins of ancient government buildings at the heart of the Roman Empire.",
    rating: 4.7,
    openingHours: "09:00 AM - 07:00 PM",
    duration: "2 - 3 Hours",
    price: 18,
    currency: "$",
    ticketTypes: [
      { id: "standard", name: "Forum & Palatine Hill Pass", price: 18 },
      { id: "guided", name: "Archaeologist Guided Tour", price: 38 }
    ]
  },
  {
    id: "vatican-museums",
    monumentId: null,
    city: "Rome",
    country: "Italy",
    name: "Vatican Museums & Sistine Chapel",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop",
    description: "World-renowned papacy collection featuring Michelangelo's Sistine Chapel ceiling and Raphael Rooms.",
    rating: 4.9,
    openingHours: "08:00 AM - 07:00 PM (Closed Sun)",
    duration: "3 - 4 Hours",
    price: 25,
    currency: "$",
    ticketTypes: [
      { id: "standard", name: "Skip-the-Line Museum Pass", price: 25 },
      { id: "early", name: "Early Access Quiet Tour", price: 65 }
    ]
  },

  // AGRA
  {
    id: "taj-mahal-attr",
    monumentId: "taj-mahal",
    city: "Agra",
    country: "India",
    name: "Taj Mahal",
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200&auto=format&fit=crop",
    description: "An immense mausoleum of white marble on the Yamuna riverbank, commissioned by Mughal Emperor Shah Jahan.",
    rating: 4.9,
    openingHours: "06:00 AM - 06:30 PM (Closed Fri)",
    duration: "2 - 3 Hours",
    price: 50,
    currency: "₹",
    ticketTypes: [
      { id: "standard", name: "Indian Citizen Entry", price: 50 },
      { id: "foreign", name: "Foreign Tourist Entry", price: 1100 },
      { id: "mausoleum", name: "Main Mausoleum Add-on", price: 200 }
    ]
  },
  {
    id: "agra-fort",
    monumentId: null,
    city: "Agra",
    country: "India",
    name: "Agra Fort",
    imageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1200&auto=format&fit=crop",
    description: "Massive 16th-century red sandstone fortress that served as the principal residence of the Mughal emperors.",
    rating: 4.7,
    openingHours: "06:00 AM - 06:00 PM",
    duration: "2 Hours",
    price: 35,
    currency: "₹",
    ticketTypes: [
      { id: "standard", name: "Indian Citizen Ticket", price: 35 },
      { id: "foreign", name: "Foreign Tourist Ticket", price: 550 }
    ]
  },
  {
    id: "mehtab-bagh",
    monumentId: null,
    city: "Agra",
    country: "India",
    name: "Mehtab Bagh",
    imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200&auto=format&fit=crop",
    description: "Charbagh garden complex opposite the Taj Mahal across the Yamuna River, perfect for sunset views.",
    rating: 4.6,
    openingHours: "06:00 AM - 06:00 PM",
    duration: "1 Hour",
    price: 25,
    currency: "₹",
    ticketTypes: [
      { id: "standard", name: "Garden Entry Ticket", price: 25 },
      { id: "foreign", name: "Foreign Tourist Entry", price: 300 }
    ]
  },
  {
    id: "itmad-ud-daulah",
    monumentId: null,
    city: "Agra",
    country: "India",
    name: "Tomb of I'timād-ud-Daulah (Baby Taj)",
    imageUrl: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=1200&auto=format&fit=crop",
    description: "Mughal mausoleum often described as a 'jewel box', draft precursor to the Taj Mahal.",
    rating: 4.6,
    openingHours: "06:00 AM - 06:00 PM",
    duration: "1 Hour",
    price: 30,
    currency: "₹",
    ticketTypes: [
      { id: "standard", name: "Entry Ticket", price: 30 },
      { id: "foreign", name: "Foreign Tourist Ticket", price: 310 }
    ]
  },

  // NEW YORK
  {
    id: "statue-liberty-attr",
    monumentId: "statue-of-liberty",
    city: "New York",
    country: "USA",
    name: "Statue of Liberty & Ellis Island",
    imageUrl: "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?q=80&w=1200&auto=format&fit=crop",
    description: "Colossal neoclassical statue on Liberty Island paired with historic Ellis Island immigration museum.",
    rating: 4.8,
    openingHours: "08:30 AM - 04:00 PM",
    duration: "3 - 4 Hours",
    price: 24,
    currency: "$",
    ticketTypes: [
      { id: "ferry", name: "Ferry + Pedestal Access", price: 24 },
      { id: "crown", name: "Ferry + Crown Reserve", price: 27 },
      { id: "child", name: "Child Ticket (4-12 yrs)", price: 12 }
    ]
  },
  {
    id: "empire-state-building",
    monumentId: null,
    city: "New York",
    country: "USA",
    name: "Empire State Building",
    imageUrl: "https://images.unsplash.com/photo-1546436836-07a91091f160?q=80&w=1200&auto=format&fit=crop",
    description: "Famous 102-storey Art Deco skyscraper with open-air observation decks overlooking Midtown Manhattan.",
    rating: 4.8,
    openingHours: "09:00 AM - 12:00 AM",
    duration: "2 Hours",
    price: 44,
    currency: "$",
    ticketTypes: [
      { id: "deck86", name: "86th Floor Main Deck", price: 44 },
      { id: "deck102", name: "86th + 102nd Top Deck", price: 79 },
      { id: "express", name: "Express Fast Pass", price: 85 }
    ]
  },
  {
    id: "central-park",
    monumentId: null,
    city: "New York",
    country: "USA",
    name: "Central Park",
    imageUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1200&auto=format&fit=crop",
    description: "Urban park spanning 843 acres between Upper West Side and Upper East Side of Manhattan.",
    rating: 4.9,
    openingHours: "06:00 AM - 01:00 AM",
    duration: "2 - 3 Hours",
    price: 0,
    currency: "$",
    ticketTypes: [
      { id: "free", name: "Park Access (Free)", price: 0 },
      { id: "bike", name: "2-Hour Bike Rental Pass", price: 15 }
    ]
  },
  {
    id: "911-memorial",
    monumentId: null,
    city: "New York",
    country: "USA",
    name: "9/11 Memorial & Museum",
    imageUrl: "https://images.unsplash.com/photo-1583265489725-d729352e6907?q=80&w=1200&auto=format&fit=crop",
    description: "Memorial pools and museum honoring victims of the 2001 & 1993 World Trade Center attacks.",
    rating: 4.8,
    openingHours: "09:00 AM - 07:00 PM",
    duration: "2 Hours",
    price: 33,
    currency: "$",
    ticketTypes: [
      { id: "museum", name: "Museum General Admission", price: 33 },
      { id: "tour", name: "Guided 60-Min Tour", price: 48 }
    ]
  },

  // CAIRO / GIZA
  {
    id: "pyramids-giza-attr",
    monumentId: "pyramids-of-giza",
    city: "Cairo & Giza",
    country: "Egypt",
    name: "Pyramids of Giza & Great Sphinx",
    imageUrl: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=1200&auto=format&fit=crop",
    description: "The Great Pyramid of Khufu, Khafre, Menkaure, and the monolithic limestone Sphinx statue.",
    rating: 4.9,
    openingHours: "08:00 AM - 05:00 PM",
    duration: "3 - 4 Hours",
    price: 20,
    currency: "$",
    ticketTypes: [
      { id: "plateau", name: "Giza Plateau Entry", price: 20 },
      { id: "inside", name: "Great Pyramid Interior Entry", price: 35 },
      { id: "camel", name: "Plateau + Camel Safari Pass", price: 45 }
    ]
  },
  {
    id: "egyptian-museum",
    monumentId: null,
    city: "Cairo & Giza",
    country: "Egypt",
    name: "Grand Egyptian Museum",
    imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop",
    description: "World's largest archaeological museum dedicated to a single civilization, housing Tutankhamun treasures.",
    rating: 4.9,
    openingHours: "09:00 AM - 05:00 PM",
    duration: "3 Hours",
    price: 25,
    currency: "$",
    ticketTypes: [
      { id: "standard", name: "Main Galleries Ticket", price: 25 },
      { id: "kingtut", name: "King Tutankhamun Full Hall", price: 40 }
    ]
  },
  {
    id: "khan-el-khalili",
    monumentId: null,
    city: "Cairo & Giza",
    country: "Egypt",
    name: "Khan el-Khalili Bazaar",
    imageUrl: "https://images.unsplash.com/photo-1572252821128-090757d54e4c?q=80&w=1200&auto=format&fit=crop",
    description: "Historic market district in Islamic Cairo packed with brassware, spices, lamps, and traditional cafes.",
    rating: 4.7,
    openingHours: "09:30 AM - 11:00 PM",
    duration: "2 Hours",
    price: 0,
    currency: "$",
    ticketTypes: [
      { id: "free", name: "Bazaar Access (Free)", price: 0 },
      { id: "foodtour", name: "Guided Street Food Walk", price: 30 }
    ]
  },

  // BEIJING
  {
    id: "great-wall-attr",
    monumentId: "great-wall-of-china",
    city: "Beijing",
    country: "China",
    name: "Great Wall (Mutianyu Section)",
    imageUrl: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=1200&auto=format&fit=crop",
    description: "Best-preserved section of the Great Wall featuring cable cars, watchtowers, and toboggan rides.",
    rating: 4.9,
    openingHours: "07:30 AM - 05:30 PM",
    duration: "4 - 5 Hours",
    price: 15,
    currency: "$",
    ticketTypes: [
      { id: "entry", name: "Wall Entrance Ticket", price: 15 },
      { id: "cable", name: "Wall Entry + Cable Car Roundtrip", price: 35 }
    ]
  },
  {
    id: "forbidden-city",
    monumentId: null,
    city: "Beijing",
    country: "China",
    name: "Forbidden City (Palace Museum)",
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200&auto=format&fit=crop",
    description: "Imperial palace complex housing 980 surviving wooden structures built across Ming and Qing dynasties.",
    rating: 4.8,
    openingHours: "08:30 AM - 05:00 PM (Closed Mon)",
    duration: "3 - 4 Hours",
    price: 12,
    currency: "$",
    ticketTypes: [
      { id: "standard", name: "Main Palace Museum Pass", price: 12 },
      { id: "treasure", name: "Treasure Gallery Add-on", price: 18 }
    ]
  },

  // DUBAI
  {
    id: "burj-khalifa-attr",
    monumentId: "burj-khalifa",
    city: "Dubai",
    country: "UAE",
    name: "Burj Khalifa Observation Deck",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop",
    description: "Observe Dubai from Levels 124, 125, and 148 of the world's tallest building.",
    rating: 4.8,
    openingHours: "08:30 AM - 11:00 PM",
    duration: "2 Hours",
    price: 45,
    currency: "$",
    ticketTypes: [
      { id: "deck124", name: "At The Top (Levels 124+125)", price: 45 },
      { id: "prime", name: "Sunset Hours Access (124+125)", price: 65 },
      { id: "deck148", name: "At The Top SKY (Level 148)", price: 140 }
    ]
  },
  {
    id: "museum-of-future",
    monumentId: null,
    city: "Dubai",
    country: "UAE",
    name: "Museum of the Future",
    imageUrl: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?q=80&w=1200&auto=format&fit=crop",
    description: "Futuristic torus-shaped museum featuring Arabic calligraphy, immersive space, and AI innovation exhibits.",
    rating: 4.8,
    openingHours: "10:00 AM - 07:30 PM",
    duration: "2 - 3 Hours",
    price: 40,
    currency: "$",
    ticketTypes: [
      { id: "entry", name: "Timed Entry Ticket", price: 40 },
      { id: "pioneer", name: "Pioneer Priority Pass", price: 95 }
    ]
  },

  // SYDNEY
  {
    id: "sydney-opera-attr",
    monumentId: "sydney-opera-house",
    city: "Sydney",
    country: "Australia",
    name: "Sydney Opera House Guided Tour",
    imageUrl: "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?q=80&w=1200&auto=format&fit=crop",
    description: "Explore the concert halls and learn about Jørn Utzon's architectural vision.",
    rating: 4.8,
    openingHours: "09:00 AM - 05:00 PM",
    duration: "1 Hour",
    price: 42,
    currency: "$",
    ticketTypes: [
      { id: "standard", name: "1-Hour Backstage Architectural Tour", price: 42 },
      { id: "show", name: "Live Concert Performance Ticket", price: 95 }
    ]
  },

  // JAIPUR
  {
    id: "hawa-mahal-attr",
    monumentId: "hawa-mahal",
    city: "Jaipur",
    country: "India",
    name: "Hawa Mahal & City Palace",
    imageUrl: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?q=80&w=1200&auto=format&fit=crop",
    description: "The Palace of Breeze and Jaipur City Palace royal courtyard museums.",
    rating: 4.7,
    openingHours: "09:00 AM - 05:00 PM",
    duration: "2 Hours",
    price: 50,
    currency: "₹",
    ticketTypes: [
      { id: "hawamahal", name: "Hawa Mahal Entry Ticket", price: 50 },
      { id: "citypalace", name: "City Palace Composite Pass", price: 300 }
    ]
  }
];

export function getAttractionsByCity(cityName) {
  if (!cityName || cityName === 'All') return ATTRACTIONS;
  const q = cityName.toLowerCase();
  return ATTRACTIONS.filter(a => 
    a.city.toLowerCase().includes(q) || 
    q.includes(a.city.toLowerCase())
  );
}
