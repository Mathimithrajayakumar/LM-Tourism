// src/components/BookingModal.js
import { ATTRACTIONS } from '../data/attractions.js';
import { MONUMENTS }   from '../data/monuments.js';
import { TourismApiService } from '../services/tourismApi.js';
import { StorageService } from '../services/storage.js';
import { t }              from '../services/i18n.js';

let bookingState = {
  step: 1, // 1: Ticket Details, 2: Tourist Details, 3: Summary, 4: Mock Payment Gateway, 5: Confirmation
  targetId: null,
  
  // Step 1: Ticket Details
  visitDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  ticketTypeId: 'standard',
  entryTime: '10:00 AM - 11:00 AM',
  adultsCount: 1,
  childrenCount: 0,

  // Step 2: Tourist Details
  fullName: '',
  email: '',
  mobile: '',
  country: 'USA',
  dob: '',
  gender: 'Prefer not to say',
  idType: 'Passport',
  idNumber: '',
  additionalVisitors: '',
  childAges: '',
  preferredLanguage: 'English',
  specialRequirements: '',
  
  // Step 4: Mock Payment Gateway Details
  paymentMethod: 'upi', // 'upi' | 'card'
  upiId: '',
  cardName: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',

  // Validation & Payment States
  errors: {},
  paymentErrors: {},
  isProcessingPayment: false,
  paymentStatusMsg: null, // { type: 'error'|'success'|'cancel', text: string }

  // Confirmed booking object
  confirmedBooking: null
};

export function setBookingTarget(targetId) {
  const attr = ATTRACTIONS.find(a => a.id === targetId || a.monumentId === targetId);
  const mon  = MONUMENTS.find(m => m.id === targetId);

  const defaultType = attr && attr.ticketTypes && attr.ticketTypes.length > 0
    ? attr.ticketTypes[0].id
    : 'standard';

  const user = window.__appState?.currentUser || StorageService.getUser();

  bookingState = {
    step: 1,
    targetId: targetId,
    visitDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    ticketTypeId: defaultType,
    entryTime: '10:00 AM - 11:00 AM',
    adultsCount: 1,
    childrenCount: 0,

    fullName: user?.name || user?.displayName || '',
    email: user?.email || '',
    mobile: user?.phone || '',
    country: 'USA',
    dob: '',
    gender: 'Prefer not to say',
    idType: 'Passport',
    idNumber: '',
    additionalVisitors: '',
    childAges: '',
    preferredLanguage: 'English',
    specialRequirements: '',

    paymentMethod: 'upi',
    upiId: 'tourist@okaxis',
    cardName: user?.name || user?.displayName || 'Eleanor Vance',
    cardNumber: '4532 8901 2345 6789',
    cardExpiry: '12/28',
    cardCvv: '888',

    errors: {},
    paymentErrors: {},
    isProcessingPayment: false,
    paymentStatusMsg: null,
    confirmedBooking: null
  };
}

export function resetBookingState() {
  bookingState = {
    step: 1,
    targetId: null,
    visitDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    ticketTypeId: 'standard',
    entryTime: '10:00 AM - 11:00 AM',
    adultsCount: 1,
    childrenCount: 0,
    fullName: '',
    email: '',
    mobile: '',
    country: 'USA',
    dob: '',
    gender: 'Prefer not to say',
    idType: 'Passport',
    idNumber: '',
    additionalVisitors: '',
    childAges: '',
    preferredLanguage: 'English',
    specialRequirements: '',

    paymentMethod: 'upi',
    upiId: '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',

    errors: {},
    paymentErrors: {},
    isProcessingPayment: false,
    paymentStatusMsg: null,
    confirmedBooking: null
  };
}

export function updateBookingField(field, value) {
  bookingState[field] = value;
  if (bookingState.errors && bookingState.errors[field]) {
    delete bookingState.errors[field];
  }
}

export function updateBookingFieldSilent(field, value) {
  bookingState[field] = value;
  if (bookingState.errors && bookingState.errors[field]) {
    delete bookingState.errors[field];
  }
}

export function updatePaymentField(field, value) {
  bookingState[field] = value;
  if (bookingState.paymentErrors && bookingState.paymentErrors[field]) {
    delete bookingState.paymentErrors[field];
  }
}

export function setPaymentMethod(method) {
  bookingState.paymentMethod = method;
  bookingState.paymentErrors = {};
}

export function fillSampleUpi(sampleId) {
  bookingState.upiId = sampleId;
  if (bookingState.paymentErrors.upiId) {
    delete bookingState.paymentErrors.upiId;
  }
}

export function adjustAdults(delta) {
  const next = bookingState.adultsCount + delta;
  if (next >= 1 && next <= 10) {
    bookingState.adultsCount = next;
  }
}

export function adjustChildren(delta) {
  const next = bookingState.childrenCount + delta;
  if (next >= 0 && next <= 10) {
    bookingState.childrenCount = next;
  }
}

export function goToBookingStep(stepNum) {
  bookingState.step = stepNum;
}

