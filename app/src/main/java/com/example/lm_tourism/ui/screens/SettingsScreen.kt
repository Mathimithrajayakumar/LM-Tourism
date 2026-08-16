package com.example.lm_tourism.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.example.lm_tourism.viewmodel.AppLanguage
import com.example.lm_tourism.viewmodel.SettingsViewModel

@Composable
fun SettingsScreen(
    navController: NavController,
    viewModel: SettingsViewModel = viewModel()
) {
    val isDarkMode           by viewModel.isDarkMode.collectAsStateWithLifecycle()
    val notificationsEnabled by viewModel.notificationsEnabled.collectAsStateWithLifecycle()
    val selectedLanguage     by viewModel.selectedLanguage.collectAsStateWithLifecycle()

    var showLanguageDialog   by remember { mutableStateOf(false) }
    var showAboutDialog      by remember { mutableStateOf(false) }

    if (showLanguageDialog) {
        LanguagePickerDialog(
            currentLanguage = selectedLanguage,
            onSelect = {
                viewModel.selectLanguage(it)
                showLanguageDialog = false
            },
            onDismiss = { showLanguageDialog = false }
        )
    }

    if (showAboutDialog) {
        AlertDialog(
            onDismissRequest = { showAboutDialog = false },
            title  = { Text("About LM Tourism") },
            text   = {
                Column {
                    Text("Version 1.0.0")
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("LM Tourism uses Augmented Reality and Generative AI to provide interactive historical information for monuments and tourist locations across India.")
                }
            },
            confirmButton = {
                TextButton(onClick = { showAboutDialog = false }) { Text("OK") }
            }
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(rememberScrollState())
    ) {
        // ─── Top App Bar ──────────────────────────────────────────────
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(MaterialTheme.colorScheme.surface)
                .statusBarsPadding()
                .padding(horizontal = 8.dp, vertical = 8.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = { navController.navigateUp() }) {
                    Icon(Icons.Default.ArrowBack, "Back")
                }
                Text(
                    text = "Settings",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        HorizontalDivider()
        Spacer(modifier = Modifier.height(16.dp))

        // ─── Appearance ───────────────────────────────────────────────
        SettingsSection(title = "Appearance") {
            SettingsSwitchItem(
                icon    = if (isDarkMode) Icons.Default.DarkMode else Icons.Default.LightMode,
                title   = "Dark Mode",
                subtitle = if (isDarkMode) "Dark theme is on" else "Light theme is on",
                checked = isDarkMode,
                onToggle = viewModel::toggleDarkMode
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        // ─── General ─────────────────────────────────────────────────
        SettingsSection(title = "General") {
            SettingsClickItem(
                icon    = Icons.Default.Language,
                title   = "Language",
                subtitle = selectedLanguage.displayName,
                onClick = { showLanguageDialog = true }
            )
            SettingsSwitchItem(
                icon     = Icons.Default.Notifications,
                title    = "Push Notifications",
                subtitle = if (notificationsEnabled) "You'll receive monument alerts" else "Notifications are off",
                checked  = notificationsEnabled,
                onToggle = viewModel::toggleNotifications
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        // ─── About ────────────────────────────────────────────────────
        SettingsSection(title = "About") {
            SettingsClickItem(
                icon    = Icons.Default.Info,
                title   = "About App",
                subtitle = "LM Tourism v1.0.0",
                onClick = { showAboutDialog = true }
            )
            SettingsClickItem(
                icon    = Icons.Default.PrivacyTip,
                title   = "Privacy Policy",
                subtitle = "View our privacy policy",
                onClick = { /* Open browser in Phase 2 */ }
            )
            SettingsClickItem(
                icon    = Icons.Default.HelpOutline,
                title   = "Help & Support",
                subtitle = "Get help using the app",
                onClick = { }
            )
        }

        Spacer(modifier = Modifier.height(40.dp))
    }
}

// ─── Settings Section Container ───────────────────────────────────────────

@Composable
private fun SettingsSection(title: String, content: @Composable () -> Unit) {
    Column(modifier = Modifier.padding(horizontal = 16.dp)) {
        Text(
            text = title,
            style = MaterialTheme.typography.labelLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(start = 4.dp, bottom = 6.dp)
        )
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
        ) {
            content()
        }
    }
}

// ─── Switch settings item ─────────────────────────────────────────────────

@Composable
private fun SettingsSwitchItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    subtitle: String,
    checked: Boolean,
    onToggle: () -> Unit
) {
    ListItem(
        headlineContent  = { Text(title, fontWeight = FontWeight.Medium) },
        supportingContent = { Text(subtitle, style = MaterialTheme.typography.bodySmall) },
        leadingContent   = { Icon(icon, null, tint = MaterialTheme.colorScheme.primary) },
        trailingContent  = {
            Switch(
                checked = checked,
                onCheckedChange = { onToggle() }
            )
        },
        modifier = Modifier.clickable { onToggle() }
    )
    HorizontalDivider(modifier = Modifier.padding(start = 56.dp), thickness = 0.5.dp)
}

// ─── Click-to-navigate settings item ─────────────────────────────────────

@Composable
private fun SettingsClickItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    subtitle: String,
    onClick: () -> Unit
) {
    ListItem(
        headlineContent  = { Text(title, fontWeight = FontWeight.Medium) },
        supportingContent = { Text(subtitle, style = MaterialTheme.typography.bodySmall) },
        leadingContent   = { Icon(icon, null, tint = MaterialTheme.colorScheme.primary) },
        trailingContent  = { Icon(Icons.Default.ChevronRight, null, tint = MaterialTheme.colorScheme.onSurfaceVariant) },
        modifier = Modifier.clickable(onClick = onClick)
    )
    HorizontalDivider(modifier = Modifier.padding(start = 56.dp), thickness = 0.5.dp)
}

// ─── Language Picker Dialog ───────────────────────────────────────────────

@Composable
private fun LanguagePickerDialog(
    currentLanguage: AppLanguage,
    onSelect: (AppLanguage) -> Unit,
    onDismiss: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title   = { Text("Select Language") },
        text    = {
            Column {
                AppLanguage.entries.forEach { lang ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onSelect(lang) }
                            .padding(vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = lang == currentLanguage,
                            onClick  = { onSelect(lang) }
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(lang.displayName, style = MaterialTheme.typography.bodyLarge)
                    }
                }
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) { Text("Close") }
        }
    )
}
