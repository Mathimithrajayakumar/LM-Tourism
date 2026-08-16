package com.example.lm_tourism.repository

import com.example.lm_tourism.model.Monument
import com.example.lm_tourism.utils.Constants
import com.example.lm_tourism.utils.LocalDataSource
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.tasks.await

/**
 * Repository for managing the authenticated user's favourite monuments.
 *
 * Favourites are stored in Firestore under:
 *   users/{uid}/favorites/{monumentId}
 *
 * Guests (anonymous users) can also save favourites during their session.
 */
class FavoritesRepository {

    private val auth: FirebaseAuth = FirebaseAuth.getInstance()
    private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance()

    private val currentUid: String?
        get() = auth.currentUser?.uid

    // ─── Fetch Favourites ─────────────────────────────────────────────

    /**
     * Returns the list of favourite monuments for the current user.
     * Monument details are fetched from [MonumentRepository] (or local data).
     */
    suspend fun getFavorites(): Result<List<Monument>> {
        val uid = currentUid ?: return Result.success(emptyList())
        return try {
            val snapshot = firestore.collection(Constants.COLLECTION_USERS)
                .document(uid)
                .collection(Constants.COLLECTION_FAVORITES)
                .get()
                .await()

            val monumentIds = snapshot.documents.map { it.id }
            val monuments = monumentIds.mapNotNull { id ->
                LocalDataSource.findById(id)?.copy(isFavorite = true)
            }
            Result.success(monuments)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // ─── Check Favourite Status ───────────────────────────────────────

    /**
     * Returns true if [monumentId] is in the user's favourites.
     */
    suspend fun isFavorite(monumentId: String): Boolean {
        val uid = currentUid ?: return false
        return try {
            val doc = firestore.collection(Constants.COLLECTION_USERS)
                .document(uid)
                .collection(Constants.COLLECTION_FAVORITES)
                .document(monumentId)
                .get()
                .await()
            doc.exists()
        } catch (e: Exception) {
            false
        }
    }

    // ─── Add Favourite ────────────────────────────────────────────────

    /**
     * Adds [monumentId] to the user's favourites.
     */
    suspend fun addFavorite(monumentId: String): Result<Unit> {
        val uid = currentUid ?: return Result.failure(Exception("User not authenticated"))
        return try {
            val data = mapOf(
                Constants.FIELD_MONUMENT_ID to monumentId,
                Constants.FIELD_ADDED_AT    to System.currentTimeMillis()
            )
            firestore.collection(Constants.COLLECTION_USERS)
                .document(uid)
                .collection(Constants.COLLECTION_FAVORITES)
                .document(monumentId)
                .set(data)
                .await()

            // Update favorite count in user doc
            updateFavoriteCount(uid, increment = true)
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // ─── Remove Favourite ─────────────────────────────────────────────

    /**
     * Removes [monumentId] from the user's favourites.
     */
    suspend fun removeFavorite(monumentId: String): Result<Unit> {
        val uid = currentUid ?: return Result.failure(Exception("User not authenticated"))
        return try {
            firestore.collection(Constants.COLLECTION_USERS)
                .document(uid)
                .collection(Constants.COLLECTION_FAVORITES)
                .document(monumentId)
                .delete()
                .await()

            updateFavoriteCount(uid, increment = false)
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // ─── Toggle Helper ────────────────────────────────────────────────

    /**
     * Toggles favourite status for [monumentId].
     * @return true if monument is now a favourite, false if removed.
     */
    suspend fun toggleFavorite(monumentId: String): Result<Boolean> {
        return if (isFavorite(monumentId)) {
            removeFavorite(monumentId).map { false }
        } else {
            addFavorite(monumentId).map { true }
        }
    }

    // ─── Count Helper ─────────────────────────────────────────────────

    private suspend fun updateFavoriteCount(uid: String, increment: Boolean) {
        try {
            val userRef = firestore.collection(Constants.COLLECTION_USERS).document(uid)
            val current = userRef.get().await().getLong("favoriteCount") ?: 0L
            val updated = if (increment) current + 1 else maxOf(0, current - 1)
            userRef.update("favoriteCount", updated).await()
        } catch (_: Exception) { /* best-effort */ }
    }
}
