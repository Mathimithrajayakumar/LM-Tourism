// src/services/aiService.js
// Production-grade Conversational AI Tourism Assistant powered by Google Gemini & LM Knowledge Engine

import { TourismApiService } from './tourismApi.js';

let activeDestinationContext = null;
let currentChatMessages = [];
let isGeneratingResponse = false;
let currentAbortController = null;

// AI Engine Mode: 'auto' (tries Gemini then falls back to manual), 'gemini' (force Gemini), 'manual' (force Local Knowledge Base)
let currentAiEngineMode = 'auto';

export function getAiEngineMode() {
  return currentAiEngineMode;
}

export function setAiEngineMode(mode) {
  if (['auto', 'gemini', 'manual'].includes(mode)) {
    currentAiEngineMode = mode;
    if (window.renderApp) window.renderApp();
  }
}

// Initialize Session
function initSession() {
  if (currentChatMessages.length === 0) {
    resetChatSession();
  }
}

export function resetChatSession() {
  if (currentAbortController) {
    try { currentAbortController.abort(); } catch (e) {}
    currentAbortController = null;
  }
  isGeneratingResponse = false;
  
  const destName = activeDestinationContext ? activeDestinationContext.name : null;
  const initialText = destName
    ? `👋 Greetings! I am your AI Tourism Assistant for **${destName}** in ${activeDestinationContext.city}, ${activeDestinationContext.country}.\n\nAsk me anything about its history, builder, architectural style, visitor timings, crowd levels, ticket prices, or nearby places!`
    : `👋 Greetings! I am LM Tourism AI, your intelligent worldwide tourism assistant.\n\nAsk me anything about global heritage sites, travel planning, historical background, visitor timings, ticket pricing, or custom trip itineraries!`;

  currentChatMessages = [
    {
      id: 'init_msg_' + Date.now(),
      sender: 'ai',
      text: initialText,
      timestamp: Date.now(),
      liked: null,
      actionButtons: destName ? [
        { type: 'BOOK_TICKETS', label: '🎟️ Book Tickets', targetId: activeDestinationContext.id },
        { type: 'OPEN_MAP', label: '🗺️ Open Map', name: `${activeDestinationContext.name} ${activeDestinationContext.city}` }
      ] : []
    }
  ];

  if (window.renderApp) window.renderApp();
}

export function setActiveAiDestination(placeObj) {
  activeDestinationContext = placeObj ? TourismApiService.getPlaceById(placeObj.id) || placeObj : null;
}

export function getActiveAiDestination() {
  return activeDestinationContext;
}

export function clearActiveAiDestination() {
  activeDestinationContext = null;
}

export function getAiChatMessages() {
  initSession();
  return currentChatMessages;
}

export function isAiThinking() {
  return isGeneratingResponse;
}

export function stopAiGeneration() {
  if (currentAbortController) {
    try { currentAbortController.abort(); } catch (e) {}
    currentAbortController = null;
  }
  isGeneratingResponse = false;
  if (window.renderApp) window.renderApp();
}

/**
 * Check AI service health status from backend proxy
 */
export async function checkAiServiceHealth() {
  try {
    const res = await fetch('/api/chat/health');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[AI Health Check]: Backend proxy health check failed:', err);
  }
  return { status: 'offline', apiConfigured: false, mode: 'manual_knowledge_engine' };
}

/**
 * Parse Action tags embedded in response text by Gemini
 */
