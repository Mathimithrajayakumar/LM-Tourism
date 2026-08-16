package com.example.lm_tourism.model

import androidx.compose.ui.graphics.vector.ImageVector

/**
 * Represents a single bottom navigation tab or quick-action button.
 *
 * @param route         Navigation route string matching [Screen] sealed class.
 * @param label         Human-readable label shown beneath the icon.
 * @param icon          Default (unselected) icon.
 * @param selectedIcon  Filled icon used when this tab is active.
 * @param badgeCount    Optional notification badge count (null = no badge).
 */
data class NavigationItem(
    val route: String,
    val label: String,
    val icon: ImageVector,
    val selectedIcon: ImageVector,
    val badgeCount: Int? = null
)
