package com.example.lm_tourism.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.lm_tourism.navigation.Screen
import com.example.lm_tourism.ui.components.*
import com.example.lm_tourism.viewmodel.HomeUiState
import com.example.lm_tourism.viewmodel.HomeViewModel

@Composable
fun HomeScreen(
    onNavigateToMonument: (String) -> Unit,
    onNavigateToSettings: () -> Unit,
    viewModel: HomeViewModel = viewModel()
) {
    val uiState          by viewModel.uiState.collectAsStateWithLifecycle()
    val featured         by viewModel.featuredMonuments.collectAsStateWithLifecycle()
    val popular          by viewModel.popularMonuments.collectAsStateWithLifecycle()
    val nearby           by viewModel.nearbyMonuments.collectAsStateWithLifecycle()
    val searchQuery      by viewModel.searchQuery.collectAsStateWithLifecycle()

    when (uiState) {
        HomeUiState.Loading -> LoadingIndicator(message = "Loading monuments…")
        is HomeUiState.Error -> {
            // Show error but still render content from local data
        }
        else -> Unit
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(bottom = 24.dp)
    ) {
        // ─── Hero Header ─────────────────────────────────────────────
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(
                                MaterialTheme.colorScheme.primary,
                                MaterialTheme.colorScheme.primary.copy(alpha = 0.85f)
                            )
                        )
                    )
                    .statusBarsPadding()
                    .padding(horizontal = 20.dp, vertical = 20.dp)
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "Good day! 👋",
                                style = MaterialTheme.typography.bodyLarge,
                                color = Color.White.copy(alpha = 0.85f)
                            )
                            Text(
                                text = "Explore India",
                                style = MaterialTheme.typography.headlineMedium,
                                color = Color.White,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        // Settings icon
                        IconButton(
                            onClick = onNavigateToSettings,
                            modifier = Modifier
                                .size(40.dp)
                                .background(Color.White.copy(alpha = 0.2f), CircleShape)
                        ) {
                            Icon(Icons.Default.Settings, "Settings", tint = Color.White)
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Search Bar
                    LmSearchBar(
                        query = searchQuery,
                        onQueryChange = viewModel::updateSearchQuery,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }
        }

        // ─── Quick Actions ────────────────────────────────────────────
        item {
            Spacer(modifier = Modifier.height(20.dp))
            Text(
                text = "Quick Actions",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(horizontal = 20.dp)
            )
            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                QuickActionButton(
                    icon = Icons.Default.Explore,
                    label = "Explore",
                    color = MaterialTheme.colorScheme.primaryContainer,
                    iconTint = MaterialTheme.colorScheme.onPrimaryContainer,
                    onClick = { }
                )
                QuickActionButton(
                    icon = Icons.Default.SmartToy,
                    label = "AI Guide",
                    color = MaterialTheme.colorScheme.secondaryContainer,
                    iconTint = MaterialTheme.colorScheme.onSecondaryContainer,
                    onClick = { },
                    comingSoon = true
                )
                QuickActionButton(
                    icon = Icons.Default.ViewInAr,
                    label = "AR Scan",
                    color = MaterialTheme.colorScheme.tertiaryContainer,
                    iconTint = MaterialTheme.colorScheme.onTertiaryContainer,
                    onClick = { },
                    comingSoon = true
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                QuickActionButton(
                    icon = Icons.Default.ConfirmationNumber,
                    label = "Book Tickets",
                    color = Color(0xFFFFF3E0),
                    iconTint = Color(0xFFE65100),
                    onClick = { }
                )
                QuickActionButton(
                    icon = Icons.Default.Map,
                    label = "Maps",
                    color = Color(0xFFE8F5E9),
                    iconTint = Color(0xFF2E7D32),
                    onClick = { }
                )
                QuickActionButton(
                    icon = Icons.Default.Person,
                    label = "Profile",
                    color = MaterialTheme.colorScheme.surfaceVariant,
                    iconTint = MaterialTheme.colorScheme.onSurfaceVariant,
                    onClick = { }
                )
            }
        }

        // ─── Featured Monuments ───────────────────────────────────────
        item {
            Spacer(modifier = Modifier.height(24.dp))
            SectionHeader(title = "Featured Monuments", onSeeAll = {})
            Spacer(modifier = Modifier.height(12.dp))

            if (featured.isEmpty() && uiState == HomeUiState.Loading) {
                LoadingRowPlaceholder()
            } else {
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 20.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(featured, key = { it.id }) { monument ->
                        FeaturedMonumentCard(
                            monument = monument,
                            onClick  = { onNavigateToMonument(monument.id) }
                        )
                    }
                }
            }
        }

        // ─── Popular Destinations ─────────────────────────────────────
        item {
            Spacer(modifier = Modifier.height(24.dp))
            SectionHeader(title = "Popular Destinations", onSeeAll = {})
            Spacer(modifier = Modifier.height(12.dp))

            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(popular.take(6), key = { it.id }) { monument ->
                    FeaturedMonumentCard(
                        monument = monument,
                        onClick  = { onNavigateToMonument(monument.id) }
                    )
                }
            }
        }

        // ─── Nearby Attractions ───────────────────────────────────────
        item {
            Spacer(modifier = Modifier.height(24.dp))
            SectionHeader(title = "Nearby Attractions", onSeeAll = {})
            Spacer(modifier = Modifier.height(12.dp))

            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(nearby, key = { it.id + "_nearby" }) { monument ->
                    CompactMonumentCard(
                        monument = monument,
                        onClick  = { onNavigateToMonument(monument.id) }
                    )
                }
            }
        }
    }
}

// ─── Section Header ───────────────────────────────────────────────────────

@Composable
private fun SectionHeader(
    title: String,
    onSeeAll: () -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = title,
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold
        )
        TextButton(onClick = onSeeAll) { Text("See all") }
    }
}

// ─── Quick Action Button ──────────────────────────────────────────────────

@Composable
private fun QuickActionButton(
    icon: ImageVector,
    label: String,
    color: Color,
    iconTint: Color,
    onClick: () -> Unit,
    comingSoon: Boolean = false,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.width(90.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box {
            Surface(
                onClick = onClick,
                modifier = Modifier.size(64.dp),
                shape = RoundedCornerShape(16.dp),
                color = color,
                tonalElevation = 2.dp
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(icon, contentDescription = label, tint = iconTint, modifier = Modifier.size(28.dp))
                }
            }
            if (comingSoon) {
                Surface(
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .offset(x = 4.dp, y = (-4).dp),
                    shape = RoundedCornerShape(4.dp),
                    color = MaterialTheme.colorScheme.tertiary
                ) {
                    Text(
                        text = "Soon",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onTertiary,
                        modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp)
                    )
                }
            }
        }
        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Medium
        )
    }
}

@Composable
private fun LoadingRowPlaceholder() {
    LazyRow(
        contentPadding = PaddingValues(horizontal = 20.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(3) {
            Card(
                modifier = Modifier
                    .width(280.dp)
                    .height(190.dp),
                shape = RoundedCornerShape(16.dp)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(MaterialTheme.colorScheme.surfaceVariant)
                )
            }
        }
    }
}
