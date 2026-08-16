package com.example.lm_tourism.viewmodel

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/** Available language options for the app. */
enum class AppLanguage(val displayName: String, val code: String) {
    ENGLISH("English", "en"),
    HINDI("हिंदी (Hindi)", "hi"),
    TAMIL("தமிழ் (Tamil)", "ta"),
    TELUGU("తెలుగు (Telugu)", "te"),
    KANNADA("ಕನ್ನಡ (Kannada)", "kn"),
    BENGALI("বাংলা (Bengali)", "bn")
}

/**
 * ViewModel for the Settings screen.
 *
 * In Phase 2, dark mode and language settings will be persisted using
 * DataStore Preferences. For now they are session-only.
 */
class SettingsViewModel : ViewModel() {

    private val _isDarkMode              = MutableStateFlow(false)
    val isDarkMode: StateFlow<Boolean>  = _isDarkMode.asStateFlow()

    private val _notificationsEnabled             = MutableStateFlow(true)
    val notificationsEnabled: StateFlow<Boolean> = _notificationsEnabled.asStateFlow()

    private val _selectedLanguage                 = MutableStateFlow(AppLanguage.ENGLISH)
    val selectedLanguage: StateFlow<AppLanguage> = _selectedLanguage.asStateFlow()

    fun toggleDarkMode()        { _isDarkMode.value = !_isDarkMode.value }
    fun toggleNotifications()   { _notificationsEnabled.value = !_notificationsEnabled.value }
    fun selectLanguage(lang: AppLanguage) { _selectedLanguage.value = lang }
}
