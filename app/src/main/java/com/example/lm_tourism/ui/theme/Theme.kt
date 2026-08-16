package com.example.lm_tourism.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

// ─── Light Color Scheme ───────────────────────────────────────────────────
private val LightColorScheme = lightColorScheme(
    primary          = Blue40,
    onPrimary        = Color.White,
    primaryContainer = Blue90,
    onPrimaryContainer = Blue10,

    secondary          = Teal40,
    onSecondary        = Color.White,
    secondaryContainer = Teal90,
    onSecondaryContainer = Teal30,

    tertiary          = Orange70,
    onTertiary        = Color.White,
    tertiaryContainer = Orange90,
    onTertiaryContainer = Orange10,

    error          = ErrorRed,
    onError        = Color.White,
    errorContainer = Color(0xFFFFDAD6),
    onErrorContainer = Color(0xFF410002),

    background        = Neutral99,
    onBackground      = Neutral10,
    surface           = Color.White,
    onSurface         = Neutral10,
    surfaceVariant    = NeutralVar90,
    onSurfaceVariant  = NeutralVar30,
    outline           = Color(0xFF73777F),
    outlineVariant    = NeutralVar80,
    inverseSurface    = Neutral20,
    inverseOnSurface  = Neutral95,
    inversePrimary    = Blue80,
    surfaceTint       = Blue40
)

// ─── Dark Color Scheme ────────────────────────────────────────────────────
private val DarkColorScheme = darkColorScheme(
    primary          = Blue80,
    onPrimary        = Blue20,
    primaryContainer = Blue30,
    onPrimaryContainer = Blue90,

    secondary          = Teal80,
    onSecondary        = Teal30,
    secondaryContainer = Teal30,
    onSecondaryContainer = Teal90,

    tertiary          = Orange80,
    onTertiary        = Orange20,
    tertiaryContainer = Orange30,
    onTertiaryContainer = Orange90,

    error          = ErrorRedDk,
    onError        = Color(0xFF690005),
    errorContainer = Color(0xFF93000A),
    onErrorContainer = Color(0xFFFFDAD6),

    background       = Neutral10,
    onBackground     = Neutral90,
    surface          = Neutral10,
    onSurface        = Neutral90,
    surfaceVariant   = NeutralVar30,
    onSurfaceVariant = NeutralVar80,
    outline          = Color(0xFF8D9199),
    outlineVariant   = NeutralVar30,
    inverseSurface   = Neutral90,
    inverseOnSurface = Neutral20,
    inversePrimary   = Blue40,
    surfaceTint      = Blue80
)

/**
 * LM Tourism app theme.
 *
 * @param darkTheme           Whether to use the dark colour scheme.
 * @param dynamicColor        Use Android 12+ dynamic colour (disabled by default so brand colours
 *                            are always applied).
 * @param content             Composable content.
 */
@Composable
fun LmTourismTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else      -> LightColorScheme
    }

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            // Draw behind system bars for edge-to-edge design
            WindowCompat.setDecorFitsSystemWindows(window, false)
            @Suppress("DEPRECATION")
            window.statusBarColor = Color.Transparent.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography  = AppTypography,
        content     = content
    )
}
