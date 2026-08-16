package com.example.lm_tourism.ui.screens

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBalance
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.lm_tourism.navigation.Screen
import com.example.lm_tourism.utils.Constants
import kotlinx.coroutines.delay

/**
 * Splash screen displayed for [Constants.SPLASH_DELAY_MS] ms on app launch.
 *
 * Animation sequence:
 *  1. Logo icon scales in with a bouncy spring (0 ms)
 *  2. App name fades + slides up (400 ms)
 *  3. Tagline fades + slides up (700 ms)
 *  4. Progress indicator fades in (900 ms)
 *  5. Navigate to Login after total delay
 */
@Composable
fun SplashScreen(navController: NavController) {

    var logoVisible    by remember { mutableStateOf(false) }
    var titleVisible   by remember { mutableStateOf(false) }
    var taglineVisible by remember { mutableStateOf(false) }
    var loadingVisible by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        logoVisible  = true
        delay(400)
        titleVisible = true
        delay(300)
        taglineVisible = true
        delay(200)
        loadingVisible = true
        delay(Constants.SPLASH_DELAY_MS - 900)
        navController.navigate(Screen.Login.route) {
            popUpTo(Screen.Splash.route) { inclusive = true }
        }
    }

    // ─── Background ──────────────────────────────────────────────────
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        Color(0xFF1565C0),
                        Color(0xFF0D47A1),
                        Color(0xFF0A2E6E)
                    )
                )
            ),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.padding(horizontal = 40.dp)
        ) {

            // ─── Logo ────────────────────────────────────────────────
            AnimatedVisibility(
                visible = logoVisible,
                enter   = scaleIn(
                    animationSpec = spring(
                        dampingRatio = Spring.DampingRatioMediumBouncy,
                        stiffness    = Spring.StiffnessMedium
                    )
                ) + fadeIn()
            ) {
                Box(
                    modifier = Modifier
                        .size(120.dp)
                        .background(Color.White.copy(alpha = 0.15f), CircleShape)
                        .border(2.dp, Color.White.copy(alpha = 0.25f), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.AccountBalance,
                        contentDescription = "LM Tourism Logo",
                        modifier = Modifier.size(64.dp),
                        tint = Color.White
                    )
                }
            }

            Spacer(modifier = Modifier.height(32.dp))

            // ─── App Name ────────────────────────────────────────────
            AnimatedVisibility(
                visible = titleVisible,
                enter   = slideInVertically(initialOffsetY = { 60 }) + fadeIn(
                    animationSpec = tween(400)
                )
            ) {
                Text(
                    text       = "LM Tourism",
                    style      = MaterialTheme.typography.displaySmall,
                    color      = Color.White,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 2.sp
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            // ─── Tagline ─────────────────────────────────────────────
            AnimatedVisibility(
                visible = taglineVisible,
                enter   = slideInVertically(initialOffsetY = { 40 }) + fadeIn(
                    animationSpec = tween(400)
                )
            ) {
                Text(
                    text      = "Explore History Through AI and AR",
                    style     = MaterialTheme.typography.bodyLarge,
                    color     = Color.White.copy(alpha = 0.85f),
                    textAlign = TextAlign.Center,
                    letterSpacing = 0.5.sp
                )
            }
        }

        // ─── Loading Indicator at bottom ─────────────────────────────
        AnimatedVisibility(
            visible  = loadingVisible,
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 56.dp),
            enter = fadeIn()
        ) {
            CircularProgressIndicator(
                color       = Color.White.copy(alpha = 0.75f),
                modifier    = Modifier.size(32.dp),
                strokeWidth = 2.dp
            )
        }
    }
}
