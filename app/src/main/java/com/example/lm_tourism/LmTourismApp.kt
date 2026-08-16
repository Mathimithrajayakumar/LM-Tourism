package com.example.lm_tourism

import android.app.Application
import com.google.firebase.FirebaseApp

/**
 * Application class – initializes Firebase on startup.
 */
class LmTourismApp : Application() {

    override fun onCreate() {
        super.onCreate()
        FirebaseApp.initializeApp(this)
    }
}
