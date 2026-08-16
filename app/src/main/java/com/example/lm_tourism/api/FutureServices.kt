package com.example.lm_tourism.api

import com.example.lm_tourism.model.Monument

/**
 * Placeholder interface for ARCore integration (Phase 2).
 * When implemented, this will overlay 3D information on camera feed.
 */
interface ARService {
    /** Initialize AR session for a given monument. */
    fun initializeAR(monument: Monument)

    /** Start AR overlay with monument annotations. */
    fun startAROverlay()

    /** Stop AR session and release resources. */
    fun stopAR()

    /** Check if device supports ARCore. */
    fun isARSupported(): Boolean
}

/**
 * Placeholder interface for Gemini AI integration (Phase 2).
 */
interface GeminiAiService {
    /** Ask Gemini a question about a monument. */
    suspend fun askAboutMonument(monument: Monument, question: String): String

    /** Generate audio description of a monument for text-to-speech. */
    suspend fun generateAudioDescription(monument: Monument): String

    /** Get AI-powered recommendations based on user preferences. */
    suspend fun getRecommendations(userId: String): List<Monument>
}

/**
 * Placeholder interface for Text-to-Speech (Phase 2).
 */
interface TextToSpeechService {
    fun speak(text: String, language: String = "en-IN")
    fun stop()
    fun isPlaying(): Boolean
}

/**
 * Placeholder interface for Maps / Navigation (Phase 2).
 */
interface MapsService {
    /** Open navigation to the monument's coordinates. */
    fun navigateTo(latitude: Double, longitude: Double, label: String)

    /** Show the monument on a map fragment. */
    fun showOnMap(latitude: Double, longitude: Double)

    /** Get directions from user's current location. */
    suspend fun getDirections(destLat: Double, destLng: Double): String
}
