package com.example.lm_tourism.ui.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Explore
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.outlined.Explore
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import androidx.navigation.compose.currentBackStackEntryAsState
import com.example.lm_tourism.model.NavigationItem
import com.example.lm_tourism.navigation.Screen

/** Bottom navigation bar items definition. */
val bottomNavItems = listOf(
    NavigationItem(
        route        = Screen.Home.route,
        label        = "Home",
        icon         = Icons.Outlined.Home,
        selectedIcon = Icons.Filled.Home
    ),
    NavigationItem(
        route        = Screen.Explore.route,
        label        = "Explore",
        icon         = Icons.Outlined.Explore,
        selectedIcon = Icons.Filled.Explore
    ),
    NavigationItem(
        route        = Screen.Favorites.route,
        label        = "Favourites",
        icon         = Icons.Outlined.FavoriteBorder,
        selectedIcon = Icons.Filled.Favorite
    ),
    NavigationItem(
        route        = Screen.Profile.route,
        label        = "Profile",
        icon         = Icons.Outlined.Person,
        selectedIcon = Icons.Filled.Person
    )
)

/**
 * Material 3 NavigationBar used at the bottom of the main scaffold.
 *
 * @param navController  The inner NavController managing the bottom-tab graph.
 * @param modifier       Optional modifier.
 */
@Composable
fun LmBottomNavBar(
    navController: NavController,
    modifier: Modifier = Modifier
) {
    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute   = backStackEntry?.destination?.route

    NavigationBar(
        modifier          = modifier,
        containerColor    = MaterialTheme.colorScheme.surface,
        tonalElevation    = 8.dp
    ) {
        bottomNavItems.forEach { item ->
            val isSelected = currentRoute == item.route
            NavigationBarItem(
                selected = isSelected,
                onClick  = {
                    if (!isSelected) {
                        navController.navigate(item.route) {
                            // Pop back to Home so back stack doesn't grow
                            popUpTo(Screen.Home.route) { saveState = true }
                            launchSingleTop = true
                            restoreState    = true
                        }
                    }
                },
                icon = {
                    Icon(
                        imageVector = if (isSelected) item.selectedIcon else item.icon,
                        contentDescription = item.label
                    )
                },
                label = {
                    Text(
                        text  = item.label,
                        style = MaterialTheme.typography.labelSmall
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor   = MaterialTheme.colorScheme.onPrimaryContainer,
                    indicatorColor      = MaterialTheme.colorScheme.primaryContainer,
                    unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                    unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant
                )
            )
        }
    }
}
