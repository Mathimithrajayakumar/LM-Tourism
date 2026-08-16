package com.example.lm_tourism.model

/**
 * Core domain model representing a tourist monument.
 *
 * All fields have default values to support Firestore deserialization
 * (Firestore requires a no-arg constructor via reflection).
 *
 * Future fields for ARCore / Gemini can be added without breaking changes.
 */
data class Monument(
    val id: String = "",
    val name: String = "",
    val location: String = "",
    val city: String = "",
    val state: String = "",
    val country: String = "India",
    val description: String = "",
    val history: String = "",
    val architecture: String = "",
    val builtBy: String = "",
    val year: Int = 0,
    val dynasty: String = "",
    val unescoStatus: Boolean = false,
    val openingTime: String = "",
    val closingTime: String = "",
    val closedOn: String = "",
    val entryFee: Double = 0.0,
    val entryFeeIndian: Double = 0.0,
    val bestVisitingTime: String = "",
    val imageUrl: String = "",
    val rating: Float = 0f,
    val reviewCount: Int = 0,
    val latitude: Double = 0.0,
    val longitude: Double = 0.0,
    val officialBookingUrl: String = "",
    val category: String = "",          // e.g. "Fort", "Mausoleum", "Temple"
    val tags: List<String> = emptyList(),
    val isFeatured: Boolean = false,
    val isNearby: Boolean = false,       // Populated at runtime based on user location
    val isFavorite: Boolean = false      // Populated from Firestore favorites
)
