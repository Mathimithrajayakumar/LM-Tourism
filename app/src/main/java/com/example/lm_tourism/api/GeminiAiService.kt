package com.example.lm_tourism.api

/**
 * Interface for future Google Gemini AI chatbot integration.
 *
 * Phase 2 implementation will use the Gemini Android SDK to:
 * 1. Answer user questions about a monument in natural language.
 * 2. Generate personalised tour narratives.
 * 3. Translate monument descriptions into multiple languages.
 *
 * Implementing class: `GeminiAiServiceImpl` (Phase 2)
 */
interface GeminiAiService {

    /**
     * Sends a question about a monument to Gemini and returns a response.
     *
     * @param monumentName  Name of the monument for context injection.
     * @param userQuestion  The user's natural-language question.
     * @return              AI-generated answer, or null on error.
     */
    suspend fun askAboutMonument(
        monumentName: String,
        userQuestion: String
    ): String?

    /**
     * Generates a personalised audio tour script for the monument.
     *
     * @param monumentId  ID of the monument.
     * @param language    BCP-47 language tag (e.g. "en-IN", "hi-IN").
     * @return            Tour narration script.
     */
    suspend fun generateTourScript(
        monumentId: String,
        language: String = "en-IN"
    ): String?

    /**
     * Translates monument description to the specified language.
     *
     * @param text        Original text to translate.
     * @param targetLang  BCP-47 language tag.
     * @return            Translated text.
     */
    suspend fun translate(text: String, targetLang: String): String?
}
