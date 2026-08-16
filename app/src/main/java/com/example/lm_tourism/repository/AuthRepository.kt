package com.example.lm_tourism.repository

import com.example.lm_tourism.model.User
import com.example.lm_tourism.utils.Constants
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.tasks.await

/**
 * Repository for all Firebase Authentication operations.
 *
 * All operations return [Result] so ViewModels can handle success/failure
 * without knowing about Firebase specifics.
 */
class AuthRepository {

    private val auth: FirebaseAuth = FirebaseAuth.getInstance()
    private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance()

    /** Returns the currently signed-in [FirebaseUser], or null if not authenticated. */
    val currentFirebaseUser: FirebaseUser?
        get() = auth.currentUser

    /** True if a user (including guests) is currently signed in. */
    val isLoggedIn: Boolean
        get() = auth.currentUser != null

    // ─── Sign In ──────────────────────────────────────────────────────

    /**
     * Signs in with [email] and [password].
     * @return [Result.success] with the UID on success, [Result.failure] on error.
     */
    suspend fun login(email: String, password: String): Result<String> {
        return try {
            val result = auth.signInWithEmailAndPassword(email, password).await()
            Result.success(result.user?.uid ?: "")
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // ─── Registration ─────────────────────────────────────────────────

    /**
     * Creates a new account with [email] and [password], then writes a user
     * document to Firestore.
     */
    suspend fun register(name: String, email: String, password: String): Result<String> {
        return try {
            val result = auth.createUserWithEmailAndPassword(email, password).await()
            val uid = result.user?.uid ?: return Result.failure(Exception("UID was null after registration"))

            // Persist user profile to Firestore
            val userDoc = mapOf(
                Constants.FIELD_UID        to uid,
                Constants.FIELD_NAME       to name,
                Constants.FIELD_EMAIL      to email,
                Constants.FIELD_CREATED_AT to System.currentTimeMillis(),
                "profileImageUrl"          to "",
                "bio"                      to ""
            )
            firestore.collection(Constants.COLLECTION_USERS)
                .document(uid)
                .set(userDoc)
                .await()

            Result.success(uid)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // ─── Password Reset ───────────────────────────────────────────────

    /**
     * Sends a password reset email to [email].
     */
    suspend fun sendPasswordResetEmail(email: String): Result<Unit> {
        return try {
            auth.sendPasswordResetEmail(email).await()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // ─── Guest Login ──────────────────────────────────────────────────

    /**
     * Signs in anonymously as a guest. Guest users can browse but cannot
     * save favourites to Firestore.
     */
    suspend fun loginAsGuest(): Result<String> {
        return try {
            val result = auth.signInAnonymously().await()
            Result.success(result.user?.uid ?: Constants.GUEST_UID)
        } catch (e: Exception) {
            // Fallback: treat as offline guest without Firebase
            Result.success(Constants.GUEST_UID)
        }
    }

    // ─── Sign Out ─────────────────────────────────────────────────────

    /** Signs out the current user. */
    fun signOut() {
        auth.signOut()
    }

    // ─── User Profile ─────────────────────────────────────────────────

    /**
     * Fetches the [User] document from Firestore for the given [uid].
     */
    suspend fun getUserProfile(uid: String): Result<User> {
        return try {
            val snapshot = firestore.collection(Constants.COLLECTION_USERS)
                .document(uid)
                .get()
                .await()

            if (snapshot.exists()) {
                val user = User(
                    uid              = snapshot.getString(Constants.FIELD_UID) ?: uid,
                    name             = snapshot.getString(Constants.FIELD_NAME) ?: "",
                    email            = snapshot.getString(Constants.FIELD_EMAIL) ?: "",
                    profileImageUrl  = snapshot.getString("profileImageUrl") ?: "",
                    bio              = snapshot.getString("bio") ?: "",
                    createdAt        = snapshot.getLong(Constants.FIELD_CREATED_AT) ?: 0L
                )
                Result.success(user)
            } else {
                // Build a minimal user from the Firebase Auth object
                val firebaseUser = auth.currentUser
                val user = User(
                    uid   = uid,
                    name  = firebaseUser?.displayName ?: Constants.GUEST_NAME,
                    email = firebaseUser?.email ?: ""
                )
                Result.success(user)
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Updates the display name of the current user in Firestore.
     */
    suspend fun updateDisplayName(uid: String, newName: String): Result<Unit> {
        return try {
            firestore.collection(Constants.COLLECTION_USERS)
                .document(uid)
                .update(Constants.FIELD_NAME, newName)
                .await()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
