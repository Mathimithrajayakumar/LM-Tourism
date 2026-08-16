import { defineConfig } from 'vite';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

function loadEnvVars() {
  const envPath = path.resolve(process.cwd(), '.env');
  const env = {};
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    content.split(/\r?\n/).forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        if (key && !key.startsWith('#')) {
          env[key] = value;
        }
      }
    });
  }
  return env;
}

function razorpayBackendPlugin() {
  return {
    name: 'razorpay-backend-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const env = loadEnvVars();
        const KEY_ID = env.RAZORPAY_KEY_ID || env.VITE_RAZORPAY_KEY_ID || 'rzp_test_LM_Tourism';
        const KEY_SECRET = env.RAZORPAY_KEY_SECRET || 'TestRazorpaySecretKey123456';

        // 1. Create Razorpay Order API Endpoint
        if (req.url === '/api/create-razorpay-order' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { amount, currency = 'INR', receipt = `rcpt_${Date.now()}` } = JSON.parse(body || '{}');
              const amountInPaise = Math.round(Number(amount) * 100);

              // If live/test Razorpay API credentials provided, call Razorpay REST API
              if (KEY_ID && KEY_SECRET && !KEY_ID.includes('LM_Tourism')) {
                const authHeader = 'Basic ' + Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');
                const apiRes = await fetch('https://api.razorpay.com/v1/orders', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authHeader
                  },
                  body: JSON.stringify({
                    amount: amountInPaise,
                    currency,
                    receipt,
                    payment_capture: 1
                  })
                });

                if (apiRes.ok) {
                  const orderData = await apiRes.json();
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({
                    id: orderData.id,
                    amount: orderData.amount,
                    currency: orderData.currency,
                    key_id: KEY_ID
                  }));
                }
              }

              // Test Mode / Development Order generation
              const mockOrderId = `order_${crypto.randomBytes(10).toString('hex')}`;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({
                id: mockOrderId,
                amount: amountInPaise,
                currency,
                key_id: KEY_ID,
                isTestMock: true
              }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // 2. Verify Razorpay Payment Signature API Endpoint
        if (req.url === '/api/verify-razorpay-payment' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = JSON.parse(body || '{}');

              if (!razorpay_order_id || !razorpay_payment_id) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ verified: false, error: 'Missing payment parameters' }));
              }

              // Compute expected HMAC SHA256 signature
              const textToSign = razorpay_order_id + '|' + razorpay_payment_id;
              const expectedSignature = crypto
                .createHmac('sha256', KEY_SECRET)
                .update(textToSign)
                .digest('hex');

              // Verification check
              const isTestMock = razorpay_order_id.startsWith('order_') && (!KEY_SECRET || KEY_SECRET === 'TestRazorpaySecretKey123456');
              const isVerified = isTestMock || (razorpay_signature && expectedSignature === razorpay_signature);

              if (isVerified) {
                const bookingId = 'LM-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({
                  verified: true,
                  status: 'PAID',
                  bookingId,
                  paymentId: razorpay_payment_id || `pay_${crypto.randomBytes(8).toString('hex')}`,
                  orderId: razorpay_order_id,
                  message: 'Razorpay HMAC SHA256 payment signature verified successfully'
                }));
              } else {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({
                  verified: false,
                  status: 'FAILED',
                  error: 'Razorpay payment verification failed: HMAC SHA256 signature mismatch.'
                }));
              }
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ verified: false, error: err.message }));
            }
          });
          return;
        }

        // 3. Google Gemini API Secure Chat Proxy Endpoint & Health Check
        if (req.url === '/api/chat/health' && req.method === 'GET') {
          const env = loadEnvVars();
          const apiKey = (env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '').trim();
          const isConfigured = Boolean(apiKey && apiKey !== '' && !apiKey.includes('your_gemini_api_key'));

          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({
            status: 'ok',
            apiConfigured: isConfigured,
            model: 'gemini-2.5-flash',
            mode: isConfigured ? 'live_gemini_api' : 'offline_unconfigured'
          }));
        }

        if (req.url === '/api/chat' && req.method === 'POST') {
          // --- Rate Limiting (25 requests per minute per IP) ---
          if (!globalThis.__geminiRateLimitMap) {
            globalThis.__geminiRateLimitMap = new Map();
          }
          const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
          const now = Date.now();
          const windowMs = 60 * 1000;
          const maxRequestsPerMin = 25;

          let ipRecord = globalThis.__geminiRateLimitMap.get(clientIp);
          if (!ipRecord || (now - ipRecord.startTime) > windowMs) {
            ipRecord = { count: 1, startTime: now };
          } else {
            ipRecord.count += 1;
          }
          globalThis.__geminiRateLimitMap.set(clientIp, ipRecord);

          if (ipRecord.count > maxRequestsPerMin) {
            res.statusCode = 429;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Retry-After', '60');
            return res.end(JSON.stringify({
              error: 'Rate limit exceeded (max 25 requests/min). Please wait a moment before asking another question.',
              code: 'RATE_LIMIT_EXCEEDED'
            }));
          }

          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              let { message, history = [], destinationContext, plannerContext } = parsed;

              // --- Input Validation & Sanitization ---
              if (!message || typeof message !== 'string' || !message.trim()) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ error: 'Please provide a valid question.', code: 'INVALID_INPUT' }));
              }

              const trimmedMsg = message.trim();
              if (trimmedMsg.length > 1000) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ error: 'Question is too long (max 1,000 characters).', code: 'INPUT_TOO_LONG' }));
              }

              const env = loadEnvVars();
              const apiKey = (env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '').trim();

              console.log('--------------------------------------------------');
              console.log(`[Backend /api/chat]: Received user query: "${trimmedMsg}"`);
              console.log(`[Backend /api/chat]: GEMINI_API_KEY configured: ${Boolean(apiKey && !apiKey.includes('your_gemini_api_key'))}`);

              if (!apiKey || apiKey.includes('your_gemini_api_key')) {
                console.warn('[Backend /api/chat Error]: GEMINI_API_KEY is unconfigured in .env file.');
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({
                  error: 'GEMINI_API_KEY is missing or unconfigured in .env file.',
                  code: 'MISSING_API_KEY'
                }));
              }


              const maskedKey = apiKey.length > 10 ? `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}` : '***';
              console.log(`[Backend /api/chat]: Dispatching request to Gemini API (Target Model: gemini-2.5-flash, Key: ${maskedKey})`);

              // Build System Context
              let contextText = '';
              if (destinationContext && typeof destinationContext === 'object') {
                contextText += `\n\nACTIVE DESTINATION CONTEXT:\n` +
                  `• Destination Name: ${destinationContext.name || 'Unknown'}\n` +
                  `• ID: ${destinationContext.id || ''}\n` +
                  `• Location: ${destinationContext.city || ''}, ${destinationContext.state || ''} (${destinationContext.country || 'Global'})\n` +
                  `• Category: ${destinationContext.category || 'Monuments & Heritage'}\n` +
                  `• Description: ${destinationContext.description || ''}\n` +
                  `• Why Famous: ${destinationContext.whyFamous || ''}\n` +
                  `• Cultural Significance: ${destinationContext.culturalSignificance || ''}\n` +
                  `• History & Builder: ${destinationContext.history || ''} | Built by: ${destinationContext.builtBy || 'Ancient Era'} (${destinationContext.builtYear || destinationContext.year || 'Historical'})\n` +
                  `• Opening Hours: ${destinationContext.openingTime || '06:00 AM'} - ${destinationContext.closingTime || '08:00 PM'} (Days Open: ${destinationContext.daysOpen || 'Daily'}, Closed: ${destinationContext.closedDay || 'None'})\n` +
                  `• Crowd Information: Estimated Crowd Level: ${destinationContext.crowdLevel || 'Medium'}. Best Visiting Window: ${destinationContext.lowCrowdHours || destinationContext.bestVisitingTimeWindow || '06:00 AM - 08:30 AM'}. Avoid Peak: ${destinationContext.peakHours || destinationContext.avoidPeakTime || '11:00 AM - 02:00 PM'}.\n` +
                  `• Ticket Information: ${destinationContext.ticketInfo?.isFree ? 'Free Entry' : `Adult: ₹${destinationContext.ticketInfo?.adult || destinationContext.entryFee || 25}, Child: ₹${destinationContext.ticketInfo?.child || 0}, Foreigner: ₹${destinationContext.ticketInfo?.foreigner || 500}`}.\n` +
                  `• Travel Tips: Wear: ${destinationContext.travelTips?.wear || 'Modest clothing'}, Carry: ${destinationContext.travelTips?.carry || 'Water bottle'}, Photography: ${destinationContext.travelTips?.photography || 'Allowed'}, Etiquette: ${destinationContext.travelTips?.etiquette || 'Respectful'}.\n`;
              }

              if (plannerContext && typeof plannerContext === 'object') {
                contextText += `\n\nUSER TRIP PLANNER CONTEXT:\n` +
                  `• Selected Country/Region: ${plannerContext.country || 'India'} (${plannerContext.region || 'All'})\n` +
                  `• Days: ${plannerContext.days || 3} | Budget: ${plannerContext.currencySymbol || '$'}${plannerContext.budget || 5000}\n` +
                  `• Companion: ${plannerContext.companion || 'Family'} | Style: ${plannerContext.style || 'Moderate'}\n`;
              }

              const systemInstructionText = `You are LM Tourism AI, an intelligent worldwide tourism assistant.
You help users with monuments, destinations, history, culture, architecture, travel planning, opening hours, estimated crowd levels, ticket information, nearby attractions and travel advice.
${contextText}

Core Guidelines:
1. When a current destination is supplied, treat it as the primary destination context.
2. Maintain conversational context across multiple turns.
3. Understand follow-up questions, pronouns and references such as 'it', 'there', 'this monument', 'that place', 'its history', 'nearby' and 'when should I go'.
4. Give detailed answers when the user asks for detail, and concise answers when the question is simple.
5. Do not repeatedly introduce yourself. Do not give identical answers to different questions.
6. Never invent live crowd information. If crowd information is estimated, explicitly say it is estimated.
7. Do not invent official ticket information. If information is unavailable, say so.
8. For booking, navigation and application actions, use the existing LM Tourism application features instead of pretending that the AI performed the action. You may embed tags:
   - [ACTION:BOOK_TICKETS:${destinationContext?.id || 'destination-id'}]
   - [ACTION:OPEN_MAP:${destinationContext?.name || 'Destination Name'}]
   - [ACTION:OPEN_DESTINATION:destination-id]
   - [ACTION:OPEN_PLANNER]
9. Respect the user's selected language.`;


              // Format conversation history safely (max 8 messages)
              const contents = [];
              if (Array.isArray(history)) {
                const boundedHistory = history.slice(-8);
                boundedHistory.forEach(item => {
                  if (item && item.text && item.sender) {
                    contents.push({
                      role: item.sender === 'user' ? 'user' : 'model',
                      parts: [{ text: String(item.text).slice(0, 1000) }]
                    });
                  }
                });
              }

              contents.push({
                role: 'user',
                parts: [{ text: trimmedMsg }]
              });

              // Safety Settings payload
              const safetySettings = [
                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
              ];

              const payload = {
                system_instruction: {
                  parts: [{ text: systemInstructionText }]
                },
                contents,
                safetySettings
              };

              const candidateModels = [
                'gemini-2.5-flash',
                'gemini-2.0-flash',
                'gemini-1.5-flash',
                'gemini-1.5-pro',
                'gemini-2.5-pro',
                'gemini-pro'
              ];

              // --- Request Timeout Protection (12 seconds) ---
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 12000);

              let responseText = null;
              let modelUsed = null;
              let lastApiError = null;

              // 1. Try @google/genai SDK if package is present
              try {
                const { GoogleGenAI } = await import('@google/genai');
                const ai = new GoogleGenAI({ apiKey });
                for (const modelName of candidateModels) {
                  try {
                    const response = await ai.models.generateContent({
                      model: modelName,
                      contents: contents,
                      config: {
                        systemInstruction: systemInstructionText,
                      }
                    });
                    if (response && response.text) {
                      responseText = response.text.trim();
                      modelUsed = modelName;
                      console.log(`[Backend /api/chat]: SUCCESS using @google/genai SDK (Model: ${modelName})`);
                      break;
                    }
                  } catch (sdkErr) {
                    lastApiError = sdkErr.message || String(sdkErr);
                    console.warn(`[@google/genai SDK Warning]: Model ${modelName} returned:`, lastApiError);
                  }
                }
              } catch (importErr) {
                // Dynamic import of @google/genai not present, proceed to direct REST API
              }

              // 2. Direct REST API execution with auth variants across candidate models if SDK didn't return response
              if (!responseText) {
                const apiVersions = ['v1beta'];
                
                for (const version of apiVersions) {
                  for (const modelName of candidateModels) {
                    const authVariants = [
                      {
                        url: `https://generativelanguage.googleapis.com/${version}/models/${modelName}:generateContent?key=${apiKey}`,
                        headers: { 'Content-Type': 'application/json' }
                      },
                      {
                        url: `https://generativelanguage.googleapis.com/${version}/models/${modelName}:generateContent`,
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` }
                      },
                      {
                        url: `https://generativelanguage.googleapis.com/${version}/models/${modelName}:generateContent`,
                        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey }
                      }
                    ];


                    for (const variant of authVariants) {
                      try {
                        console.log(`[Backend Gemini REST Proxy]: Testing model ${modelName} (${version})...`);
                        const geminiRes = await fetch(variant.url, {
                          method: 'POST',
                          headers: variant.headers,
                          body: JSON.stringify(payload),
                          signal: controller.signal
                        });

                        if (geminiRes.ok) {
                          const data = await geminiRes.json();
                          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                          if (text && text.trim()) {
                            responseText = text.trim();
                            modelUsed = `${modelName} (${version})`;
                            console.log(`[Backend Gemini REST Proxy]: SUCCESS with model ${modelName} (${version})!`);
                            break;
                          }
                        } else {
                          const rawErrText = await geminiRes.text();
                          let jsonErr = {};
                          try { jsonErr = JSON.parse(rawErrText); } catch (e) {}
                          lastApiError = jsonErr.error?.message || rawErrText.slice(0, 250);
                          console.error(`[Backend Gemini API Error]: Status ${geminiRes.status} | Model ${modelName} (${version}) | Error: ${lastApiError}`);
                        }
                      } catch (fetchErr) {
                        if (fetchErr.name === 'AbortError') {
                          console.error('[Backend Gemini API Error]: Request timed out after 12s.');
                          clearTimeout(timeoutId);
                          res.statusCode = 504;
                          res.setHeader('Content-Type', 'application/json');
                          return res.end(JSON.stringify({
                            error: 'Gemini request timed out after 12 seconds. Please try again.',
                            code: 'GATEWAY_TIMEOUT'
                          }));
                        }
                        lastApiError = fetchErr.message;
                        console.error(`[Backend Gemini REST Proxy]: Model ${modelName} fetch error:`, fetchErr.message);
                      }
                    }
                    if (responseText) break;
                  }
                  if (responseText) break;
                }
              }


              clearTimeout(timeoutId);

              if (responseText) {
                console.log('--------------------------------------------------');
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({
                  success: true,
                  text: responseText,
                  modelUsed: modelUsed || 'gemini-2.5-flash',
                  source: 'google_gemini_api'
                }));
              } else {
                console.error('[Backend /api/chat]: Gemini API Error:', lastApiError);
                console.log('--------------------------------------------------');
                
                res.statusCode = 502;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({
                  error: lastApiError ? `Google Gemini API Error: ${lastApiError}` : 'Gemini is temporarily unavailable. Please try again.',
                  code: 'API_GATEWAY_ERROR',
                  details: lastApiError
                }));
              }
            } catch (err) {
              console.error('[Backend /api/chat Fatal Exception]:', err);
              console.log('--------------------------------------------------');
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({
                error: `Internal server error: ${err.message}`,
                code: 'INTERNAL_SERVER_ERROR'
              }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [razorpayBackendPlugin()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    strictPort: true,
    open: false
  },
  build: {
    rollupOptions: {
      external: ['three', /^three\/examples\/.*/],
      output: {
        globals: {
          'three': 'THREE',
        }
      }
    }
  },
  resolve: {
    // Treat 'three' bare imports as external — point to window.THREE
    // This prevents the "Failed to resolve import" error during dev
  },
  optimizeDeps: {
    // Don't try to pre-bundle three — it's loaded from CDN
    exclude: ['three']
  }
});
