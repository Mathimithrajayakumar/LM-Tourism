import { getVoiceLangCode } from './i18n.js';

let recognitionInstance = null;

export function isSpeechRecognitionSupported() {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

export async function requestMicrophonePermission() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return { granted: false, reason: 'MediaDevices API not supported' };
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Stop tracks immediately after getting permission
    stream.getTracks().forEach(t => t.stop());
    return { granted: true };
  } catch (err) {
    return { granted: false, reason: err.name || err.message };
  }
}

export function startVoiceRecognition({ onStart, onResult, onError, onEnd }) {
  if (!isSpeechRecognitionSupported()) {
    if (onError) onError('Speech Recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
    return null;
  }

  try {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = getVoiceLangCode();

    recognitionInstance.onstart = () => {
      if (onStart) onStart();
    };

    recognitionInstance.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript && onResult) {
        onResult(transcript);
      }
    };

    recognitionInstance.onerror = (event) => {
      console.warn('[Voice Recognition Error]:', event.error);
      let msg = 'Voice input error occurred.';
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        msg = 'Microphone access denied. Please allow microphone permissions in browser settings.';
      } else if (event.error === 'no-speech') {
        msg = 'No speech was detected. Please try speaking again.';
      }
      if (onError) onError(msg);
    };

    recognitionInstance.onend = () => {
      if (onEnd) onEnd();
    };

    recognitionInstance.start();
    return recognitionInstance;
  } catch (err) {
    console.error('[Voice Recognition Init Error]:', err);
    if (onError) onError(`Microphone error: ${err.message}`);
    return null;
  }
}

export function stopVoiceRecognition() {
  if (recognitionInstance) {
    try {
      recognitionInstance.stop();
    } catch {}
    recognitionInstance = null;
  }
}
