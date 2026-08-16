package com.example.lm_tourism.navigation

import androidx.compose.animation.*
import androidx.compose.animation.core.tween
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.navArgument
import com.example.lm_tourism.ui.components.LmBottomNavBar
import com.example.lm_tourism.ui.screens.*

@OptIn(ExperimentalAnimationApi::class)
@Composable
fun LmNavGraph(
    rootNavController: NavHostController,
    startDestination: String = Screen.Splash.route,
    modifier: Modifier = Modifier
) {
    val backStackEntry by rootNavController.currentBackStackEntryAsState()
    val currentRoute   = backStackEntry?.destination?.route

    val showBottomBar = currentRoute in listOf(
        Screen.Home.route,
        Screen.Explore.route,
        Screen.Favorites.route,
        Screen.Profile.route
    )

    Scaffold(
        bottomBar = {
            if (showBottomBar) {
                LmBottomNavBar(navController = rootNavController)
            }
        },
        modifier = modifier
    ) { innerPadding ->
        NavHost(
            navController    = rootNavController,
            startDestination = startDestination,
            modifier         = Modifier.padding(innerPadding),
            enterTransition  = {
                slideInHorizontally(
                    initialOffsetX = { fullWidth -> fullWidth },
                    animationSpec  = tween(300)
                ) + fadeIn(animationSpec = tween(300))
            },
            exitTransition   = {
                slideOutHorizontally(
                    targetOffsetX = { fullWidth -> -fullWidth },
                    animationSpec = tween(300)
                ) + fadeOut(animationSpec = tween(300))
            },
            popEnterTransition = {
                slideInHorizontally(
                    initialOffsetX = { fullWidth -> -fullWidth },
                    animationSpec  = tween(300)
                ) + fadeIn(animationSpec = tween(300))
            },
            popExitTransition  = {
                slideOutHorizontally(
                    targetOffsetX = { fullWidth -> fullWidth },
                    animationSpec = tween(300)
                ) + fadeOut(animationSpec = tween(300))
            }
        ) {
            // ── Auth Flow ──────────────────────────────────────────────────────
            composable(Screen.Splash.route) {
                SplashScreen(navController = rootNavController)
            }

            composable(Screen.Login.route) {
                LoginScreen(navController = rootNavController)
            }

            composable(Screen.Register.route) {
                RegisterScreen(navController = rootNavController)
            }

            composable(Screen.ForgotPassword.route) {
                ForgotPasswordScreen(navController = rootNavController)
            }

            // ── Main App ───────────────────────────────────────────────────────
            composable(Screen.Home.route) {
                HomeScreen(
                    onNavigateToMonument = { monumentId ->
                        rootNavController.navigate(Screen.MonumentDetail.createRoute(monumentId))
                    },
                    onNavigateToSettings = {
                        rootNavController.navigate(Screen.Settings.route)
                    }
                )
            }

            composable(Screen.Explore.route) {
                ExploreScreen(
                    onNavigateToMonument = { monumentId ->
                        rootNavController.navigate(Screen.MonumentDetail.createRoute(monumentId))
                    }
                )
            }

            composable(Screen.Favorites.route) {
                FavoritesScreen(
                    onNavigateToMonument = { monumentId ->
                        rootNavController.navigate(Screen.MonumentDetail.createRoute(monumentId))
                    }
                )
            }

            composable(Screen.Profile.route) {
                ProfileScreen(
                    onNavigateToSettings = {
                        rootNavController.navigate(Screen.Settings.route)
                    },
                    onLogout = {
                        rootNavController.navigate(Screen.Login.route) {
                            popUpTo(0) { inclusive = true }
                        }
                    }
                )
            }

            composable(Screen.Settings.route) {
                SettingsScreen(navController = rootNavController)
            }

            // ── Monument Detail ────────────────────────────────────────────────
            composable(
                route     = Screen.MonumentDetail.route,
                arguments = listOf(
                    navArgument(Screen.MonumentDetail.ARG_MONUMENT_ID) {
                        type = NavType.StringType
                    }
                )
            ) { backStackEntry ->
                val monumentId = backStackEntry.arguments?.getString(Screen.MonumentDetail.ARG_MONUMENT_ID) ?: ""
                MonumentDetailScreen(
                    navController = rootNavController,
                    monumentId    = monumentId
                )
            }

            // ── AR View Scanner ───────────────────────────────────────────────
            composable(
                route     = Screen.ArScanner.route,
                arguments = listOf(
                    navArgument(Screen.ArScanner.ARG_MONUMENT_ID) {
                        type = NavType.StringType
                    }
                )
            ) { backStackEntry ->
                val monumentId = backStackEntry.arguments?.getString(Screen.ArScanner.ARG_MONUMENT_ID) ?: ""
                ArScreen(
                    monumentId = monumentId,
                    onClose    = { rootNavController.popBackStack() }
                )
            }
        }
    }
}