function parseActionButtons(rawText, dest) {
  const buttons = [];
  
  if (rawText.includes('[ACTION:BOOK_TICKETS') || rawText.toLowerCase().includes('book ticket')) {
    const targetId = dest ? dest.id : 'taj-mahal';
    buttons.push({ type: 'BOOK_TICKETS', label: '🎟️ Book Tickets', targetId });
  }

  if (rawText.includes('[ACTION:OPEN_MAP') || rawText.toLowerCase().includes('google map') || rawText.toLowerCase().includes('navigate')) {
    const name = dest ? `${dest.name} ${dest.city}` : 'Tourism Destination';
    buttons.push({ type: 'OPEN_MAP', label: '🗺️ Open Map', name });
  }

  if (rawText.includes('[ACTION:OPEN_DESTINATION') && dest) {
    buttons.push({ type: 'OPEN_DESTINATION', label: `📍 Open ${dest.name}`, targetId: dest.id });
  }

  if (rawText.includes('[ACTION:OPEN_PLANNER') || rawText.toLowerCase().includes('trip planner') || rawText.toLowerCase().includes('itinerary')) {
    buttons.push({ type: 'OPEN_PLANNER', label: '📅 Open Trip Planner' });
  }

  // Remove raw action tags from user-facing text
  const cleanText = rawText.replace(/\[ACTION:[^\]]+\]/g, '').trim();

  return { cleanText, buttons };
}

/**
 * Manual / Intelligent Knowledge-Base Tourism Assistant Engine
 * Offline fallback generator that answers user tourism queries using local database.
 */
