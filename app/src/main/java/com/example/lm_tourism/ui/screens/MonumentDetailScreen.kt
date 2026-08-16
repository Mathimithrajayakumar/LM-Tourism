package com.example.lm_tourism.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import coil.compose.AsyncImage
import com.example.lm_tourism.model.Monument
import com.example.lm_tourism.ui.components.ErrorScreen
import com.example.lm_tourism.ui.components.LoadingIndicator
import com.example.lm_tourism.ui.theme.*
import com.example.lm_tourism.utils.toEntryFeeString
import com.example.lm_tourism.viewmodel.MonumentDetailViewModel

@Composable
fun MonumentDetailScreen(
    navController: NavController,
    monumentId: String,
    viewModel: MonumentDetailViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(monumentId) {
        viewModel.loadMonument(monumentId)
    }

    LaunchedEffect(uiState.snackbarMessage) {
        uiState.snackbarMessage?.let {
            snackbarHostState.showSnackbar(it)
            viewModel.clearSnackbar()
        }
    }

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) },
        containerColor = MaterialTheme.colorScheme.background
    ) { padding ->
        when {
            uiState.isLoading -> LoadingIndicator()

            uiState.errorMessage != null -> ErrorScreen(
                message = uiState.errorMessage!!,
                onRetry = { viewModel.loadMonument(monumentId) }
            )

            uiState.monument != null -> {
                MonumentDetailContent(
                    monument    = uiState.monument!!,
                    isFavorite  = uiState.isFavorite,
                    onBack      = { navController.popBackStack() },
                    onFavorite  = viewModel::toggleFavorite,
                    onAI        = viewModel::onAiButtonClicked,
                    onListen    = viewModel::onListenButtonClicked,
                    onAR        = { navController.navigate(Screen.ArScanner.createRoute(monumentId)) },
                    modifier    = Modifier.padding(padding)
                )
            }
        }
    }
}

