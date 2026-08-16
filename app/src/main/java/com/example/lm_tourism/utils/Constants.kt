package com.example.lm_tourism.utils

/** App-wide constants. Centralise magic strings here to avoid duplication. */
object Constants {

    // ─── Firestore Collections ─────────────────────────────────────────
    const val COLLECTION_MONUMENTS = "monuments"
    const val COLLECTION_USERS     = "users"
    const val COLLECTION_FAVORITES = "favorites"

    // ─── Firestore Field Names ─────────────────────────────────────────
    const val FIELD_UID          = "uid"
    const val FIELD_NAME         = "name"
    const val FIELD_EMAIL        = "email"
    const val FIELD_CREATED_AT   = "createdAt"
    const val FIELD_MONUMENT_ID  = "monumentId"
    const val FIELD_ADDED_AT     = "addedAt"
    const val FIELD_IS_FEATURED  = "isFeatured"
    const val FIELD_RATING       = "rating"

    // ─── Guest User ────────────────────────────────────────────────────
    const val GUEST_UID   = "guest_user"
    const val GUEST_NAME  = "Guest Explorer"
    const val GUEST_EMAIL = "guest@lmtourism.app"

    // ─── Splash Delay ─────────────────────────────────────────────────
    const val SPLASH_DELAY_MS = 2500L

    // ─── UI ────────────────────────────────────────────────────────────
    const val CARD_CORNER_RADIUS   = 16
    const val BUTTON_CORNER_RADIUS = 12
    const val IMAGE_CROSSFADE_MS   = 400

    // ─── Future API Base URL (placeholder) ────────────────────────────
    const val API_BASE_URL = "https://api.lmtourism.example.com/"

    // ─── Booking URLs ──────────────────────────────────────────────────
    const val ASI_BOOKING_URL = "https://asi.payumoney.com/"
}
