package com.example.lm_tourism.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.lm_tourism.model.User
import com.example.lm_tourism.repository.AuthRepository
import com.example.lm_tourism.utils.Constants
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed class ProfileUiState {
    object Loading : ProfileUiState()
    object Success : ProfileUiState()
    data class Error(val message: String) : ProfileUiState()
}

/** ViewModel for the Profile screen. */
class ProfileViewModel : ViewModel() {

    private val authRepository = AuthRepository()

    private val _uiState = MutableStateFlow<ProfileUiState>(ProfileUiState.Loading)
    val uiState: StateFlow<ProfileUiState> = _uiState.asStateFlow()

    private val _user = MutableStateFlow<User?>(null)
    val user: StateFlow<User?> = _user.asStateFlow()

    private val _isGuest = MutableStateFlow(false)
    val isGuest: StateFlow<Boolean> = _isGuest.asStateFlow()

    init { loadProfile() }

    fun loadProfile() {
        viewModelScope.launch {
            _uiState.value = ProfileUiState.Loading
            val firebaseUser = authRepository.currentFirebaseUser
            if (firebaseUser == null) {
                _user.value    = guestUser()
                _isGuest.value = true
                _uiState.value = ProfileUiState.Success
                return@launch
            }

            _isGuest.value = firebaseUser.isAnonymous

            if (firebaseUser.isAnonymous) {
                _user.value    = guestUser()
                _uiState.value = ProfileUiState.Success
                return@launch
            }

            val result = authRepository.getUserProfile(firebaseUser.uid)
            result.fold(
                onSuccess = { u ->
                    _user.value    = u
                    _uiState.value = ProfileUiState.Success
                },
                onFailure = { e ->
                    _uiState.value = ProfileUiState.Error(e.message ?: "Failed to load profile")
                }
            )
        }
    }

    fun signOut() {
        authRepository.signOut()
    }

    private fun guestUser() = User(
        uid   = Constants.GUEST_UID,
        name  = Constants.GUEST_NAME,
        email = Constants.GUEST_EMAIL,
        isGuest = true
    )
}