@Composable
private fun MonumentDetailContent(
    monument: Monument,
    isFavorite: Boolean,
    onBack: () -> Unit,
    onFavorite: () -> Unit,
    onAI: () -> Unit,
    onListen: () -> Unit,
    onAR: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(modifier = modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
        ) {
            // ── Hero Image ────────────────────────────────────────────────────
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(300.dp)
            ) {
                AsyncImage(
                    model              = monument.imageUrl,
                    contentDescription = monument.name,
                    contentScale       = ContentScale.Crop,
                    modifier           = Modifier.fillMaxSize()
                )

                // Gradient overlay
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.verticalGradient(
                                colors = listOf(
                                    NavyBlue.copy(alpha = 0.6f),
                                    Color.Transparent,
                                    NavyBlue.copy(alpha = 0.8f)
                                )
                            )
                        )
                )

                // Back button
                IconButton(
                    onClick  = onBack,
                    modifier = Modifier
                        .padding(16.dp)
                        .align(Alignment.TopStart)
                        .background(NavyBlue.copy(alpha = 0.6f), RoundedCornerShape(50))
                ) {
                    Icon(Icons.Filled.ArrowBack, "Back", tint = Color.White)
                }

                // Favorite button
                IconButton(
                    onClick  = onFavorite,
                    modifier = Modifier
                        .padding(16.dp)
                        .align(Alignment.TopEnd)
                        .background(NavyBlue.copy(alpha = 0.6f), RoundedCornerShape(50))
                ) {
                    Icon(
                        imageVector        = if (isFavorite) Icons.Filled.Favorite else Icons.Filled.FavoriteBorder,
                        contentDescription = "Favorite",
                        tint               = if (isFavorite) Color.Red else Color.White
                    )
                }

                // Monument name overlay at bottom of image
                Column(
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .padding(16.dp)
                ) {
                    if (monument.unescoStatus) {
                        Surface(
                            shape = RoundedCornerShape(6.dp),
                            color = GoldenAmber
                        ) {
                            Text(
                                "🏛 UNESCO World Heritage",
                                modifier   = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                style      = MaterialTheme.typography.labelSmall,
                                color      = NavyBlue,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                    }
                    Text(
                        text       = monument.name,
                        style      = MaterialTheme.typography.headlineMedium,
                        color      = Color.White,
                        fontWeight = FontWeight.Bold
                    )
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Filled.LocationOn, null, tint = SkyBlue, modifier = Modifier.size(16.dp))
                        Text(
                            "${monument.city}, ${monument.state}",
                            color = Color.White.copy(alpha = 0.9f),
                            style = MaterialTheme.typography.bodyMedium
                        )
                    }
                }
            }

            // ── Quick Stats ────────────────────────────────────────────────────
            Row(
                modifier              = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                QuickStat(Icons.Filled.Star, "%.1f".format(monument.rating), "Rating", GoldenAmber)
                QuickStat(Icons.Filled.AttachMoney, monument.entryFee.toEntryFeeString(), "Entry")
                QuickStat(Icons.Filled.Schedule, monument.openingTime, "Opens")
                QuickStat(Icons.Filled.DateRange, if (monument.year > 0) "${monument.year}" else "Old", "Year")
            }

            HorizontalDivider(modifier = Modifier.padding(horizontal = 16.dp), color = MaterialTheme.colorScheme.outline.copy(alpha = 0.3f))

            // ── Action Buttons ─────────────────────────────────────────────────
            Row(
                modifier              = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                ActionButton(Icons.Filled.Map, "Navigate", Modifier.weight(1f)) { }
                ActionButton(Icons.Filled.SmartToy, "Ask AI", Modifier.weight(1f), onAI)
                ActionButton(Icons.Filled.VolumeUp, "Listen", Modifier.weight(1f), onListen)
                ActionButton(Icons.Filled.ViewInAr, "AR View", Modifier.weight(1f), onAR)
            }

            // ── Description ────────────────────────────────────────────────────
            DetailSection("About") {
                Text(
                    text  = monument.description,
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }

            // ── History ────────────────────────────────────────────────────────
            if (monument.history.isNotBlank()) {
                DetailSection("History") {
                    Text(monument.history, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }

            // ── Architecture ───────────────────────────────────────────────────
            if (monument.architecture.isNotBlank()) {
                DetailSection("Architecture") {
                    Text(monument.architecture, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }

            // ── Visitor Info ───────────────────────────────────────────────────
            DetailSection("Visitor Information") {
                VisitorInfoRow(Icons.Filled.Schedule, "Opening Hours", "${monument.openingTime} – ${monument.closingTime}")
                VisitorInfoRow(Icons.Filled.AttachMoney, "Entry Fee", monument.entryFee.toEntryFeeString())
                VisitorInfoRow(Icons.Filled.WbSunny, "Best Time to Visit", monument.bestVisitingTime)
                VisitorInfoRow(Icons.Filled.Build, "Built By", monument.builtBy)
            }

            // ── Tags ───────────────────────────────────────────────────────────
            if (monument.tags.isNotEmpty()) {
                DetailSection("Tags") {
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        monument.tags.take(4).forEach { tag ->
                            AssistChip(onClick = {}, label = { Text(tag, style = MaterialTheme.typography.labelSmall) })
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}

@Composable
private fun QuickStat(icon: ImageVector, value: String, label: String, tint: Color = MaterialTheme.colorScheme.primary) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Icon(icon, null, tint = tint, modifier = Modifier.size(22.dp))
        Spacer(modifier = Modifier.height(4.dp))
        Text(value, style = MaterialTheme.typography.labelLarge, fontWeight = FontWeight.Bold)
        Text(label, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@Composable
private fun ActionButton(icon: ImageVector, label: String, modifier: Modifier = Modifier, onClick: () -> Unit) {
    FilledTonalButton(
        onClick  = onClick,
        modifier = modifier.height(52.dp),
        shape    = RoundedCornerShape(12.dp)
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(icon, null, modifier = Modifier.size(18.dp))
            Text(label, style = MaterialTheme.typography.labelSmall)
        }
    }
}

@Composable
private fun DetailSection(title: String, content: @Composable ColumnScope.() -> Unit) {
    Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp)) {
        Text(title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, modifier = Modifier.padding(bottom = 8.dp))
        content()
    }
    HorizontalDivider(modifier = Modifier.padding(horizontal = 16.dp), color = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f))
}

@Composable
private fun VisitorInfoRow(icon: ImageVector, label: String, value: String) {
    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
        Icon(icon, null, tint = RoyalBlue, modifier = Modifier.size(18.dp))
        Spacer(modifier = Modifier.width(12.dp))
        Column {
            Text(label, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Text(value, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Medium)
        }
    }
}
