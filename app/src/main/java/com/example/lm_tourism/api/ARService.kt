package com.example.lm_tourism.api

/**
 * Interface for future ARCore monument recognition integration.
 *
 * Phase 2 implementation will:
 * 1. Use ARCore to recognise monument images via the Augmented Images API.
 * 2. Return the matched [MonumentId] so the detail screen can be opened.
 * 3. Overlay information cards on the live camera feed.
 *
 * Implementing class: `ArCoreMonumentService` (Phase 2)
 */
interface ARService {

    /** Starts ARCore session and begins scanning for monument images. */
    fun startScanning()

    /** Stops ARCore session and releases camera resources. */
    fun stopScanning()

    /**
     * Called when ARCore recognises a monument.
     * @param monumentId The ID of the recognised monument.
     */
    fun onMonumentRecognised(monumentId: String)

    /** Returns true if the device supports ARCore. */
    fun isSupported(): Boolean
}
