package com.example.lm_tourism.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.lm_tourism.model.Monument
import com.example.lm_tourism.repository.FavoritesRepository
import com.example.lm_tourism.repository.MonumentRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class MonumentDetailUiState(
    val isLoading: Boolean = true,
    val monument: Monument? = null,
    val isFavorite: Boolean = false,
    val errorMessage: String? = null,
    val snackbarMessage: String? = null
)

/** ViewModel for the Monument Detail screen. */
class MonumentDetailViewModel : ViewModel() {

    private val monumentRepository  = MonumentRepository()
    private val favoritesRepository = FavoritesRepository()

    private val _uiState = MutableStateFlow(MonumentDetailUiState())
    val uiState: StateFlow<MonumentDetailUiState> = _uiState.asStateFlow()

    fun loadMonument(monumentId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            val result = monumentRepository.getMonumentById(monumentId)
            result.fold(
                onSuccess = { m ->
                    val fav = favoritesRepository.isFavorite(monumentId)
                    _uiState.value = _uiState.value.copy(
                        isLoading  = false,
                        monument   = m,
                        isFavorite = fav
                    )
                },
                onFailure = { e ->
                    _uiState.value = _uiState.value.copy(
                        isLoading    = false,
                        errorMessage = e.message ?: "Failed to load monument"
                    )
                }
            )
        }
    }

    fun toggleFavorite() {
        val monumentId = _uiState.value.monument?.id ?: return
        viewModelScope.launch {
            val result = favoritesRepository.toggleFavorite(monumentId)
            result.fold(
                onSuccess = { isNowFavorite ->
                    _uiState.value = _uiState.value.copy(
                        isFavorite      = isNowFavorite,
                        snackbarMessage = if (isNowFavorite) "Added to favourites ❤️" else "Removed from favourites"
                    )
                },
                onFailure = {
                    _uiState.value = _uiState.value.copy(
                        snackbarMessage = "Failed to update favourites. Please try again."
                    )
                }
            )
        }
    }

    fun onAiButtonClicked()     { showComingSoonMessage() }
    fun onListenButtonClicked() { showComingSoonMessage() }
    fun onARButtonClicked()     { showComingSoonMessage() }

    fun showComingSoonMessage() {
        _uiState.value = _uiState.value.copy(
            snackbarMessage = "This feature will be available in the next phase."
        )
    }

    fun clearSnackbar() {
        _uiState.value = _uiState.value.copy(snackbarMessage = null)
    }
}

