package com.example.lm_tourism.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.lm_tourism.model.Monument
import com.example.lm_tourism.repository.MonumentRepository
import com.example.lm_tourism.utils.LocalDataSource
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed class HomeUiState {
    object Loading : HomeUiState()
    object Success : HomeUiState()
    data class Error(val message: String) : HomeUiState()
}

/** ViewModel for the Home Dashboard screen. */
class HomeViewModel : ViewModel() {

    private val monumentRepository = MonumentRepository()

    private val _uiState             = MutableStateFlow<HomeUiState>(HomeUiState.Loading)
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    private val _featuredMonuments   = MutableStateFlow<List<Monument>>(emptyList())
    val featuredMonuments: StateFlow<List<Monument>> = _featuredMonuments.asStateFlow()

    private val _popularMonuments    = MutableStateFlow<List<Monument>>(emptyList())
    val popularMonuments: StateFlow<List<Monument>> = _popularMonuments.asStateFlow()

    private val _nearbyMonuments     = MutableStateFlow<List<Monument>>(emptyList())
    val nearbyMonuments: StateFlow<List<Monument>> = _nearbyMonuments.asStateFlow()

    private val _searchQuery         = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    init {
        loadData()
    }

    private fun loadData() {
        viewModelScope.launch {
            _uiState.value = HomeUiState.Loading
            val result = monumentRepository.getMonuments()
            result.fold(
                onSuccess = { monuments ->
                    _featuredMonuments.value = monuments.filter { it.isFeatured }
                        .ifEmpty { monuments.take(5) }
                    _popularMonuments.value  = monuments.sortedByDescending { it.rating }
                    _nearbyMonuments.value   = monuments.shuffled().take(5)
                    _uiState.value = HomeUiState.Success
                },
                onFailure = { e ->
                    // Load from local even on error
                    _featuredMonuments.value = LocalDataSource.getFeatured()
                    _popularMonuments.value  = LocalDataSource.getPopular()
                    _nearbyMonuments.value   = LocalDataSource.getNearby()
                    _uiState.value = HomeUiState.Error(e.message ?: "Failed to load data")
                }
            )
        }
    }

    fun updateSearchQuery(query: String) { _searchQuery.value = query }

    fun refresh() { loadData() }
}
