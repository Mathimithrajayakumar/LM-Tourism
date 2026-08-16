package com.example.lm_tourism.model

/**
 * Represents an authenticated user of the LM Tourism app.
 * Mirrors the 'users' collection in Firestore.
 */
data class User(
    val uid: String = "",
    val name: String = "",
    val email: String = "",
    val profileImageUrl: String = "",
    val bio: String = "",
    val favoriteCount: Int = 0,
    val isGuest: Boolean = false,
    val createdAt: Long = 0L            // epoch millis
)
