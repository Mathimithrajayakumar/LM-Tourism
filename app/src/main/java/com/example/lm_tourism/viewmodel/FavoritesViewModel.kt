package com.example.lm_tourism.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.lm_tourism.model.Monument
import com.example.lm_tourism.repository.FavoritesRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed class FavoritesUiState {
    object Loading : FavoritesUiState()
    object Empty   : FavoritesUiState()
    object Success : FavoritesUiState()
    data class Error(val message: String) : FavoritesUiState()
}

/** ViewModel for the Favourites screen. */
class FavoritesViewModel : ViewModel() {

    private val favoritesRepository = FavoritesRepository()

    private val _uiState   = MutableStateFlow<FavoritesUiState>(FavoritesUiState.Loading)
    val uiState: StateFlow<FavoritesUiState> = _uiState.asStateFlow()

    private val _favorites = MutableStateFlow<List<Monument>>(emptyList())
    val favorites: StateFlow<List<Monument>> = _favorites.asStateFlow()

    init { loadFavorites() }

    fun loadFavorites() {
        viewModelScope.launch {
            _uiState.value = FavoritesUiState.Loading
            val result = favoritesRepository.getFavorites()
            result.fold(
                onSuccess = { list ->
                    _favorites.value = list
                    _uiState.value   = if (list.isEmpty()) FavoritesUiState.Empty else FavoritesUiState.Success
                },
                onFailure = { e ->
                    _uiState.value = FavoritesUiState.Error(e.message ?: "Failed to load favourites")
                }
            )
        }
    }

    fun removeFavorite(monumentId: String) {
        viewModelScope.launch {
            favoritesRepository.removeFavorite(monumentId)
            _favorites.value = _favorites.value.filter { it.id != monumentId }
            if (_favorites.value.isEmpty()) _uiState.value = FavoritesUiState.Empty
        }
    }
}
