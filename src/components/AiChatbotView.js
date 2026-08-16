// src/components/AiChatbotView.js
// Dedicated Worldwide LM Tourism Conversational AI Assistant View

import { 
  getAiChatMessages, 
  sendChatMessageToAi, 
  resetChatSession, 
  getActiveAiDestination, 
  clearActiveAiDestination, 
  isAiThinking, 
  stopAiGeneration, 
  regenerateLastAiMessage, 
  toggleAiMessageFeedback,
  checkAiServiceHealth,
  getAiEngineMode,
  setAiEngineMode
} from '../services/aiService.js';

let aiHealthState = { status: 'checking', apiConfigured: false, mode: 'gemini_proxy' };

checkAiServiceHealth().then(health => {
  if (health) aiHealthState = health;
  if (window.renderApp) window.renderApp();
});

/**
 * Format Markdown Text into HTML
 */
function formatMarkdownText(text) {
  if (!text) return '';

  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Headings
  html = html.replace(/^### (.*$)/gim, '<h4 style="font-size: 1.05rem; font-weight: 800; margin: 12px 0 6px; color: var(--color-primary); font-family: var(--font-heading);">$1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h3 style="font-size: 1.15rem; font-weight: 800; margin: 14px 0 8px; color: var(--color-primary); font-family: var(--font-heading);">$1</h3>');

  // Bold & Italic & Code
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 800; color: inherit;">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em style="font-style: italic;">$1</em>');
  html = html.replace(/`(.*?)`/g, '<code style="background: rgba(0,0,0,0.08); padding: 2px 6px; border-radius: 4px; font-size: 0.85em; font-family: monospace;">$1</code>');

  // Bullet points
  html = html.replace(/^[•\-\*]\s+(.*$)/gim, '<div style="display: flex; gap: 8px; margin-bottom: 6px;"><span style="color: var(--color-primary); font-weight: bold;">•</span><div>$1</div></div>');

  // Paragraph breaks
  html = html.replace(/\n\n/g, '<div style="height: 10px;"></div>');
  html = html.replace(/\n/g, '<br />');

  return html;
}

export function renderAiChatbotView() {
  const isApiConnected = aiHealthState.apiConfigured;
  const activeDest = getActiveAiDestination();
  const messages = getAiChatMessages();
  const isThinking = isAiThinking();
  const currentMode = getAiEngineMode();

  // Scroll to bottom after render
  setTimeout(() => {
    const box = document.getElementById('chatbot-messages-box-main');
    if (box) box.scrollTop = box.scrollHeight;
  }, 50);

  return `
    <div class="ai-chatbot-view fade-in" style="padding: 16px; max-width: 960px; margin: 0 auto 100px; height: calc(100vh - 140px); display: flex; flex-direction: column;">
      
      <!-- Header Bar -->
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); border-radius: var(--radius-xl); padding: 18px 20px; color: white; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; box-shadow: var(--shadow-md); flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #6366f1); display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 12px rgba(59,130,246,0.4);">
            <span class="material-symbols-rounded" style="font-size: 24px;">smart_toy</span>
          </div>
          <div>
            <h2 style="font-size: 1.25rem; font-weight: 800; margin: 0; font-family: var(--font-heading);">
              LM Tourism AI Assistant
            </h2>
            <div style="font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 6px; margin-top: 2px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: ${currentMode === 'manual' ? '#3b82f6' : (isApiConnected ? '#10b981' : '#f59e0b')}; display: inline-block; box-shadow: 0 0 8px ${currentMode === 'manual' ? '#3b82f6' : (isApiConnected ? '#10b981' : '#f59e0b')};"></span>
              <span style="color: ${currentMode === 'manual' ? '#93c5fd' : (isApiConnected ? '#a7f3d0' : '#fde68a')};">
                ${currentMode === 'manual'
                  ? '⚡ LM Knowledge Assistant Active (Offline Manual Mode)'
                  : (isApiConnected ? '🤖 Google Gemini 2.5 Connected' : '⚡ LM Knowledge Assistant (Auto Fallback Active)')
                }
              </span>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 8px; align-items: center;">
          <!-- Engine Selector Pills -->
          <div style="background: rgba(255,255,255,0.12); padding: 3px; border-radius: 20px; display: flex; gap: 2px;">
            <button 
              onclick="window.setAiEngineMode('auto')" 
              style="border: none; padding: 6px 12px; border-radius: 16px; font-size: 0.75rem; font-weight: 800; cursor: pointer; transition: all 0.2s; background: ${currentMode === 'auto' ? '#3b82f6' : 'transparent'}; color: white;"
              title="Tries Gemini API with automatic fallback to Local Knowledge Base"
            >
              🤖 Auto / Gemini
            </button>
            <button 
              onclick="window.setAiEngineMode('manual')" 
              style="border: none; padding: 6px 12px; border-radius: 16px; font-size: 0.75rem; font-weight: 800; cursor: pointer; transition: all 0.2s; background: ${currentMode === 'manual' ? '#6366f1' : 'transparent'}; color: white;"
              title="Manual Local Knowledge Assistant mode (Works 100% offline)"
            >
              ⚡ Manual Mode
            </button>
          </div>

          <!-- New Chat Button -->
          <button class="btn" onclick="window.startNewAiChat()" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 8px 14px; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 800; display: flex; align-items: center; gap: 4px; cursor: pointer;">
            <span class="material-symbols-rounded" style="font-size: 18px;">add</span>
            <span>New Chat</span>
          </button>
        </div>
      </div>

      <!-- Destination Context Banner -->
      <div style="margin-bottom: 12px; padding: 10px 16px; border-radius: var(--radius-lg); background: ${activeDest ? 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(99,102,241,0.06))' : 'var(--bg-secondary)'}; border: 1px solid ${activeDest ? 'rgba(37,99,235,0.25)' : 'var(--border-subtle)'}; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-primary);">
          <span class="material-symbols-rounded" style="color: var(--color-primary); font-size: 20px;">
            ${activeDest ? 'place' : 'public'}
          </span>
          <div>
            ${activeDest ? `
              Currently discussing: <strong>🏛 ${activeDest.name}</strong> (${activeDest.city}, ${activeDest.state || activeDest.country})
            ` : `
              Global Assistant Mode: <strong>Ask about any country, city, monument, or trip plan worldwide</strong>
            `}
          </div>
        </div>

        ${activeDest ? `
          <button onclick="window.clearAiDestinationContext()" style="background: transparent; border: none; color: var(--color-primary); font-weight: 800; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 4px;">
            <span>Switch to Global Mode</span>
            <span class="material-symbols-rounded" style="font-size: 16px;">close</span>
          </button>
        ` : ''}
      </div>

      <!-- Suggested Prompts Row -->
      <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 10px; scrollbar-width: none;">
        ${activeDest ? `
          <button class="chip" onclick="window.sendPresetAiQuery('Tell me about ${activeDest.name}')" style="white-space: nowrap; font-size: 0.8rem; font-weight: 700; background: var(--bg-card); border: 1px solid var(--border-subtle); cursor: pointer;">
            📜 History of ${activeDest.name}?
          </button>
          <button class="chip" onclick="window.sendPresetAiQuery('Who built ${activeDest.name} and why?')" style="white-space: nowrap; font-size: 0.8rem; font-weight: 700; background: var(--bg-card); border: 1px solid var(--border-subtle); cursor: pointer;">
            👑 Who built it and why?
          </button>
          <button class="chip" onclick="window.sendPresetAiQuery('When is the best time to visit ${activeDest.name}?')" style="white-space: nowrap; font-size: 0.8rem; font-weight: 700; background: var(--bg-card); border: 1px solid var(--border-subtle); cursor: pointer;">
            🕒 Best time to visit?
          </button>
          <button class="chip" onclick="window.sendPresetAiQuery('How much are ticket prices for ${activeDest.name}?')" style="white-space: nowrap; font-size: 0.8rem; font-weight: 700; background: var(--bg-card); border: 1px solid var(--border-subtle); cursor: pointer;">
            🎟️ Ticket fees?
          </button>
          <button class="chip" onclick="window.sendPresetAiQuery('What else can I visit nearby?')" style="white-space: nowrap; font-size: 0.8rem; font-weight: 700; background: var(--bg-card); border: 1px solid var(--border-subtle); cursor: pointer;">
            📍 Nearby attractions?
          </button>
          <button class="chip" onclick="window.sendPresetAiQuery('Plan a 1-day itinerary around this place')" style="white-space: nowrap; font-size: 0.8rem; font-weight: 700; background: var(--bg-card); border: 1px solid var(--border-subtle); cursor: pointer;">
            🗓️ Plan my day
          </button>
        ` : `
          <button class="chip" onclick="window.sendPresetAiQuery('Tell me about Taj Mahal')" style="white-space: nowrap; font-size: 0.8rem; font-weight: 700; background: var(--bg-card); border: 1px solid var(--border-subtle); cursor: pointer;">
            🏛️ Taj Mahal History
          </button>
          <button class="chip" onclick="window.sendPresetAiQuery('Plan a 5-day trip to Japan')" style="white-space: nowrap; font-size: 0.8rem; font-weight: 700; background: var(--bg-card); border: 1px solid var(--border-subtle); cursor: pointer;">
            🗼 5-Day Japan Itinerary
          </button>
          <button class="chip" onclick="window.sendPresetAiQuery('Compare India and France for heritage tourism')" style="white-space: nowrap; font-size: 0.8rem; font-weight: 700; background: var(--bg-card); border: 1px solid var(--border-subtle); cursor: pointer;">
            ⚖️ India vs France Tourism
          </button>
          <button class="chip" onclick="window.sendPresetAiQuery('What are the top UNESCO sites in Tamil Nadu?')" style="white-space: nowrap; font-size: 0.8rem; font-weight: 700; background: var(--bg-card); border: 1px solid var(--border-subtle); cursor: pointer;">
            🛕 Tamil Nadu UNESCO Sites
          </button>
          <button class="chip" onclick="window.sendPresetAiQuery('Suggest a family trip under ₹20,000')" style="white-space: nowrap; font-size: 0.8rem; font-weight: 700; background: var(--bg-card); border: 1px solid var(--border-subtle); cursor: pointer;">
            💰 Budget Family Trips
          </button>
        `}
      </div>

      <!-- Messages History Scroll Container -->
      <div 
        id="chatbot-messages-box-main"
        style="flex: 1; overflow-y: auto; background: var(--bg-card); border-radius: var(--radius-xl); border: 1px solid var(--border-subtle); padding: 20px; display: flex; flex-direction: column; gap: 18px; margin-bottom: 12px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);"
      >
        ${messages.map(msg => `
          <div style="display: flex; gap: 12px; justify-content: ${msg.sender === 'user' ? 'flex-end' : 'flex-start'}; align-items: flex-start;">
            ${msg.sender === 'ai' ? `
              <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--color-primary), #4f46e5); color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: var(--shadow-sm); margin-top: 2px;">
                <span class="material-symbols-rounded" style="font-size: 20px;">smart_toy</span>
              </div>
            ` : ''}

            <div style="max-width: 82%; display: flex; flex-direction: column; gap: 8px;">
              <div style="padding: 14px 18px; border-radius: var(--radius-lg); background: ${msg.sender === 'user' ? 'var(--color-primary)' : msg.sender === 'error' ? 'rgba(239,68,68,0.1)' : 'var(--bg-secondary)'}; color: ${msg.sender === 'user' ? 'white' : msg.sender === 'error' ? '#dc2626' : 'var(--text-primary)'}; border: ${msg.sender === 'user' ? 'none' : msg.sender === 'error' ? '1px solid #ef4444' : '1px solid var(--border-subtle)'}; font-size: 0.95rem; line-height: 1.65; word-break: break-word; box-shadow: var(--shadow-sm);">
                ${msg.sender === 'ai' ? formatMarkdownText(msg.text) : msg.text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
              </div>

              <!-- Action Buttons embedded in response -->
              ${msg.actionButtons && msg.actionButtons.length > 0 ? `
                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 2px;">
                  ${msg.actionButtons.map(btn => `
                    <button class="btn btn-primary" onclick="window.triggerAiAction('${btn.type}', '${btn.targetId || ''}', '${btn.name || ''}')" style="border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 800; padding: 6px 14px; display: inline-flex; align-items: center; gap: 4px;">
                      <span>${btn.label}</span>
                    </button>
                  `).join('')}
                </div>
              ` : ''}

              <!-- Per-Message Toolbar (Copy, Regenerate, Feedback) -->
              ${msg.sender === 'ai' ? `
                <div style="display: flex; align-items: center; gap: 12px; font-size: 0.75rem; color: var(--text-muted); margin-left: 4px;">
                  <button onclick="window.copyAiMsgText(${JSON.stringify(msg.text)})" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; display: flex; align-items: center; gap: 4px; font-weight: 700;">
                    <span class="material-symbols-rounded" style="font-size: 14px;">content_copy</span>
                    <span>Copy</span>
                  </button>
                  <button onclick="window.regenerateLastAiMessage()" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; display: flex; align-items: center; gap: 4px; font-weight: 700;">
                    <span class="material-symbols-rounded" style="font-size: 14px;">refresh</span>
                    <span>Regenerate</span>
                  </button>
                  <div style="display: flex; gap: 6px;">
                    <button onclick="window.toggleAiLike('${msg.id}', true)" style="background: transparent; border: none; color: ${msg.liked === true ? '#10b981' : 'var(--text-muted)'}; cursor: pointer;">👍</button>
                    <button onclick="window.toggleAiLike('${msg.id}', false)" style="background: transparent; border: none; color: ${msg.liked === false ? '#ef4444' : 'var(--text-muted)'}; cursor: pointer;">👎</button>
                  </div>
                </div>
              ` : msg.sender === 'error' ? `
                <button onclick="window.regenerateLastAiMessage()" class="btn btn-primary" style="align-self: flex-start; padding: 6px 16px; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 800;">
                  🔄 Retry Request
                </button>
              ` : ''}
            </div>
          </div>
        `).join('')}

        <!-- Thinking State with Stop Generation Button -->
        ${isThinking ? `
          <div style="display: flex; gap: 12px; align-items: center;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--color-primary), #4f46e5); color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-symbols-rounded spin" style="font-size: 20px;">sync</span>
            </div>
            <div style="padding: 12px 18px; border-radius: var(--radius-lg); background: var(--bg-secondary); border: 1px solid var(--border-subtle); font-size: 0.9rem; color: var(--text-muted); display: flex; align-items: center; gap: 12px;">
              <span>AI is thinking &amp; generating response with Google Gemini...</span>
              <button onclick="window.stopAiGeneration()" style="background: rgba(239,68,68,0.15); color: #dc2626; border: 1px solid #ef4444; padding: 4px 12px; border-radius: 12px; font-weight: 800; font-size: 0.75rem; cursor: pointer;">
                ⏹️ Stop Generating
              </button>
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Chat Input Controls -->
      <div style="display: flex; gap: 10px; align-items: center;">
        <textarea 
          id="chatbot-user-input-main"
          rows="1"
          placeholder="Ask AI anything about world monuments, history, timings, budget, or itineraries..."
          onkeydown="if(event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); window.handleSendMainAiMsg(); }"
          style="flex: 1; padding: 14px 18px; border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); background: var(--bg-card); color: var(--text-primary); font-size: 0.95rem; font-family: inherit; resize: none; box-shadow: var(--shadow-sm);"
          ${isThinking ? 'disabled' : ''}
        ></textarea>

        <button 
          id="chatbot-send-btn-main"
          class="btn btn-primary" 
          onclick="window.handleSendMainAiMsg()"
          style="border-radius: var(--radius-full); padding: 0 24px; height: 48px; font-weight: 800; display: flex; align-items: center; gap: 6px; cursor: pointer;"
          ${isThinking ? 'disabled' : ''}
        >
          <span>Send</span>
          <span class="material-symbols-rounded">send</span>
        </button>
      </div>

    </div>
  `;
}

window.startNewAiChat = () => {
  resetChatSession();
};

window.clearAiDestinationContext = () => {
  clearActiveAiDestination();
  resetChatSession();
};

window.sendPresetAiQuery = (text) => {
  const input = document.getElementById('chatbot-user-input-main');
  if (input) input.value = text;
  window.handleSendMainAiMsg();
};

window.handleSendMainAiMsg = async () => {
  const input = document.getElementById('chatbot-user-input-main');
  if (!input || !input.value.trim() || isAiThinking()) return;
  const text = input.value.trim();
  input.value = '';
  await sendChatMessageToAi(text);
};

window.regenerateLastAiMessage = () => {
  regenerateLastAiMessage();
};

window.stopAiGeneration = () => {
  stopAiGeneration();
};

window.toggleAiLike = (msgId, isLiked) => {
  toggleAiMessageFeedback(msgId, isLiked);
};

window.copyAiMsgText = (text) => {
  if (navigator.clipboard && text) {
    navigator.clipboard.writeText(text).then(() => {
      alert('📋 Response copied to clipboard!');
    }).catch(() => {});
  }
};

window.setAiEngineMode = (mode) => {
  setAiEngineMode(mode);
};

window.triggerAiAction = (actionType, targetId, name) => {
  if (actionType === 'BOOK_TICKETS') {
    window.openBookingModal(targetId || 'taj-mahal');
  } else if (actionType === 'OPEN_MAP') {
    window.open('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(name || 'Tourism Destination'), '_blank');
  } else if (actionType === 'OPEN_DESTINATION') {
    window.openMonumentDetail(targetId);
  } else if (actionType === 'OPEN_PLANNER') {
    window.navigateTo('planner');
  }
};



