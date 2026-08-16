package com.example.lm_tourism.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.lm_tourism.repository.AuthRepository
import com.example.lm_tourism.utils.Constants
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/** UI state for authentication screens. */
sealed class AuthUiState {
    object Idle    : AuthUiState()
    object Loading : AuthUiState()
    data class Success(val uid: String) : AuthUiState()
    data class Error(val message: String) : AuthUiState()
}

/**
 * ViewModel for Login, Register, and ForgotPassword screens.
 *
 * All form fields are held as [StateFlow] so the UI is always in sync
 * with what was typed. Validation is performed here before delegating
 * to [AuthRepository].
 */
class AuthViewModel : ViewModel() {

    private val authRepository = AuthRepository()

    // ─── Form Fields ─────────────────────────────────────────────────
    private val _name     = MutableStateFlow("")
    val name: StateFlow<String> = _name.asStateFlow()

    private val _email    = MutableStateFlow("")
    val email: StateFlow<String> = _email.asStateFlow()

    private val _password = MutableStateFlow("")
    val password: StateFlow<String> = _password.asStateFlow()

    private val _confirmPassword = MutableStateFlow("")
    val confirmPassword: StateFlow<String> = _confirmPassword.asStateFlow()

    // ─── UI States ────────────────────────────────────────────────────
    private val _loginState    = MutableStateFlow<AuthUiState>(AuthUiState.Idle)
    val loginState: StateFlow<AuthUiState> = _loginState.asStateFlow()

    private val _registerState = MutableStateFlow<AuthUiState>(AuthUiState.Idle)
    val registerState: StateFlow<AuthUiState> = _registerState.asStateFlow()

    private val _resetState    = MutableStateFlow<AuthUiState>(AuthUiState.Idle)
    val resetState: StateFlow<AuthUiState> = _resetState.asStateFlow()

    // ─── Field Updaters ───────────────────────────────────────────────
    fun updateName(value: String)            { _name.value = value }
    fun updateEmail(value: String)           { _email.value = value.trim() }
    fun updatePassword(value: String)        { _password.value = value }
    fun updateConfirmPassword(value: String) { _confirmPassword.value = value }

    fun resetLoginState()    { _loginState.value    = AuthUiState.Idle }
    fun resetRegisterState() { _registerState.value = AuthUiState.Idle }
    fun resetResetState()    { _resetState.value    = AuthUiState.Idle }

    // ─── Login ────────────────────────────────────────────────────────

    fun login() {
        if (!validateLoginFields()) return
        viewModelScope.launch {
            _loginState.value = AuthUiState.Loading
            val result = authRepository.login(_email.value, _password.value)
            _loginState.value = result.fold(
                onSuccess = { uid -> AuthUiState.Success(uid) },
                onFailure = { e  -> AuthUiState.Error(e.toFriendlyMessage()) }
            )
        }
    }

    // ─── Guest Login ──────────────────────────────────────────────────

    fun loginAsGuest() {
        viewModelScope.launch {
            _loginState.value = AuthUiState.Loading
            val result = authRepository.loginAsGuest()
            _loginState.value = result.fold(
                onSuccess = { uid -> AuthUiState.Success(uid) },
                onFailure = { e  -> AuthUiState.Error(e.toFriendlyMessage()) }
            )
        }
    }

    // ─── Register ────────────────────────────────────────────────────

    fun register() {
        if (!validateRegisterFields()) return
        viewModelScope.launch {
            _registerState.value = AuthUiState.Loading
            val result = authRepository.register(_name.value.trim(), _email.value, _password.value)
            _registerState.value = result.fold(
                onSuccess = { uid -> AuthUiState.Success(uid) },
                onFailure = { e  -> AuthUiState.Error(e.toFriendlyMessage()) }
            )
        }
    }

    // ─── Password Reset ───────────────────────────────────────────────

    fun sendPasswordReset() {
        if (_email.value.isBlank()) {
            _resetState.value = AuthUiState.Error("Please enter your email address.")
            return
        }
        viewModelScope.launch {
            _resetState.value = AuthUiState.Loading
            val result = authRepository.sendPasswordResetEmail(_email.value)
            _resetState.value = result.fold(
                onSuccess = { AuthUiState.Success("") },
                onFailure = { e -> AuthUiState.Error(e.toFriendlyMessage()) }
            )
        }
    }

    // ─── Validation ───────────────────────────────────────────────────

    private fun validateLoginFields(): Boolean {
        return when {
            _email.value.isBlank()    -> { _loginState.value = AuthUiState.Error("Email is required."); false }
            !_email.value.isValidEmail() -> { _loginState.value = AuthUiState.Error("Enter a valid email address."); false }
            _password.value.isBlank() -> { _loginState.value = AuthUiState.Error("Password is required."); false }
            _password.value.length < 6 -> { _loginState.value = AuthUiState.Error("Password must be at least 6 characters."); false }
            else -> true
        }
    }

    private fun validateRegisterFields(): Boolean {
        return when {
            _name.value.isBlank()     -> { _registerState.value = AuthUiState.Error("Full name is required."); false }
            _email.value.isBlank()    -> { _registerState.value = AuthUiState.Error("Email is required."); false }
            !_email.value.isValidEmail() -> { _registerState.value = AuthUiState.Error("Enter a valid email address."); false }
            _password.value.length < 6 -> { _registerState.value = AuthUiState.Error("Password must be at least 6 characters."); false }
            _password.value != _confirmPassword.value -> {
                _registerState.value = AuthUiState.Error("Passwords do not match."); false
            }
            else -> true
        }
    }

    // ─── Helpers ──────────────────────────────────────────────────────

    private fun String.isValidEmail(): Boolean =
        android.util.Patterns.EMAIL_ADDRESS.matcher(this).matches()

    private fun Throwable.toFriendlyMessage(): String = when {
        message?.contains("INVALID_EMAIL", ignoreCase = true) == true         -> "Invalid email address."
        message?.contains("WRONG_PASSWORD", ignoreCase = true) == true        -> "Incorrect password. Please try again."
        message?.contains("USER_NOT_FOUND", ignoreCase = true) == true        -> "No account found with this email."
        message?.contains("EMAIL_ALREADY_IN_USE", ignoreCase = true) == true  -> "An account with this email already exists."
        message?.contains("NETWORK_ERROR", ignoreCase = true) == true         -> "Network error. Check your internet connection."
        message?.contains("TOO_MANY_REQUESTS", ignoreCase = true) == true     -> "Too many attempts. Please wait and try again."
        else -> message ?: "An unexpected error occurred."
    }
}