export function generateManualTourismAnswer(userQuestion, customDestContext = null) {
  const query = (userQuestion || '').trim();
  const lower = query.toLowerCase();

  // Determine active target destination context
  let targetDest = customDestContext || activeDestinationContext;

  // Search for destination mentioned in text if not explicitly provided
  const allDestinations = TourismApiService.getAllDestinations();
  if (!targetDest) {
    targetDest = allDestinations.find(p => 
      lower.includes((p.name || '').toLowerCase()) ||
      (p.city && lower.includes(p.city.toLowerCase())) ||
      (p.id && lower.includes(p.id.toLowerCase()))
    );
  }

  // --- 1. IF DESTINATION IS KNOWN / MATCHED ---
  if (targetDest) {
    const name = targetDest.name;
    const city = targetDest.city || 'Heritage Hub';
    const state = targetDest.state || targetDest.country || '';
    const country = targetDest.country || 'India';
    const builder = targetDest.builtBy || targetDest.categoryDetails?.builtBy || 'Ancient Rulers & Artisans';
    const year = targetDest.builtYear || targetDest.year || targetDest.categoryDetails?.constructionEra || 'Historical Era';
    const arch = targetDest.architecture || targetDest.categoryDetails?.architecturalStyle || 'Classic Architectural Style';
    const open = targetDest.openingTime || '06:00 AM';
    const close = targetDest.closingTime || '08:00 PM';
    const days = targetDest.daysOpen || 'Open Daily';
    const closed = targetDest.closedDay || 'None';
    const peak = targetDest.peakHours || targetDest.avoidPeakTime || '11:00 AM - 02:00 PM';
    const lowCrowd = targetDest.lowCrowdHours || targetDest.bestVisitingTimeWindow || '06:00 AM - 08:30 AM';
    
    const adultPrice = targetDest.ticketInfo?.adult !== undefined ? targetDest.ticketInfo.adult : (targetDest.entryFee || 0);
    const childPrice = targetDest.ticketInfo?.child !== undefined ? targetDest.ticketInfo.child : Math.round(adultPrice * 0.5);
    const foreignerPrice = targetDest.ticketInfo?.foreigner !== undefined ? targetDest.ticketInfo.foreigner : (adultPrice > 0 ? adultPrice * 5 : 0);
    const isFree = adultPrice === 0 || targetDest.ticketInfo?.isFree;

    const historyText = targetDest.history || targetDest.culturalSignificance || targetDest.whyFamous || `An iconic landmark located in ${city}, ${state}.`;

    // Intent: History & Builder
    if (lower.includes('history') || lower.includes('built') || lower.includes('who') || lower.includes('builder') || lower.includes('architecture') || lower.includes('when')) {
      const text = `🏛️ **History & Origin of ${name}**\n\n` +
        `• **Location:** ${city}, ${state} (${country})\n` +
        `• **Built By:** ${builder}\n` +
        `• **Era / Year:** ${year}\n` +
        `• **Architectural Style:** ${arch}\n\n` +
        `📖 **Historical Background:**\n${historyText}\n\n` +
        `✨ **Key Highlights:**\n` +
        (targetDest.importantHighlights ? targetDest.importantHighlights.slice(0, 3).map(h => `• ${h}`).join('\n') : `• Remarkable architectural craftsmanship\n• Deep historical and cultural significance`);

      return {
        text,
        actionButtons: [
          { type: 'BOOK_TICKETS', label: '🎟️ Book Tickets', targetId: targetDest.id },
          { type: 'OPEN_MAP', label: '🗺️ Open Map', name: `${name} ${city}` },
          { type: 'OPEN_DESTINATION', label: `📍 Open Details`, targetId: targetDest.id }
        ]
      };
    }

    // Intent: Timings, Hours & Crowd
    if (lower.includes('timing') || lower.includes('open') || lower.includes('close') || lower.includes('hour') || lower.includes('time') || lower.includes('crowd') || lower.includes('best time')) {
      const text = `🕒 **Visitor Timings & Crowd Guide for ${name}**\n\n` +
        `• **Opening Hours:** ${open} – ${close}\n` +
        `• **Days Open:** ${days} (Closed: ${closed})\n` +
        `• **Recommended Visit Duration:** ${targetDest.recommendedDuration || '2 - 3 Hours'}\n\n` +
        `⚡ **Crowd & Best Visiting Window:**\n` +
        `• **Best Low-Crowd Hours:** 🌅 ${lowCrowd}\n` +
        `• **Peak Hours to Avoid:** ☀️ ${peak}\n` +
        `• **Estimated Crowd Level:** ${targetDest.crowdLevel || 'Medium'}\n\n` +
        `💡 **Visitor Tip:** Arrive during early morning hours to skip queue lines and get optimal lighting for photography.`;

      return {
        text,
        actionButtons: [
          { type: 'BOOK_TICKETS', label: '🎟️ Book Tickets', targetId: targetDest.id },
          { type: 'OPEN_MAP', label: '🗺️ Open Map', name: `${name} ${city}` }
        ]
      };
    }

    // Intent: Tickets & Entry Fees
    if (lower.includes('ticket') || lower.includes('fee') || lower.includes('price') || lower.includes('cost') || lower.includes('entry') || lower.includes('pay') || lower.includes('free')) {
      const text = `🎟️ **Official Ticket Pricing Matrix for ${name}**\n\n` +
        (isFree ? `🎉 **FREE ENTRY!** Visitors can enter without purchasing tickets.\n\n` : `• **Adult Entry:** ₹${adultPrice}\n• **Child Entry:** ₹${childPrice}\n• **Foreign Tourist Entry:** ₹${foreignerPrice}\n• **Student / Senior Discount:** Available with valid ID\n\n`) +
        `• **Camera / Photography Fee:** ${targetDest.ticketInfo?.camera ? `₹${targetDest.ticketInfo.camera}` : 'Included / Standard Rules'}\n` +
        `• **Booking Method:** Online instant reservation available via LM Tourism app.\n\n` +
        `📍 **Opening Hours:** ${open} - ${close} (${days})`;

      return {
        text,
        actionButtons: [
          { type: 'BOOK_TICKETS', label: '🎟️ Book Tickets Now', targetId: targetDest.id },
          { type: 'OPEN_MAP', label: '🗺️ Navigation Map', name: `${name} ${city}` }
        ]
      };
    }

    // Intent: Nearby attractions
    if (lower.includes('nearby') || lower.includes('around') || lower.includes('other') || lower.includes('attraction') || lower.includes('places')) {
      const nearbyPlaces = allDestinations.filter(p => p.id !== targetDest.id && (p.city === city || p.state === state)).slice(0, 3);
      const text = `📍 **Top Attractions Nearby ${name}**\n\n` +
        (nearbyPlaces.length > 0
          ? nearbyPlaces.map(p => `• **${p.name}** (${p.city}) – ${p.category || 'Historical Site'}. ${p.whyFamous || p.description || ''}`).join('\n\n')
          : `• **Explore ${city} Market & Local Heritage Walk** – Famous for local cuisine, handicrafts, and cultural strolls.`) +
        `\n\n💡 Ask me about any of these places for history, ticket prices, or timings!`;

      return {
        text,
        actionButtons: [
          { type: 'OPEN_MAP', label: '🗺️ View Nearby Map', name: `${city} Tourism` },
          { type: 'OPEN_PLANNER', label: '📅 Plan Day Tour' }
        ]
      };
    }

    // Default Overview for target destination
    const overview = `🏛️ **${name} (${city}, ${country}) Overview**\n\n` +
      `• **Category:** ${targetDest.category || 'Monuments & Heritage'}\n` +
      `• **Built By:** ${builder} (${year})\n` +
      `• **Timings:** ${open} – ${close} (${days})\n` +
      `• **Entry Ticket:** ${isFree ? 'Free Entry' : `Adults: ₹${adultPrice} | Foreigners: ₹${foreignerPrice}`}\n` +
      `• **Best Time Window:** 🌅 ${lowCrowd}\n\n` +
      `📖 **About:**\n${historyText}\n\n` +
      `💡 Ask me specific questions like *"Who built ${name}?"*, *"What are the ticket prices?"*, or *"Plan a trip nearby"*!`;

    return {
      text: overview,
      actionButtons: [
        { type: 'BOOK_TICKETS', label: '🎟️ Book Tickets', targetId: targetDest.id },
        { type: 'OPEN_MAP', label: '🗺️ Open Map', name: `${name} ${city}` },
        { type: 'OPEN_PLANNER', label: '📅 Plan Trip' }
      ]
    };
  }

  // --- 2. NO SPECIFIC DESTINATION MATCHED ---

  // Intent: Trip Planner / Itinerary / Plan a trip
  if (lower.includes('plan') || lower.includes('itinerary') || lower.includes('trip') || lower.includes('tour') || lower.includes('day') || lower.includes('budget')) {
    const plan = generatePersonalizedTripPlan({ days: 3, budget: 15000, country: 'India', region: 'Tamil Nadu' });
    const text = `🗺️ **Customized Heritage Trip Itinerary (${plan.numDays} Days)**\n\n` +
      `• **Target Region:** ${plan.region}\n` +
      `• **Total Estimated Expense:** ${plan.currencySymbol}${plan.totalEstimatedCost.toLocaleString()}\n` +
      `• **Travel Style:** ${plan.style} (${plan.companion})\n\n` +
      plan.itinerary.map(day => 
        `📅 **${day.title}** (Est: ${day.currencySymbol}${day.estimatedDayExpense})\n` +
        day.schedule.map(s => `  • **${s.time}:** ${s.activity}`).join('\n')
      ).join('\n\n') +
      `\n\n💡 Use the interactive **Trip Planner** tab for custom budget filters and instant route optimization!`;

    return {
      text,
      actionButtons: [
        { type: 'OPEN_PLANNER', label: '📅 Open Interactive Trip Planner' }
      ]
    };
  }

  // Intent: Top Monuments / Heritage / Best Places
  if (lower.includes('top') || lower.includes('best') || lower.includes('famous') || lower.includes('unesco') || lower.includes('monument') || lower.includes('place')) {
    const topPlaces = allDestinations.slice(0, 4);
    const text = `🌟 **Top Recommended World Heritage Destinations**\n\n` +
      topPlaces.map(p => 
        `🏛️ **${p.name}** (${p.city}, ${p.country || 'India'})\n` +
        `  • Built by: ${p.builtBy || 'Heritage Era'} (${p.builtYear || p.year || 'Historical'})\n` +
        `  • Entry Fee: ${p.ticketInfo?.adult ? `₹${p.ticketInfo.adult}` : 'Free Entry'} | Timings: ${p.openingTime || '06:00 AM'} - ${p.closingTime || '08:00 PM'}\n` +
        `  • Highlight: ${p.whyFamous || p.description || ''}`
      ).join('\n\n') +
      `\n\n💡 Click on any place or ask me details about any monument!`;

    return {
      text,
      actionButtons: [
        { type: 'OPEN_PLANNER', label: '📅 Trip Planner' }
      ]
    };
  }

  // Intent: Greeting / Help / Intro
  if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey') || lower.includes('who are you') || lower.includes('help') || lower.includes('what can you do')) {
    const text = `👋 **Hello! I am your LM Tourism AI & Knowledge Base Assistant.**\n\n` +
      `I can help you with comprehensive tourism, history, monument details, visitor timings, crowd levels, ticket prices, and travel trip itineraries worldwide!\n\n` +
      `📌 **Try asking me questions like:**\n` +
      `• *"Tell me the history of Taj Mahal"* or *"Who built Brihadisvara Temple?"*\n` +
      `• *"What are the opening hours and best time to visit Eiffel Tower?"*\n` +
      `• *"How much are entry ticket prices for Meenakshi Temple?"*\n` +
      `• *"Plan a 3-day budget itinerary in Tamil Nadu"*`;

    return {
      text,
      actionButtons: [
        { type: 'OPEN_PLANNER', label: '📅 Open Trip Planner' }
      ]
    };
  }

  // Fallback General Response
  const generalText = `🌍 **LM Tourism Knowledge Base Assistant**\n\n` +
    `I understand you are asking about: *"${query}"*\n\n` +
    `Here are popular ways I can assist you right now:\n` +
    `• 🏛️ **Monument History & Builders:** Ask about builder, construction era, or architectural style.\n` +
    `• 🕒 **Timings & Low Crowd Windows:** Ask about opening hours, open days, or peak hours to avoid.\n` +
    `• 🎟️ **Tickets & Pricing:** Get entry prices for adults, children, and international tourists.\n` +
    `• 📅 **Custom Trip Planning:** Request multi-day itineraries for any budget or family trip.\n\n` +
    `💡 *Tip: Mention a monument name like "Taj Mahal", "Brihadisvara", "Eiffel Tower" or "Colosseum" for instant detailed facts!*`;

  return {
    text: generalText,
    actionButtons: [
      { type: 'OPEN_PLANNER', label: '📅 Open Trip Planner' }
    ]
  };
}

