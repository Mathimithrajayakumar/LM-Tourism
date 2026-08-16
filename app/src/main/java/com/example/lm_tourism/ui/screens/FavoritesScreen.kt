package com.example.lm_tourism.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.lm_tourism.ui.components.EmptyState
import com.example.lm_tourism.ui.components.ErrorScreen
import com.example.lm_tourism.ui.components.LoadingIndicator
import com.example.lm_tourism.ui.components.MonumentListCard
import com.example.lm_tourism.viewmodel.FavoritesUiState
import com.example.lm_tourism.viewmodel.FavoritesViewModel

@Composable
fun FavoritesScreen(
    onNavigateToMonument: (String) -> Unit,
    viewModel: FavoritesViewModel = viewModel()
) {
    val uiState   by viewModel.uiState.collectAsStateWithLifecycle()
    val favorites by viewModel.favorites.collectAsStateWithLifecycle()

    // Refresh whenever the screen becomes active
    LaunchedEffect(Unit) { viewModel.loadFavorites() }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        // ─── Header ───────────────────────────────────────────────────
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(MaterialTheme.colorScheme.surface)
                .statusBarsPadding()
                .padding(horizontal = 20.dp, vertical = 16.dp)
        ) {
            Text(
                text = "My Favourites",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold
            )
            if (favorites.isNotEmpty()) {
                Text(
                    text = "${favorites.size} saved monument${if (favorites.size != 1) "s" else ""}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }

        HorizontalDivider()

        // ─── Content ──────────────────────────────────────────────────
        when (uiState) {
            FavoritesUiState.Loading -> LoadingIndicator(message = "Loading favourites…")

            FavoritesUiState.Empty -> EmptyState(
                icon     = Icons.Outlined.FavoriteBorder,
                title    = "No favourites yet",
                subtitle = "Explore monuments and tap ♡ to save your favourites here.",
                modifier = Modifier.padding(top = 64.dp)
            )

            is FavoritesUiState.Error -> ErrorScreen(
                message = (uiState as FavoritesUiState.Error).message,
                onRetry = viewModel::loadFavorites
            )

            FavoritesUiState.Success -> {
                LazyColumn(
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 12.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(favorites, key = { it.id }) { monument ->
                        MonumentListCard(
                            monument        = monument.copy(isFavorite = true),
                            onClick         = { onNavigateToMonument(monument.id) },
                            onFavoriteClick = { viewModel.removeFavorite(monument.id) }
                        )
                    }
                }
            }
        }
    }
}
