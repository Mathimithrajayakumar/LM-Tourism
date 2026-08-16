package com.example.lm_tourism.navigation

/**
 * Sealed class defining every navigation destination in the app.
 *
 * Pattern: [route] is used as the NavHost destination string.
 * Destinations with arguments use {paramName} placeholders.
 */
sealed class Screen(val route: String) {

    // ─── Standalone / Auth Screens ────────────────────────────────────
    object Splash         : Screen("splash")
    object Login          : Screen("login")
    object Register       : Screen("register")
    object ForgotPassword : Screen("forgot_password")

    // ─── Main scaffold (hosts bottom nav tabs) ─────────────────────────
    object Main : Screen("main")

    // ─── Bottom Nav Tab Screens ────────────────────────────────────────
    object Home      : Screen("home")
    object Explore   : Screen("explore")
    object Favorites : Screen("favorites")
    object Profile   : Screen("profile")

    // ─── Overlay Screens ──────────────────────────────────────────────
    object Settings : Screen("settings")

    object MonumentDetail : Screen("monument_detail/{monumentId}") {
        /** Creates the concrete route by injecting [monumentId]. */
        fun createRoute(monumentId: String) = "monument_detail/$monumentId"
        const val ARG_MONUMENT_ID = "monumentId"
    }

    object ArScanner : Screen("ar_scanner/{monumentId}") {
        fun createRoute(monumentId: String) = "ar_scanner/$monumentId"
        const val ARG_MONUMENT_ID = "monumentId"
    }
    object AiGuide    : Screen("ai_guide")      // Gemini AI chatbot
    object MapView    : Screen("map_view/{monumentId}") {
        fun createRoute(monumentId: String) = "map_view/$monumentId"
    }
}
