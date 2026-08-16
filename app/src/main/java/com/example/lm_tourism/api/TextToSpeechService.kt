package com.example.lm_tourism.api

/**
 * Interface for future Android Text-to-Speech (TTS) integration.
 *
 * Phase 2 will integrate [android.speech.tts.TextToSpeech] to:
 * 1. Read monument descriptions aloud.
 * 2. Support multiple Indian languages (Hindi, Tamil, Telugu, Kannada).
 * 3. Work in conjunction with [GeminiAiService] tour scripts.
 *
 * Implementing class: `AndroidTtsService` (Phase 2)
 */
interface TextToSpeechService {

    /**
     * Speaks the provided [text] aloud.
     * @param text      The text to be spoken.
     * @param language  BCP-47 language tag (e.g. "en-IN", "hi-IN").
     */
    fun speak(text: String, language: String = "en-IN")

    /** Stops any ongoing speech. */
    fun stop()

    /** Pauses ongoing speech if supported. */
    fun pause()

    /** Resumes paused speech. */
    fun resume()

    /** Releases TTS engine resources. Must be called in onDestroy(). */
    fun shutdown()

    /** Returns true if TTS engine is currently speaking. */
    fun isSpeaking(): Boolean
}
