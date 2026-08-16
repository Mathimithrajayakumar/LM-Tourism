package com.example.lm_tourism.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.lm_tourism.model.Monument
import com.example.lm_tourism.repository.MonumentRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class ArUiState(
    val isLoading: Boolean = true,
    val monument: Monument? = null,
    val errorMessage: String? = null,
    val modelScale: Float = 1.0f,
    val modelOffsetX: Float = 0f,
    val modelOffsetY: Float = 0f
)

/** ViewModel managing state for the mobile live AR view screen. */
class ArViewModel : ViewModel() {

    private val monumentRepository = MonumentRepository()

    private val _uiState = MutableStateFlow(ArUiState())
    val uiState: StateFlow<ArUiState> = _uiState.asStateFlow()

    fun loadMonument(monumentId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            val result = monumentRepository.getMonumentById(monumentId)
            result.fold(
                onSuccess = { m ->
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        monument  = m
                    )
                },
                onFailure = { e ->
                    _uiState.value = _uiState.value.copy(
                        isLoading    = false,
                        errorMessage = e.message ?: "Failed to load monument for AR View"
                    )
                }
            )
        }
    }

    fun updateModelOffset(deltaX: Float, deltaY: Float) {
        val currentX = _uiState.value.modelOffsetX
        val currentY = _uiState.value.modelOffsetY
        _uiState.value = _uiState.value.copy(
            modelOffsetX = (currentX + deltaX).coerceIn(-300f, 300f),
            modelOffsetY = (currentY + deltaY).coerceIn(-300f, 300f)
        )
    }

    fun updateModelScale(scaleFactor: Float) {
        val currentScale = _uiState.value.modelScale
        _uiState.value = _uiState.value.copy(
            modelScale = (currentScale * scaleFactor).coerceIn(0.5f, 2.5f)
        )
    }

    fun resetModelTransform() {
        _uiState.value = _uiState.value.copy(
            modelScale = 1.0f,
            modelOffsetX = 0f,
            modelOffsetY = 0f
        )
    }
}