/**
 * Send Chat Message to Google Gemini via Backend Proxy (with Automatic Local Knowledge Fallback)
 */
export async function sendChatMessageToAi(userQuestion, customDestContext = null) {
  const q = (userQuestion || '').trim();
  if (!q || isGeneratingResponse) return;

  const destContext = customDestContext || activeDestinationContext;

  // Add User Message
  currentChatMessages.push({
    id: 'usr_' + Date.now(),
    sender: 'user',
    text: q,
    timestamp: Date.now()
  });

  isGeneratingResponse = true;
  if (window.renderApp) window.renderApp();

  currentAbortController = new AbortController();

  // Helper for applying local manual fallback answer
  const applyManualFallback = (noticePrefix = '') => {
    const manualResult = generateManualTourismAnswer(q, destContext);
    const textWithNotice = noticePrefix ? `${noticePrefix}\n\n${manualResult.text}` : manualResult.text;
    
    currentChatMessages.push({
      id: 'ai_' + Date.now(),
      sender: 'ai',
      text: textWithNotice,
      timestamp: Date.now(),
      liked: null,
      actionButtons: manualResult.actionButtons || []
    });
    isGeneratingResponse = false;
    currentAbortController = null;
    if (window.renderApp) window.renderApp();
  };

  // If user selected Manual Mode, skip network call and execute local knowledge assistant immediately
  if (currentAiEngineMode === 'manual') {
    setTimeout(() => {
      applyManualFallback();
    }, 300);
    return;
  }

  // Prepare multi-turn history for Gemini (last 8 messages)
  const history = currentChatMessages
    .filter(m => m.sender === 'user' || m.sender === 'ai')
    .slice(-8)
    .map(m => ({ sender: m.sender, text: m.text }));

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: currentAbortController.signal,
      body: JSON.stringify({
        message: q,
        history: history.slice(0, -1), // omit current prompt which is sent separately
        destinationContext: destContext || null
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.text) {
        const { cleanText, buttons } = parseActionButtons(data.text, destContext);
        currentChatMessages.push({
          id: 'ai_' + Date.now(),
          sender: 'ai',
          text: cleanText,
          timestamp: Date.now(),
          liked: null,
          actionButtons: buttons
        });
        isGeneratingResponse = false;
        currentAbortController = null;
        if (window.renderApp) window.renderApp();
        return;
      }
    }

    const errData = await res.json().catch(() => ({}));
    console.warn('[Gemini API Proxy Warning]: API returned status', res.status, errData);

    // If Gemini fails or API key is unconfigured/invalid, gracefully execute Knowledge Base Fallback
    const notice = res.status === 429
      ? `⚡ *[Rate Limit Exceeded — Answered via LM Knowledge Assistant]*`
      : `⚡ *[Google Gemini API Offline/Unconfigured — Answered via LM Knowledge Assistant]*`;

    applyManualFallback(notice);

  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('[AI Generation Aborted by User]');
      currentChatMessages.push({
        id: 'stopped_' + Date.now(),
        sender: 'ai',
        text: '⏹️ *[Generation stopped by user]*',
        timestamp: Date.now()
      });
      isGeneratingResponse = false;
      currentAbortController = null;
      if (window.renderApp) window.renderApp();
    } else {
      console.warn('[AI Network Warning — Executing Local Fallback Engine]:', err);
      applyManualFallback(`⚡ *[Network Offline — Answered via LM Knowledge Assistant]*`);
    }
  }
}


