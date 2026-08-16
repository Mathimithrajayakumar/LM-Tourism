package com.example.lm_tourism.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.AsyncImage
import com.example.lm_tourism.model.User
import com.example.lm_tourism.ui.components.LoadingIndicator
import com.example.lm_tourism.viewmodel.ProfileUiState
import com.example.lm_tourism.viewmodel.ProfileViewModel

@Composable
fun ProfileScreen(
    onNavigateToSettings: () -> Unit,
    onLogout: () -> Unit,
    viewModel: ProfileViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val user    by viewModel.user.collectAsStateWithLifecycle()
    val isGuest by viewModel.isGuest.collectAsStateWithLifecycle()

    var showLogoutDialog by remember { mutableStateOf(false) }

    if (showLogoutDialog) {
        AlertDialog(
            onDismissRequest = { showLogoutDialog = false },
            title  = { Text("Sign Out?") },
            text   = { Text("Are you sure you want to sign out of LM Tourism?") },
            confirmButton = {
                TextButton(onClick = {
                    showLogoutDialog = false
                    viewModel.signOut()
                    onLogout()
                }) {
                    Text("Sign Out", color = MaterialTheme.colorScheme.error)
                }
            },
            dismissButton = {
                TextButton(onClick = { showLogoutDialog = false }) { Text("Cancel") }
            }
        )
    }

    when (uiState) {
        ProfileUiState.Loading -> LoadingIndicator()
        is ProfileUiState.Error -> {
            // Show profile with fallback data
        }
        ProfileUiState.Success -> Unit
    }

    user?.let { u ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .verticalScroll(rememberScrollState())
        ) {
            // ─── Profile Header ───────────────────────────────────────
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(
                                MaterialTheme.colorScheme.primary,
                                MaterialTheme.colorScheme.primary.copy(alpha = 0.8f)
                            )
                        )
                    )
                    .statusBarsPadding()
                    .padding(20.dp)
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
                    // Avatar
                    Box(
                        modifier = Modifier
                            .size(96.dp)
                            .clip(CircleShape)
                            .background(Color.White.copy(alpha = 0.2f)),
                        contentAlignment = Alignment.Center
                    ) {
                        if (u.profileImageUrl.isNotBlank()) {
                            AsyncImage(
                                model = u.profileImageUrl,
                                contentDescription = "Profile",
                                modifier = Modifier.fillMaxSize(),
                                contentScale = ContentScale.Crop
                            )
                        } else {
                            Icon(Icons.Default.Person, null, modifier = Modifier.size(56.dp), tint = Color.White)
                        }
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(u.name.ifBlank { "Explorer" }, style = MaterialTheme.typography.headlineSmall, color = Color.White, fontWeight = FontWeight.Bold)
                    Text(u.email, style = MaterialTheme.typography.bodyMedium, color = Color.White.copy(alpha = 0.85f))

                    if (isGuest) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Surface(shape = RoundedCornerShape(16.dp), color = Color.White.copy(alpha = 0.2f)) {
                            Text("Guest Mode", style = MaterialTheme.typography.labelMedium, color = Color.White, modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp))
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Stats row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceEvenly
                    ) {
                        ProfileStat("Favourites", u.favoriteCount.toString())
                        ProfileStat("Places Visited", "0")
                        ProfileStat("Reviews", "0")
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // ─── Account Section ──────────────────────────────────────
            ProfileSection(title = "Account") {
                ProfileMenuItem(Icons.Default.Edit, "Edit Profile") { }
                ProfileMenuItem(Icons.Default.Favorite, "My Favourites") { }
                ProfileMenuItem(Icons.Default.History, "Visit History") { }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // ─── App Section ──────────────────────────────────────────
            ProfileSection(title = "App") {
                ProfileMenuItem(Icons.Default.Settings, "Settings") { onNavigateToSettings() }
                ProfileMenuItem(Icons.Default.Notifications, "Notifications") { }
                ProfileMenuItem(Icons.Default.Language, "Language") { }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // ─── Sign Out ─────────────────────────────────────────────
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                shape = RoundedCornerShape(16.dp)
            ) {
                ListItem(
                    headlineContent = {
                        Text("Sign Out", color = MaterialTheme.colorScheme.error, fontWeight = FontWeight.SemiBold)
                    },
                    leadingContent = {
                        Icon(Icons.Default.Logout, null, tint = MaterialTheme.colorScheme.error)
                    },
                    modifier = Modifier.clickableWithRipple { showLogoutDialog = true }
                )
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@Composable
private fun ProfileStat(label: String, value: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(value, style = MaterialTheme.typography.titleLarge, color = Color.White, fontWeight = FontWeight.Bold)
        Text(label, style = MaterialTheme.typography.labelSmall, color = Color.White.copy(alpha = 0.8f))
    }
}

@Composable
private fun ProfileSection(title: String, content: @Composable () -> Unit) {
    Column(modifier = Modifier.padding(horizontal = 16.dp)) {
        Text(title, style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.padding(start = 4.dp, bottom = 6.dp))
        Card(shape = RoundedCornerShape(16.dp)) {
            content()
        }
    }
}

@Composable
private fun ProfileMenuItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    onClick: () -> Unit
) {
    ListItem(
        headlineContent  = { Text(title) },
        leadingContent   = { Icon(icon, null, tint = MaterialTheme.colorScheme.primary) },
        trailingContent  = { Icon(Icons.Default.ChevronRight, null, tint = MaterialTheme.colorScheme.onSurfaceVariant) },
        modifier = Modifier.clickableWithRipple(onClick)
    )
    HorizontalDivider(modifier = Modifier.padding(start = 56.dp), thickness = 0.5.dp)
}

// Extension to avoid the annoying Modifier.clickable import repetition
private fun Modifier.clickableWithRipple(onClick: () -> Unit) = this.then(
    Modifier.clickable(onClick = onClick)
)
