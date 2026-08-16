package com.example.lm_tourism.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.lm_tourism.model.Monument
import com.example.lm_tourism.repository.MonumentRepository
import com.example.lm_tourism.utils.LocalDataSource
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed class ExploreUiState {
    object Loading : ExploreUiState()
    object Success : ExploreUiState()
    object Empty   : ExploreUiState()
    data class Error(val message: String) : ExploreUiState()
}

/** ViewModel for the Explore (monument list) screen. */
class ExploreViewModel : ViewModel() {

    private val monumentRepository = MonumentRepository()

    private val _uiState           = MutableStateFlow<ExploreUiState>(ExploreUiState.Loading)
    val uiState: StateFlow<ExploreUiState> = _uiState.asStateFlow()

    private val _allMonuments      = MutableStateFlow<List<Monument>>(emptyList())
    private val _monuments         = MutableStateFlow<List<Monument>>(emptyList())
    val monuments: StateFlow<List<Monument>> = _monuments.asStateFlow()

    private val _searchQuery       = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _selectedCategory  = MutableStateFlow<String?>(null)
    val selectedCategory: StateFlow<String?> = _selectedCategory.asStateFlow()

    /** Available filter categories derived from loaded monuments. */
    private val _categories        = MutableStateFlow<List<String>>(emptyList())
    val categories: StateFlow<List<String>> = _categories.asStateFlow()

    private var searchJob: Job? = null

    init {
        loadMonuments()
    }

    private fun loadMonuments() {
        viewModelScope.launch {
            _uiState.value = ExploreUiState.Loading
            val result = monumentRepository.getMonuments()
            result.fold(
                onSuccess = { list ->
                    _allMonuments.value = list
                    _monuments.value    = list
                    _categories.value   = list.map { it.category }.distinct().sorted()
                    _uiState.value = if (list.isEmpty()) ExploreUiState.Empty else ExploreUiState.Success
                },
                onFailure = {
                    val local = LocalDataSource.monuments
                    _allMonuments.value = local
                    _monuments.value    = local
                    _categories.value   = local.map { it.category }.distinct().sorted()
                    _uiState.value = ExploreUiState.Success
                }
            )
        }
    }

    /** Debounced search — triggers 300 ms after the user stops typing. */
    fun updateSearchQuery(query: String) {
        _searchQuery.value = query
        searchJob?.cancel()
        searchJob = viewModelScope.launch {
            delay(300)
            applyFilters()
        }
    }

    fun selectCategory(category: String?) {
        _selectedCategory.value = category
        applyFilters()
    }

    private fun applyFilters() {
        val query    = _searchQuery.value.trim().lowercase()
        val category = _selectedCategory.value
        _monuments.value = _allMonuments.value.filter { m ->
            val matchesQuery    = query.isBlank() ||
                m.name.lowercase().contains(query) ||
                m.city.lowercase().contains(query) ||
                m.state.lowercase().contains(query)
            val matchesCategory = category == null || m.category == category
            matchesQuery && matchesCategory
        }
        _uiState.value = if (_monuments.value.isEmpty()) ExploreUiState.Empty else ExploreUiState.Success
    }

    fun refresh() { loadMonuments() }
}