/**
 * Regenerate the last AI response
 */
export async function regenerateLastAiMessage() {
  if (isGeneratingResponse || currentChatMessages.length === 0) return;

  // Find last user message
  let lastUserIdx = -1;
  for (let i = currentChatMessages.length - 1; i >= 0; i--) {
    if (currentChatMessages[i].sender === 'user') {
      lastUserIdx = i;
      break;
    }
  }

  if (lastUserIdx === -1) return;

  const lastUserPrompt = currentChatMessages[lastUserIdx].text;
  // Remove messages after last user prompt
  currentChatMessages = currentChatMessages.slice(0, lastUserIdx);

  await sendChatMessageToAi(lastUserPrompt);
}

/**
 * Toggle Thumbs Up / Down feedback
 */
export function toggleAiMessageFeedback(msgId, isLiked) {
  const msg = currentChatMessages.find(m => m.id === msgId);
  if (msg) {
    msg.liked = msg.liked === isLiked ? null : isLiked;
    if (window.renderApp) window.renderApp();
  }
}

/**
 * Backward compatible fetchAiGuideResponse function wrapper
 */
export async function fetchAiGuideResponse(monumentOrPlace, userQuestion, chatHistory = []) {
  setActiveAiDestination(monumentOrPlace);
  await sendChatMessageToAi(userQuestion, monumentOrPlace);
  const lastMsg = currentChatMessages[currentChatMessages.length - 1];
  return lastMsg ? lastMsg.text : "Gemini couldn't respond right now. Please try again.";
}