export function validateTouristDetails() {
  const errors = {};
  if (!bookingState.fullName || !bookingState.fullName.trim()) {
    errors.fullName = 'Full Name is required';
  }
  if (!bookingState.email || !bookingState.email.trim() || !bookingState.email.includes('@')) {
    errors.email = 'Valid Email Address is required';
  }
  if (!bookingState.mobile || !bookingState.mobile.trim()) {
    errors.mobile = 'Mobile Phone Number is required';
  }
  if (!bookingState.country || !bookingState.country.trim()) {
    errors.country = 'Country / Nationality is required';
  }
  if (!bookingState.idNumber || !bookingState.idNumber.trim()) {
    errors.idNumber = 'Government ID / Passport Number is required';
  }

  bookingState.errors = errors;
  if (Object.keys(errors).length === 0) {
    bookingState.step = 3; // Go to Summary
    return true;
  }
  return false;
}

export function retryPayment() {
  bookingState.paymentStatusMsg = null;
  bookingState.isProcessingPayment = false;
}

// ─── MOCK PAYMENT GATEWAY PROCESSOR ──────────────────────────────────────────
export function processMockPayment(itemData) {
  bookingState.paymentErrors = {};
  bookingState.paymentStatusMsg = null;

  const errors = {};

  if (bookingState.paymentMethod === 'upi') {
    const upi = (bookingState.upiId || '').trim();
    if (!upi) {
      errors.upiId = 'UPI ID is required.';
    } else if (!upi.includes('@') || upi.length < 5) {
      errors.upiId = 'Please enter a valid UPI ID (e.g. name@upi or number@paytm).';
    }
  } else if (bookingState.paymentMethod === 'card') {
    const name = (bookingState.cardName || '').trim();
    const num = (bookingState.cardNumber || '').replace(/\s+/g, '');
    const exp = (bookingState.cardExpiry || '').trim();
    const cvv = (bookingState.cardCvv || '').trim();

    if (!name) {
      errors.cardName = 'Cardholder Name is required.';
    }
    if (!num || num.length < 12 || !/^\d+$/.test(num)) {
      errors.cardNumber = 'Enter a valid 12–16 digit Card Number.';
    }
    if (!exp || !/^\d{2}\/\d{2}$/.test(exp)) {
      errors.cardExpiry = 'Format MM/YY required.';
    }
    if (!cvv || cvv.length < 3 || !/^\d+$/.test(cvv)) {
      errors.cardCvv = '3–4 digit CVV required.';
    }
  }

  if (Object.keys(errors).length > 0) {
    bookingState.paymentErrors = errors;
    if (window.renderApp) window.renderApp();
    return;
  }

  // Simulate Payment Processing for 1.5 seconds
  bookingState.isProcessingPayment = true;
  if (window.renderApp) window.renderApp();

  setTimeout(() => {
    bookingState.isProcessingPayment = false;

    // Check if user entered failure test string
    if (bookingState.upiId.toLowerCase().includes('fail') || bookingState.cardNumber.includes('0000')) {
      bookingState.paymentStatusMsg = {
        type: 'error',
        text: '❌ Payment Failed: Transaction was declined by bank or UPI server. Please try again with valid details.'
      };
      if (window.renderApp) window.renderApp();
      return;
    }

    // Payment Successful!
    const bookingId = `LM-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const paymentId = `MOCK-PAY-${Math.floor(10000000 + Math.random() * 90000000)}`;

    bookingState.confirmedBooking = {
      bookingId: bookingId,
      name: itemData.name,
      city: itemData.city,
      country: itemData.country,
      imageUrl: itemData.imageUrl,
      visitDate: bookingState.visitDate,
      entryTime: bookingState.entryTime,
      ticketTypeName: itemData.selectedTicketType.name,
      adultsCount: bookingState.adultsCount,
      childrenCount: bookingState.childrenCount,
      totalVisitors: bookingState.adultsCount + bookingState.childrenCount,
      touristName: bookingState.fullName,
      touristEmail: bookingState.email,
      touristMobile: bookingState.mobile,
      touristCountry: bookingState.country,
      idType: bookingState.idType,
      idNumber: bookingState.idNumber,
      unitPrice: itemData.selectedTicketType.price,
      totalPrice: itemData.totalPrice,
      currency: itemData.currency || '$',
      paymentMethod: bookingState.paymentMethod === 'upi' ? `UPI (${bookingState.upiId})` : `Credit/Debit Card (**** ${bookingState.cardNumber.replace(/\s+/g, '').slice(-4) || '4242'})`,
      paymentId: paymentId,
      paymentStatus: 'PAID & CONFIRMED',
      bookedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    bookingState.step = 5; // Step 5: Confirmed E-Ticket Pass
    if (window.renderApp) window.renderApp();
  }, 1500);
}

// Backward compatibility alias for Razorpay call
export const startRazorpayPayment = processMockPayment;

export function renderBookingModal(targetId) {
  const attr = ATTRACTIONS.find(a => a.id === targetId || a.monumentId === targetId);
  let mon    = MONUMENTS.find(m => m.id === targetId);

  if (!mon && !attr) {
    const p = TourismApiService.getPlaceById(targetId);
    if (p) {
      mon = {
        id: p.id,
        name: p.name,
        city: p.city,
        state: p.district || p.state || 'Tamil Nadu',
        imageUrl: p.imageUrl,
        rating: p.rating || 4.8,
        entryFee: p.tickets?.adult || 0
      };
    }
  }

  if (!attr && !mon) return '';

  const name         = attr ? attr.name : mon.name;
  const city         = attr ? attr.city : mon.city;
  const country      = attr ? attr.country : (mon.state || 'Global');
  const imageUrl     = attr ? attr.imageUrl : mon.imageUrl;
  const rating       = attr ? attr.rating : mon.rating;
  const currency     = attr ? attr.currency : '$';

  const ticketTypes  = attr?.ticketTypes || [
    { id: 'standard', name: 'General Admission', price: mon?.entryFee || 25 },
    { id: 'skip', name: 'Fast-Track Priority Access', price: (mon?.entryFee || 25) + 20 }
  ];

  const selectedTicketType = ticketTypes.find(t => t.id === bookingState.ticketTypeId) || ticketTypes[0];
  const adultPrice = selectedTicketType.price;
  const childPrice = Math.round(adultPrice * 0.6); // 40% discount for children
  const totalPrice = (adultPrice * bookingState.adultsCount) + (childPrice * bookingState.childrenCount);

  const todayStr = new Date().toISOString().split('T')[0];

  const itemData = {
    name, city, country, imageUrl, currency, selectedTicketType, totalPrice
  };

  const timeSlots = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '01:00 PM - 02:00 PM',
    '03:00 PM - 04:00 PM',
    '04:30 PM - 05:30 PM'
  ];

  // ── STEP 5: BOOKING CONFIRMED SCREEN ─────────────────────────────────────────
  if (bookingState.step === 5 && bookingState.confirmedBooking) {
    const cb = bookingState.confirmedBooking;
    return `
      <div class="modal-backdrop" onclick="if(event.target === this) window.closeModal();">
        <div class="modal-container" style="max-width: 560px; padding: 28px 24px; text-align: center;">
          <button class="modal-close-btn" onclick="window.closeModal()">
            <span class="material-symbols-rounded">close</span>
          </button>

          <div style="width: 68px; height: 68px; background: rgba(34, 197, 94, 0.15); color: #22c55e; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto;">
            <span class="material-symbols-rounded" style="font-size: 42px;">verified</span>
          </div>

          <span class="badge-unesco" style="background: #22c55e; color: white; padding: 4px 12px; font-size: 0.8rem;">🎉 Payment Successful</span>
          <h2 style="font-size: 1.4rem; margin: 8px 0 4px 0; color: var(--text-primary);">Your Official E-Ticket Pass</h2>
          <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 20px;">A receipt has been sent to <strong>${cb.touristEmail}</strong></p>

          <!-- Digital Ticket Card Pass -->
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); overflow: hidden; text-align: left; position: relative; box-shadow: var(--shadow-md); margin-bottom: 24px;">
            
            <div style="display: flex; gap: 14px; padding: 16px; background: rgba(37, 99, 235, 0.06); border-bottom: 1px dashed var(--border-subtle); align-items: center;">
              <img src="${cb.imageUrl}" alt="${cb.name}" style="width: 64px; height: 64px; border-radius: var(--radius-sm); object-fit: cover;" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200&auto=format&fit=crop';" />
              <div>
                <h3 style="font-size: 1.1rem; margin: 0 0 2px 0; color: var(--text-primary);">${cb.name}</h3>
                <p style="font-size: 0.825rem; color: var(--text-secondary); margin: 0;">📍 ${cb.city}, ${cb.country}</p>
                <div style="font-size: 0.75rem; color: var(--color-primary); font-weight: 700; margin-top: 4px;">Booking ID: ${cb.bookingId}</div>
              </div>
            </div>

            <div style="padding: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 0.85rem;">
              <div>
                <span style="color: var(--text-muted); display: block; font-size: 0.75rem; font-weight: 600;">TOURIST NAME</span>
                <strong style="color: var(--text-primary);">${cb.touristName}</strong>
              </div>
              <div>
                <span style="color: var(--text-muted); display: block; font-size: 0.75rem; font-weight: 600;">GOVT ID / PASSPORT</span>
                <strong style="color: var(--text-primary);">${cb.idType}: ${cb.idNumber}</strong>
              </div>
              <div>
                <span style="color: var(--text-muted); display: block; font-size: 0.75rem; font-weight: 600;">VISIT DATE &amp; TIME</span>
                <strong style="color: var(--text-primary);">${cb.visitDate} (${cb.entryTime})</strong>
              </div>
              <div>
                <span style="color: var(--text-muted); display: block; font-size: 0.75rem; font-weight: 600;">TICKET COUNT</span>
                <strong style="color: var(--text-primary);">${cb.totalVisitors} Visitor(s) (${cb.ticketTypeName})</strong>
              </div>
              <div>
                <span style="color: var(--text-muted); display: block; font-size: 0.75rem; font-weight: 600;">PAYMENT METHOD</span>
                <strong style="color: var(--color-primary); font-weight: 700;">${cb.paymentMethod}</strong>
              </div>
              <div>
                <span style="color: var(--text-muted); display: block; font-size: 0.75rem; font-weight: 600;">AMOUNT PAID</span>
                <strong style="color: #22c55e; font-size: 1.05rem;">${cb.currency}${cb.totalPrice}</strong>
              </div>
            </div>

            <div style="padding: 10px 16px; background: rgba(34, 197, 94, 0.08); border-top: 1px solid rgba(34, 197, 94, 0.2); font-size: 0.75rem; color: #15803d; display: flex; justify-content: space-between; align-items: center;">
              <span>Status: <strong>${cb.paymentStatus}</strong></span>
              <span style="font-family: monospace;">TXN: ${cb.paymentId}</span>
            </div>

            <!-- QR Code Placeholder -->
            <div style="background: var(--bg-primary); padding: 14px 16px; border-top: 1px dashed var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">VALID ON DATE OF VISIT ONLY</div>
                <div style="font-family: monospace; font-size: 0.8rem; letter-spacing: 2px; color: var(--text-secondary); margin-top: 2px;">${cb.bookingId}-PASS</div>
              </div>
              <div style="background: white; padding: 6px 10px; border-radius: 6px; display: flex; align-items: center; gap: 4px; border: 1px solid var(--border-subtle);">
                <span class="material-symbols-rounded" style="color: #000; font-size: 40px;">qr_code_2</span>
              </div>
            </div>

          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 12px;">
            <button 
              class="chip" 
              style="flex: 1; padding: 12px; justify-content: center; font-size: 0.95rem; background: var(--bg-secondary); border: 1px solid var(--border-subtle);"
              onclick="alert('E-Ticket downloaded successfully!');"
            >
              <span class="material-symbols-rounded" style="font-size: 18px;">download</span>
              Download Ticket
            </button>
            <button 
              class="chip active" 
              style="flex: 1; padding: 12px; justify-content: center; font-size: 0.95rem;"
              onclick="window.closeModal()"
            >
              Done &amp; Close
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ── PROGRESS STEP INDICATOR HEADER ──────────────────────────────────────────
  const stepTitles = {
    1: 'Step 1: Select Ticket & Date',
    2: 'Step 2: Tourist Information',
    3: 'Step 3: Review Booking Summary',
    4: 'Step 4: Mock Payment Gateway'
  };

  return `
    <div class="modal-backdrop" onclick="if(event.target === this) window.closeModal();">
      <div class="modal-container" style="max-width: 580px; padding: 24px;">
        <!-- Close Button -->
        <button class="modal-close-btn" onclick="window.closeModal()">
          <span class="material-symbols-rounded">close</span>
        </button>

        <!-- Header Progress -->
        <div style="margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid var(--border-subtle);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--color-primary); text-transform: uppercase;">
              ${stepTitles[bookingState.step] || 'Booking'}
            </span>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">
              Step ${bookingState.step} of 4
            </span>
          </div>

          <!-- Progress Bar -->
          <div style="width: 100%; height: 6px; background: var(--bg-secondary); border-radius: 3px; overflow: hidden; display: flex;">
            <div style="width: ${bookingState.step * 25}%; height: 100%; background: linear-gradient(90deg, #2563eb, #3b82f6); transition: width 0.3s ease;"></div>
          </div>
        </div>

        <!-- Attraction Banner Summary -->
        <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 18px; background: var(--bg-secondary); padding: 10px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <img src="${imageUrl}" alt="${name}" style="width: 54px; height: 54px; border-radius: var(--radius-sm); object-fit: cover;" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200&auto=format&fit=crop';" />
          <div style="flex: 1; min-width: 0;">
            <h3 style="font-size: 1.05rem; margin: 0 0 2px 0; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${name}</h3>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">📍 ${city}, ${country} • ★ ${rating}</div>
          </div>
        </div>

        <!-- STEP 1: TICKET DETAILS -->
        ${bookingState.step === 1 ? `
          <div style="display: flex; flex-direction: column; gap: 16px;">
            
            <!-- Visit Date -->
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">
                🗓️ Select Visit Date *
              </label>
              <input 
                type="date" 
                value="${bookingState.visitDate}" 
                min="${todayStr}"
                onchange="window.updateBookingFieldSilent('visitDate', this.value)"
                style="width: 100%; padding: 10px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-secondary); color: var(--text-primary); font-size: 0.95rem;"
              />
            </div>

            <!-- Entry Time Slot -->
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">
                🕒 Preferred Entry Time Slot *
              </label>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                ${timeSlots.map(slot => `
                  <button 
                    type="button" 
                    class="chip ${bookingState.entryTime === slot ? 'active' : ''}" 
                    style="padding: 8px 10px; font-size: 0.8rem; justify-content: center; width: 100%;"
                    onclick="window.updateBookingField('entryTime', '${slot}')">
                    ${slot}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Ticket Options -->
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">
                🎫 Ticket Option *
              </label>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${ticketTypes.map(t => `
                  <div 
                    onclick="window.updateBookingField('ticketTypeId', '${t.id}')"
                    style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: var(--radius-md); border: 2px solid ${bookingState.ticketTypeId === t.id ? 'var(--color-primary)' : 'var(--border-subtle)'}; background: ${bookingState.ticketTypeId === t.id ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg-secondary)'}; cursor: pointer; transition: all 0.2s;"
                  >
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span class="material-symbols-rounded" style="color: ${bookingState.ticketTypeId === t.id ? 'var(--color-primary)' : 'var(--text-muted)'}; font-size: 20px;">
                        ${bookingState.ticketTypeId === t.id ? 'radio_button_checked' : 'radio_button_unchecked'}
                      </span>
                      <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary);">${t.name}</span>
                    </div>
                    <span style="font-weight: 700; color: var(--color-primary);">${currency}${t.price}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Adult / Child Quantity Selector -->
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">
                👥 Select Visitors
              </label>
              
              <!-- Adults -->
              <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-secondary); border: 1px solid var(--border-subtle); padding: 8px 14px; border-radius: var(--radius-md); margin-bottom: 8px;">
                <div>
                  <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary); display: block;">Adults (13+ yrs)</span>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">${currency}${adultPrice} per ticket</span>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <button type="button" onclick="window.adjustAdults(-1)" style="width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--border-subtle); background: var(--bg-primary); color: var(--text-primary); font-weight: 700; cursor: pointer;">-</button>
                  <span style="font-weight: 700; font-size: 1rem; min-width: 20px; text-align: center; color: var(--text-primary);">${bookingState.adultsCount}</span>
                  <button type="button" onclick="window.adjustAdults(1)" style="width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--border-subtle); background: var(--bg-primary); color: var(--text-primary); font-weight: 700; cursor: pointer;">+</button>
                </div>
              </div>

              <!-- Children -->
              <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-secondary); border: 1px solid var(--border-subtle); padding: 8px 14px; border-radius: var(--radius-md);">
                <div>
                  <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary); display: block;">Children (4–12 yrs)</span>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">${currency}${childPrice} per ticket (40% Off)</span>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <button type="button" onclick="window.adjustChildren(-1)" style="width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--border-subtle); background: var(--bg-primary); color: var(--text-primary); font-weight: 700; cursor: pointer;">-</button>
                  <span style="font-weight: 700; font-size: 1rem; min-width: 20px; text-align: center; color: var(--text-primary);">${bookingState.childrenCount}</span>
                  <button type="button" onclick="window.adjustChildren(1)" style="width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--border-subtle); background: var(--bg-primary); color: var(--text-primary); font-weight: 700; cursor: pointer;">+</button>
                </div>
              </div>
            </div>

            <!-- Price Summary -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: rgba(37,99,235,0.06); border: 1px solid rgba(37,99,235,0.2); border-radius: var(--radius-md);">
              <div>
                <span style="font-size: 0.8rem; color: var(--text-muted); display: block;">Total Amount</span>
                <span style="font-size: 0.85rem; color: var(--text-secondary);">${bookingState.adultsCount + bookingState.childrenCount} Visitor(s)</span>
              </div>
              <div style="font-size: 1.3rem; font-weight: 800; color: #22c55e;">
                ${currency}${totalPrice}
              </div>
            </div>

            <!-- Submit Step 1 -->
            <button 
              type="button" 
              class="chip active" 
              style="width: 100%; padding: 12px; justify-content: center; font-size: 1rem; font-weight: 700;"
              onclick="window.goToBookingStep(2)"
            >
              Continue to Visitor Details →
            </button>
          </div>
        ` : ''}

        <!-- STEP 2: TOURIST DETAILS -->
        ${bookingState.step === 2 ? `
          <form onsubmit="event.preventDefault(); window.validateAndGoToSummary();" style="display: flex; flex-direction: column; gap: 14px;">
            
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 2px;">
              Please enter official details matching your passport or government ID. (* Required)
            </div>

            <!-- Full Name -->
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                Full Name (Primary Tourist) *
              </label>
              <input 
                type="text" 
                placeholder="e.g. Eleanor Vance" 
                value="${bookingState.fullName}"
                oninput="window.updateBookingFieldSilent('fullName', this.value)"
                style="width: 100%; padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid ${bookingState.errors.fullName ? '#ef4444' : 'var(--border-subtle)'}; background: var(--bg-secondary); color: var(--text-primary); font-size: 0.9rem;"
              />
              ${bookingState.errors.fullName ? `<span style="color: #ef4444; font-size: 0.75rem;">${bookingState.errors.fullName}</span>` : ''}
            </div>

            <!-- Email & Phone Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                  Email Address *
                </label>
                <input 
                  type="email" 
                  placeholder="eleanor@example.com" 
                  value="${bookingState.email}"
                  oninput="window.updateBookingFieldSilent('email', this.value)"
                  style="width: 100%; padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid ${bookingState.errors.email ? '#ef4444' : 'var(--border-subtle)'}; background: var(--bg-secondary); color: var(--text-primary); font-size: 0.9rem;"
                />
                ${bookingState.errors.email ? `<span style="color: #ef4444; font-size: 0.75rem;">${bookingState.errors.email}</span>` : ''}
              </div>

              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                  Mobile Number *
                </label>
                <input 
                  type="tel" 
                  placeholder="+1 555-0199" 
                  value="${bookingState.mobile}"
                  oninput="window.updateBookingFieldSilent('mobile', this.value)"
                  style="width: 100%; padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid ${bookingState.errors.mobile ? '#ef4444' : 'var(--border-subtle)'}; background: var(--bg-secondary); color: var(--text-primary); font-size: 0.9rem;"
                />
                ${bookingState.errors.mobile ? `<span style="color: #ef4444; font-size: 0.75rem;">${bookingState.errors.mobile}</span>` : ''}
              </div>
            </div>

            <!-- Country & ID Type Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                  Country / Nationality *
                </label>
                <input 
                  type="text" 
                  placeholder="USA, India, France, etc." 
                  value="${bookingState.country}"
                  oninput="window.updateBookingFieldSilent('country', this.value)"
                  style="width: 100%; padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid ${bookingState.errors.country ? '#ef4444' : 'var(--border-subtle)'}; background: var(--bg-secondary); color: var(--text-primary); font-size: 0.9rem;"
                />
                ${bookingState.errors.country ? `<span style="color: #ef4444; font-size: 0.75rem;">${bookingState.errors.country}</span>` : ''}
              </div>

              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                  Govt ID Type
                </label>
                <select 
                  onchange="window.updateBookingFieldSilent('idType', this.value)"
                  style="width: 100%; padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-secondary); color: var(--text-primary); font-size: 0.9rem;"
                >
                  <option value="Passport" ${bookingState.idType === 'Passport' ? 'selected' : ''}>Passport</option>
                  <option value="Aadhaar Card" ${bookingState.idType === 'Aadhaar Card' ? 'selected' : ''}>Aadhaar Card</option>
                  <option value="Driving License" ${bookingState.idType === 'Driving License' ? 'selected' : ''}>Driving License</option>
                  <option value="National ID" ${bookingState.idType === 'National ID' ? 'selected' : ''}>National ID / Other</option>
                </select>
              </div>
            </div>

            <!-- ID Number & DOB Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                  ID / Passport Number *
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. A9824012" 
                  value="${bookingState.idNumber}"
                  oninput="window.updateBookingFieldSilent('idNumber', this.value)"
                  style="width: 100%; padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid ${bookingState.errors.idNumber ? '#ef4444' : 'var(--border-subtle)'}; background: var(--bg-secondary); color: var(--text-primary); font-size: 0.9rem;"
                />
                ${bookingState.errors.idNumber ? `<span style="color: #ef4444; font-size: 0.75rem;">${bookingState.errors.idNumber}</span>` : ''}
              </div>

              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                  Date of Birth
                </label>
                <input 
                  type="date" 
                  value="${bookingState.dob}"
                  onchange="window.updateBookingFieldSilent('dob', this.value)"
                  style="width: 100%; padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-secondary); color: var(--text-primary); font-size: 0.85rem;"
                />
              </div>
            </div>

            <!-- Additional Visitor Names -->
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                Co-Traveler Names &amp; Details (Optional)
              </label>
              <input 
                type="text" 
                placeholder="e.g. Mark Vance, Sarah Vance" 
                value="${bookingState.additionalVisitors}"
                oninput="window.updateBookingFieldSilent('additionalVisitors', this.value)"
                style="width: 100%; padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-secondary); color: var(--text-primary); font-size: 0.85rem;"
              />
            </div>

            ${bookingState.childrenCount > 0 ? `
              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                  Child Ages (${bookingState.childrenCount} child/children)
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Age 6, Age 9" 
                  value="${bookingState.childAges}"
                  oninput="window.updateBookingFieldSilent('childAges', this.value)"
                  style="width: 100%; padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-secondary); color: var(--text-primary); font-size: 0.85rem;"
                />
              </div>
            ` : ''}

            <!-- Special Req -->
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                Special Requirements &amp; Accessibility
              </label>
              <input 
                type="text" 
                placeholder="e.g. Wheelchair access required" 
                value="${bookingState.specialRequirements}"
                oninput="window.updateBookingFieldSilent('specialRequirements', this.value)"
                style="width: 100%; padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-secondary); color: var(--text-primary); font-size: 0.85rem;"
              />
            </div>

            <!-- Back / Review Buttons -->
            <div style="display: flex; gap: 10px; margin-top: 6px;">
              <button 
                type="button" 
                class="chip" 
                style="padding: 10px 16px; background: var(--bg-secondary); border: 1px solid var(--border-subtle);"
                onclick="window.goToBookingStep(1)"
              >
                ← Back
              </button>
              <button 
                type="submit" 
                class="chip active" 
                style="flex: 1; padding: 10px; justify-content: center; font-size: 0.95rem; font-weight: 700;"
              >
                Review Booking Summary →
              </button>
            </div>
          </form>
        ` : ''}

        <!-- STEP 3: BOOKING SUMMARY -->
        ${bookingState.step === 3 ? `
          <div style="display: flex; flex-direction: column; gap: 14px;">
            
            <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px; font-size: 0.875rem; display: flex; flex-direction: column; gap: 10px;">
              
              <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed var(--border-subtle); padding-bottom: 8px;">
                <span style="color: var(--text-muted);">Attraction</span>
                <strong style="color: var(--text-primary); text-align: right;">${name}</strong>
              </div>

              <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed var(--border-subtle); padding-bottom: 8px;">
                <span style="color: var(--text-muted);">Location</span>
                <strong style="color: var(--text-primary);">${city}, ${country}</strong>
              </div>

              <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed var(--border-subtle); padding-bottom: 8px;">
                <span style="color: var(--text-muted);">Visit Date &amp; Time</span>
                <strong style="color: var(--text-primary);">${bookingState.visitDate} (${bookingState.entryTime})</strong>
              </div>

              <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed var(--border-subtle); padding-bottom: 8px;">
                <span style="color: var(--text-muted);">Ticket Option</span>
                <strong style="color: var(--text-primary);">${selectedTicketType.name}</strong>
              </div>

              <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed var(--border-subtle); padding-bottom: 8px;">
                <span style="color: var(--text-muted);">Visitors Breakdown</span>
                <strong style="color: var(--text-primary);">${bookingState.adultsCount} Adult(s)${bookingState.childrenCount > 0 ? `, ${bookingState.childrenCount} Child(ren)` : ''}</strong>
              </div>

              <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed var(--border-subtle); padding-bottom: 8px;">
                <span style="color: var(--text-muted);">Lead Tourist</span>
                <strong style="color: var(--text-primary);">${bookingState.fullName} (${bookingState.country})</strong>
              </div>

              <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed var(--border-subtle); padding-bottom: 8px;">
                <span style="color: var(--text-muted);">ID / Passport</span>
                <strong style="color: var(--text-primary);">${bookingState.idType}: ${bookingState.idNumber}</strong>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
                <span style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary);">Total Amount</span>
                <strong style="font-size: 1.35rem; color: #22c55e;">${currency}${totalPrice}</strong>
              </div>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(37,99,235,0.06); padding: 10px 14px; border-radius: var(--radius-md); border: 1px solid rgba(37,99,235,0.15); font-size: 0.8rem; color: var(--text-secondary);">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="material-symbols-rounded" style="color: #2563eb;">lock</span>
                <span>Payment Gateway Ready</span>
              </div>
              <span style="font-weight: 700; color: #2563eb;">Instant E-Ticket Issuance</span>
            </div>

            <div style="display: flex; gap: 10px; margin-top: 4px;">
              <button 
                type="button" 
                class="chip" 
                style="padding: 10px 16px; background: var(--bg-secondary); border: 1px solid var(--border-subtle);"
                onclick="window.goToBookingStep(2)"
              >
                ← Edit Details
              </button>
              
              <button 
                type="button" 
                class="chip active" 
                style="flex: 1; padding: 14px; justify-content: center; font-size: 1rem; font-weight: 800; background: linear-gradient(135deg, #2563eb, #1d4ed8);"
                onclick="window.goToBookingStep(4)"
              >
                Proceed to Payment (${currency}${totalPrice}) →
              </button>
            </div>
          </div>
        ` : ''}

        <!-- STEP 4: MOCK PAYMENT GATEWAY SCREEN -->
        ${bookingState.step === 4 ? `
          <div style="display: flex; flex-direction: column; gap: 14px;">
            
            <div style="padding: 10px 14px; background: rgba(37,99,235,0.08); border: 1px solid rgba(37,99,235,0.2); border-radius: var(--radius-md); font-size: 0.8rem; color: var(--text-primary); display: flex; align-items: center; justify-content: space-between;">
              <span>💳 Mock Payment Gateway Active</span>
              <strong style="color: #22c55e; font-size: 1.05rem;">Total: ${currency}${totalPrice}</strong>
            </div>

            ${bookingState.paymentStatusMsg ? `
              <div style="padding: 12px 14px; border-radius: var(--radius-md); font-size: 0.85rem; background: rgba(239,68,68,0.1); border: 1px solid #ef4444; color: #dc2626; display: flex; flex-direction: column; gap: 8px;">
                <div>${bookingState.paymentStatusMsg.text}</div>
                <button type="button" class="chip" style="padding: 6px 12px; font-size: 0.75rem; align-self: flex-start; background: #ef4444; color: white; border: none;" onclick="window.retryPayment()">
                  Try Again
                </button>
              </div>
            ` : ''}

            <!-- Payment Method Selector Tabs -->
            <div style="display: flex; gap: 8px;">
              <button 
                type="button" 
                class="chip ${bookingState.paymentMethod === 'upi' ? 'active' : ''}" 
                style="flex: 1; padding: 10px; justify-content: center; font-size: 0.85rem; font-weight: 700;"
                onclick="window.setPaymentMethod('upi')"
              >
                📱 UPI ID (GPay / PhonePe / Paytm)
              </button>
              <button 
                type="button" 
                class="chip ${bookingState.paymentMethod === 'card' ? 'active' : ''}" 
                style="flex: 1; padding: 10px; justify-content: center; font-size: 0.85rem; font-weight: 700;"
                onclick="window.setPaymentMethod('card')"
              >
                💳 Credit / Debit Card
              </button>
            </div>

            <!-- UPI Payment Details -->
            ${bookingState.paymentMethod === 'upi' ? `
              <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px; display: flex; flex-direction: column; gap: 12px;">
                <div>
                  <label style="display: block; font-size: 0.825rem; font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">
                    Enter Virtual Payment Address / UPI ID *
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. tourist@okaxis or 9876543210@paytm" 
                    value="${bookingState.upiId}"
                    oninput="window.updatePaymentField('upiId', this.value)"
                    style="width: 100%; padding: 10px 14px; border-radius: var(--radius-md); border: 1px solid ${bookingState.paymentErrors.upiId ? '#ef4444' : 'var(--border-subtle)'}; background: var(--bg-primary); color: var(--text-primary); font-size: 0.95rem;"
                  />
                  ${bookingState.paymentErrors.upiId ? `
                    <span style="color: #ef4444; font-size: 0.75rem; display: block; margin-top: 4px;">${bookingState.paymentErrors.upiId}</span>
                  ` : ''}
                </div>

                <!-- Quick Autofill Test Chips -->
                <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
                  <span style="font-size: 0.75rem; color: var(--text-muted);">Quick fill:</span>
                  <button type="button" class="chip" style="font-size: 0.725rem; padding: 3px 8px;" onclick="window.fillSampleUpi('tourist@gpay')">tourist@gpay</button>
                  <button type="button" class="chip" style="font-size: 0.725rem; padding: 3px 8px;" onclick="window.fillSampleUpi('user@okaxis')">user@okaxis</button>
                  <button type="button" class="chip" style="font-size: 0.725rem; padding: 3px 8px;" onclick="window.fillSampleUpi('paytm@bhim')">paytm@bhim</button>
                  <button type="button" class="chip" style="font-size: 0.725rem; padding: 3px 8px; background: rgba(239,68,68,0.1); color: #dc2626; border-color: rgba(239,68,68,0.3);" onclick="window.fillSampleUpi('fail@test')">Simulate Fail</button>
                </div>
              </div>
            ` : ''}

            <!-- Card Payment Details -->
            ${bookingState.paymentMethod === 'card' ? `
              <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px; display: flex; flex-direction: column; gap: 12px;">
                
                <div>
                  <label style="display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                    Cardholder Name *
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Eleanor Vance" 
                    value="${bookingState.cardName}"
                    oninput="window.updatePaymentField('cardName', this.value)"
                    style="width: 100%; padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid ${bookingState.paymentErrors.cardName ? '#ef4444' : 'var(--border-subtle)'}; background: var(--bg-primary); color: var(--text-primary); font-size: 0.9rem;"
                  />
                  ${bookingState.paymentErrors.cardName ? `<span style="color: #ef4444; font-size: 0.75rem;">${bookingState.paymentErrors.cardName}</span>` : ''}
                </div>

                <div>
                  <label style="display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                    Card Number (12–16 digits) *
                  </label>
                  <input 
                    type="text" 
                    placeholder="4532 8901 2345 6789" 
                    value="${bookingState.cardNumber}"
                    oninput="window.updatePaymentField('cardNumber', this.value)"
                    style="width: 100%; padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid ${bookingState.paymentErrors.cardNumber ? '#ef4444' : 'var(--border-subtle)'}; background: var(--bg-primary); color: var(--text-primary); font-size: 0.9rem;"
                  />
                  ${bookingState.paymentErrors.cardNumber ? `<span style="color: #ef4444; font-size: 0.75rem;">${bookingState.paymentErrors.cardNumber}</span>` : ''}
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                  <div>
                    <label style="display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                      Expiry Date (MM/YY) *
                    </label>
                    <input 
                      type="text" 
                      placeholder="12/28" 
                      maxlength="5"
                      value="${bookingState.cardExpiry}"
                      oninput="window.updatePaymentField('cardExpiry', this.value)"
                      style="width: 100%; padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid ${bookingState.paymentErrors.cardExpiry ? '#ef4444' : 'var(--border-subtle)'}; background: var(--bg-primary); color: var(--text-primary); font-size: 0.9rem;"
                    />
                    ${bookingState.paymentErrors.cardExpiry ? `<span style="color: #ef4444; font-size: 0.75rem;">${bookingState.paymentErrors.cardExpiry}</span>` : ''}
                  </div>

                  <div>
                    <label style="display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                      CVV Code *
                    </label>
                    <input 
                      type="password" 
                      placeholder="888" 
                      maxlength="4"
                      value="${bookingState.cardCvv}"
                      oninput="window.updatePaymentField('cardCvv', this.value)"
                      style="width: 100%; padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid ${bookingState.paymentErrors.cardCvv ? '#ef4444' : 'var(--border-subtle)'}; background: var(--bg-primary); color: var(--text-primary); font-size: 0.9rem;"
                    />
                    ${bookingState.paymentErrors.cardCvv ? `<span style="color: #ef4444; font-size: 0.75rem;">${bookingState.paymentErrors.cardCvv}</span>` : ''}
                  </div>
                </div>

              </div>
            ` : ''}

            <!-- Action Buttons -->
            <div style="display: flex; gap: 10px; margin-top: 6px;">
              <button 
                type="button" 
                class="chip" 
                style="padding: 10px 16px; background: var(--bg-secondary); border: 1px solid var(--border-subtle);"
                onclick="window.goToBookingStep(3)"
                ${bookingState.isProcessingPayment ? 'disabled' : ''}
              >
                ← Back
              </button>
              
              <button 
                type="button" 
                class="chip active" 
                style="flex: 1; padding: 14px; justify-content: center; font-size: 1rem; font-weight: 800; background: linear-gradient(135deg, #22c55e, #16a34a);"
                onclick="window.processMockPayment(${JSON.stringify(itemData).replace(/"/g, '&quot;')})"
                ${bookingState.isProcessingPayment ? 'disabled' : ''}
              >
                ${bookingState.isProcessingPayment ? `
                  <span class="material-symbols-rounded" style="animation: spin 1s linear infinite; font-size: 20px;">sync</span>
                  Processing Payment...
                ` : `
                  🔒 Pay ${currency}${totalPrice} Now →
                `}
              </button>
            </div>

          </div>
        ` : ''}

      </div>
    </div>
  `;
}
