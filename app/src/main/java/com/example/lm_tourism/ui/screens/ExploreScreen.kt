package com.example.lm_tourism.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Explore
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.lm_tourism.ui.components.*
import com.example.lm_tourism.viewmodel.ExploreUiState
import com.example.lm_tourism.viewmodel.ExploreViewModel

@Composable
fun ExploreScreen(
    onNavigateToMonument: (String) -> Unit,
    viewModel: ExploreViewModel = viewModel()
) {
    val uiState          by viewModel.uiState.collectAsStateWithLifecycle()
    val monuments        by viewModel.monuments.collectAsStateWithLifecycle()
    val searchQuery      by viewModel.searchQuery.collectAsStateWithLifecycle()
    val categories       by viewModel.categories.collectAsStateWithLifecycle()
    val selectedCategory by viewModel.selectedCategory.collectAsStateWithLifecycle()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        // ─── Top Bar ─────────────────────────────────────────────────
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(MaterialTheme.colorScheme.surface)
                .statusBarsPadding()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text(
                text = "Explore Monuments",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold
            )
            LmSearchBar(
                query         = searchQuery,
                onQueryChange = viewModel::updateSearchQuery,
                placeholder   = "Search monuments, cities, states…"
            )
        }

        // ─── Category Filter Chips ────────────────────────────────────
        if (categories.isNotEmpty()) {
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                item {
                    FilterChip(
                        selected = selectedCategory == null,
                        onClick  = { viewModel.selectCategory(null) },
                        label    = { Text("All") },
                        shape    = RoundedCornerShape(20.dp)
                    )
                }
                items(categories) { category ->
                    FilterChip(
                        selected = selectedCategory == category,
                        onClick  = { viewModel.selectCategory(category) },
                        label    = { Text(category) },
                        shape    = RoundedCornerShape(20.dp)
                    )
                }
            }
        }

        HorizontalDivider()

        // ─── Content ──────────────────────────────────────────────────
        when (uiState) {
            ExploreUiState.Loading -> LoadingIndicator(message = "Loading monuments…")

            ExploreUiState.Empty -> EmptyState(
                icon     = Icons.Outlined.Explore,
                title    = "No monuments found",
                subtitle = if (searchQuery.isBlank())
                    "No monuments available. Check your connection."
                else
                    "No results for \"$searchQuery\". Try a different search."
            )

            is ExploreUiState.Error -> ErrorScreen(
                message = (uiState as ExploreUiState.Error).message,
                onRetry = viewModel::refresh
            )

            ExploreUiState.Success -> {
                LazyColumn(
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 12.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    item {
                        Text(
                            text = "${monuments.size} monument${if (monuments.size != 1) "s" else ""} found",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                    }
                    items(monuments, key = { it.id }) { monument ->
                        MonumentListCard(
                            monument        = monument,
                            onClick         = { onNavigateToMonument(monument.id) },
                            onFavoriteClick = { /* handled in detail */ }
                        )
                    }
                }
            }
        }
    }
}