/**
 * Generate AI Trip Planner Day-by-Day Itinerary based on user inputs with Route Optimization
 */
export function generatePersonalizedTripPlan({ days = 2, budget = 5000, country = 'India', region = 'Tamil Nadu', startCity = 'Chennai', interests = [], companion = 'Family', style = 'Moderate' }) {
  // Allow up to 14 days
  const numDays = Math.min(Math.max(parseInt(days) || 2, 1), 14);
  const targetBudget = parseFloat(budget) || 5000;

  // Exact Currency Symbols per Country
  const CURRENCY_SYMBOLS = {
    'India': '₹',
    'USA': '$',
    'UK': '£',
    'France': '€',
    'Italy': '€',
    'Spain': '€',
    'Germany': '€',
    'Greece': '€',
    'Netherlands': '€',
    'Europe': '€',
    'Japan': '¥',
    'China': '¥',
    'UAE': 'AED ',
    'Egypt': 'E£ ',
    'Australia': 'A$',
    'Canada': 'C$',
    'Singapore': 'S$'
  };

  const currencySymbol = CURRENCY_SYMBOLS[country] || (country === 'India' ? '₹' : '$');

  const allDestinations = TourismApiService.getAllDestinations();

  // Strict Country & Region Filter
  const cTarget = country.toLowerCase().trim();
  const rTarget = (region || 'All').toLowerCase().trim();

  // 1. Filter by Country
  let countryMatched = allDestinations.filter(p => {
    const pCountry = (p.country || 'India').toLowerCase();
    return pCountry.includes(cTarget) || cTarget.includes(pCountry);
  });

  if (countryMatched.length === 0) {
    countryMatched = allDestinations;
  }

  // 2. Filter by Region/State/City if specified
  let matched = countryMatched;
  if (rTarget !== 'all' && !rTarget.includes('all') && rTarget !== cTarget) {
    const regionMatched = countryMatched.filter(p => {
      const pState = (p.state || '').toLowerCase();
      const pCity  = (p.city  || '').toLowerCase();
      return pState.includes(rTarget) || pCity.includes(rTarget) || rTarget.includes(pState) || rTarget.includes(pCity);
    });
    if (regionMatched.length > 0) {
      matched = regionMatched;
    }
  }

  // 3. Filter / Prioritize by Selected User Interests
  if (interests.length > 0) {
    const interestKeywords = interests.map(i => i.toLowerCase());
    
    const interestMatched = matched.filter(p => {
      const pCat   = (p.category || '').toLowerCase();
      const pTags  = (p.tags || []).map(t => t.toLowerCase());
      const pTypes = (p.suitableTravellerTypes || []).map(t => t.toLowerCase());

      return interestKeywords.some(ik => {
        if (ik.includes('heritage') || ik.includes('fort')) {
          return pCat.includes('monument') || pCat.includes('heritage') || pCat.includes('fort') || pCat.includes('palace') || pCat.includes('castle') || pTypes.some(t => t.includes('history') || t.includes('architecture'));
        }
        if (ik.includes('temple') || ik.includes('shrine') || ik.includes('spiritual')) {
          return pCat.includes('temple') || pCat.includes('spiritual') || pCat.includes('shrine') || pCat.includes('church') || pCat.includes('mosque');
        }
        if (ik.includes('beach') || ik.includes('coastal')) {
          return pCat.includes('beach') || pCat.includes('coastal') || pCat.includes('sea') || pCat.includes('island');
        }
        if (ik.includes('mountain') || ik.includes('hill') || ik.includes('nature')) {
          return pCat.includes('hill') || pCat.includes('mountain') || pCat.includes('nature') || pCat.includes('waterfall') || pCat.includes('wildlife');
        }
        if (ik.includes('museum') || ik.includes('art')) {
          return pCat.includes('museum') || pCat.includes('art') || pCat.includes('gallery') || pCat.includes('culture');
        }
        if (ik.includes('food') || ik.includes('cuisine')) {
          return pCat.includes('food') || pCat.includes('cuisine') || pCat.includes('dining') || pTypes.some(t => t.includes('food'));
        }
        if (ik.includes('photography') || ik.includes('hidden') || ik.includes('gem')) {
          return pCat.includes('viewpoint') || pCat.includes('hidden') || pTypes.some(t => t.includes('photography'));
        }
        return pCat.includes(ik) || pTags.some(t => t.includes(ik)) || pTypes.some(t => t.includes(ik));
      });
    });

    if (interestMatched.length > 0) {
      const nonMatched = matched.filter(p => !interestMatched.includes(p));
      matched = interestMatched.concat(nonMatched);
    }
  }

  // Sort by geographic proximity
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const firstDest = matched[0];
  const baseLat = firstDest?.locationCoords?.lat || 13.0827;
  const baseLng = firstDest?.locationCoords?.lng || 80.2707;

  matched.sort((a, b) => {
    const distA = a.locationCoords ? calculateDistance(baseLat, baseLng, a.locationCoords.lat, a.locationCoords.lng) : 999;
    const distB = b.locationCoords ? calculateDistance(baseLat, baseLng, b.locationCoords.lat, b.locationCoords.lng) : 999;
    return distA - distB;
  });

  let totalEstimatedCost = 0;
  const isHighCostCurrency = ['$', '€', '£', 'A$', 'C$', 'S$', 'AED '].includes(currencySymbol);
  const foodPerDay = (style === 'Budget') 
    ? (isHighCostCurrency ? 30 : 400) 
    : (style === 'Luxury') 
    ? (isHighCostCurrency ? 150 : 1500) 
    : (isHighCostCurrency ? 60 : 700);

  const itinerary = Array.from({ length: numDays }, (_, i) => {
    const dayNum = i + 1;
    const idx1 = (i * 2) % matched.length;
    const idx2 = ((i * 2) + 1) % matched.length;
    const p1 = matched[idx1] || matched[0];
    const p2 = matched[idx2] || matched[Math.min(1, matched.length - 1)];

    const p1Cost = p1.ticketInfo?.adult !== undefined ? p1.ticketInfo.adult : (p1.entryFee || 0);
    const p2Cost = p2.ticketInfo?.adult !== undefined ? p2.ticketInfo.adult : (p2.entryFee || 0);
    const dayExpense = p1Cost + p2Cost + foodPerDay;

    totalEstimatedCost += dayExpense;

    return {
      day: dayNum,
      title: dayNum === 1 
        ? `Day 1: Key Landmarks & Highlights in ${p1.city || p1.name}` 
        : `Day ${dayNum}: Sightseeing & Culture in ${p2.city || p2.name}`,
      estimatedDayExpense: dayExpense,
      currencySymbol,
      schedule: [
        {
          time: '08:30 AM – 11:30 AM',
          place: p1,
          activity: `Morning exploration of ${p1.name} during low crowd window (${p1.bestVisitingTimeWindow || '08:30 AM - 10:30 AM'}). Opening Hours: ${p1.openingTime || '08:00 AM'} - ${p1.closingTime || '06:00 PM'}.`,
          cost: p1Cost
        },
        {
          time: '12:30 PM – 02:00 PM',
          place: { name: `Authentic Local Dining in ${p1.city || p1.name}`, city: p1.city || startCity, id: p1.id },
          activity: `Savor popular regional culinary specialties near ${p1.name}.`,
          cost: foodPerDay
        },
        {
          time: '03:00 PM – 06:00 PM',
          place: p2,
          activity: `Afternoon visit to ${p2.name}. Discover historical heritage, scenic views, and architecture.`,
          cost: p2Cost
        },
        {
          time: '06:30 PM – 08:30 PM',
          place: { name: `Evening Promenade & Local Market Walk`, city: p2.city || startCity, id: p2.id },
          activity: `Sunset stroll, souvenir shopping, and evening cultural atmosphere in ${p2.city || p2.name}.`,
          cost: 0
        }
      ]
    };
  });

  return {
    numDays,
    country,
    region: region === 'All' ? country : region,
    startCity,
    companion,
    style,
    budget: targetBudget,
    currencySymbol,
    totalEstimatedCost,
    isWithinBudget: totalEstimatedCost <= targetBudget,
    itinerary
  };
}


