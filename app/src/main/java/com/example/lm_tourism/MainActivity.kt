package com.example.lm_tourism

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.navigation.compose.rememberNavController
import com.example.lm_tourism.navigation.LmNavGraph
import com.example.lm_tourism.ui.theme.LmTourismTheme

/**
 * Single Activity entry point for the LM Tourism app.
 *
 * Responsibilities:
 * 1. Install the system splash screen (core-splashscreen API).
 * 2. Enable edge-to-edge rendering so the app draws behind status bars.
 * 3. Set the Compose content root with [LmTourismTheme] and [LmNavGraph].
 *
 * All navigation, UI state, and data are managed in:
 *   - [LmNavGraph] — navigation routing
 *   - [ViewModel] subclasses — UI state
 *   - [Repository] subclasses — data layer
 */
class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // Install system splash screen before super.onCreate()
        installSplashScreen()

        super.onCreate(savedInstanceState)

        // Draw behind system bars for a truly edge-to-edge experience
        enableEdgeToEdge()

        setContent {
            LmTourismApp()
        }
    }
}

@Composable
private fun LmTourismApp() {
    // In Phase 2, SettingsViewModel will provide the dark mode state here
    // so the theme reacts dynamically to the toggle in Settings screen.
    LmTourismTheme(darkTheme = false) {
        Surface(modifier = Modifier.fillMaxSize()) {
            val navController = rememberNavController()
            LmNavGraph(rootNavController = navController)
        }
    }
}
