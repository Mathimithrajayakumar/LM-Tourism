package com.example.lm_tourism.repository

import com.example.lm_tourism.model.Monument
import com.example.lm_tourism.utils.Constants
import com.example.lm_tourism.utils.LocalDataSource
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.tasks.await

/**
 * Repository for fetching monument data.
 *
 * Data priority:
 * 1. Firestore (live) — first attempted
 * 2. [LocalDataSource] (offline) — used as fallback if Firestore fails
 *
 * This design ensures the app is functional without a network connection.
 */
class MonumentRepository {

    private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance()

    // ─── Fetch All Monuments ──────────────────────────────────────────

    /**
     * Returns all monuments, preferring Firestore over local data.
     */
    suspend fun getMonuments(): Result<List<Monument>> {
        return try {
            val snapshot = firestore.collection(Constants.COLLECTION_MONUMENTS)
                .get()
                .await()

            if (!snapshot.isEmpty) {
                val monuments = snapshot.documents.mapNotNull { doc ->
                    mapDocumentToMonument(doc.id, doc.data)
                }
                Result.success(monuments)
            } else {
                // Firestore is empty — use local data as fallback
                Result.success(LocalDataSource.monuments)
            }
        } catch (e: Exception) {
            // Network error or Firestore unavailable — use local data
            Result.success(LocalDataSource.monuments)
        }
    }

    // ─── Fetch Single Monument ────────────────────────────────────────

    /**
     * Returns a single monument by [id].
     */
    suspend fun getMonumentById(id: String): Result<Monument> {
        return try {
            val doc = firestore.collection(Constants.COLLECTION_MONUMENTS)
                .document(id)
                .get()
                .await()

            if (doc.exists()) {
                val monument = mapDocumentToMonument(doc.id, doc.data)
                    ?: LocalDataSource.findById(id)
                    ?: return Result.failure(Exception("Monument not found: $id"))
                Result.success(monument)
            } else {
                // Try local fallback
                val local = LocalDataSource.findById(id)
                    ?: return Result.failure(Exception("Monument not found: $id"))
                Result.success(local)
            }
        } catch (e: Exception) {
            val local = LocalDataSource.findById(id)
            if (local != null) Result.success(local)
            else Result.failure(e)
        }
    }

    // ─── Search ───────────────────────────────────────────────────────

    /**
     * Searches monuments by [query] — performed locally against cached data.
     * Firestore full-text search would require Algolia or similar (Phase 2).
     */
    suspend fun searchMonuments(query: String): Result<List<Monument>> {
        return try {
            val allResult = getMonuments()
            if (allResult.isFailure) return allResult
            val results = allResult.getOrNull()!!.filter { m ->
                m.name.contains(query, ignoreCase = true) ||
                m.city.contains(query, ignoreCase = true) ||
                m.state.contains(query, ignoreCase = true) ||
                m.category.contains(query, ignoreCase = true) ||
                m.tags.any { it.contains(query, ignoreCase = true) }
            }
            Result.success(results)
        } catch (e: Exception) {
            Result.success(LocalDataSource.search(query))
        }
    }

    // ─── Firestore Seeder (run once) ──────────────────────────────────

    /**
     * Seeds Firestore with local monument data.
     * Should be called once from a setup screen or admin tool.
     */
    suspend fun seedFirestoreIfEmpty(): Result<Unit> {
        return try {
            val snapshot = firestore.collection(Constants.COLLECTION_MONUMENTS)
                .limit(1)
                .get()
                .await()

            if (snapshot.isEmpty) {
                val batch = firestore.batch()
                LocalDataSource.monuments.forEach { monument ->
                    val ref = firestore.collection(Constants.COLLECTION_MONUMENTS)
                        .document(monument.id)
                    batch.set(ref, monumentToMap(monument))
                }
                batch.commit().await()
            }
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // ─── Mapping Helpers ──────────────────────────────────────────────

    private fun mapDocumentToMonument(id: String, data: Map<String, Any?>?): Monument? {
        if (data == null) return null
        return try {
            Monument(
                id               = id,
                name             = data["name"] as? String ?: "",
                location         = data["location"] as? String ?: "",
                city             = data["city"] as? String ?: "",
                state            = data["state"] as? String ?: "",
                description      = data["description"] as? String ?: "",
                history          = data["history"] as? String ?: "",
                architecture     = data["architecture"] as? String ?: "",
                builtBy          = data["builtBy"] as? String ?: "",
                year             = (data["year"] as? Long)?.toInt() ?: 0,
                dynasty          = data["dynasty"] as? String ?: "",
                unescoStatus     = data["unescoStatus"] as? Boolean ?: false,
                openingTime      = data["openingTime"] as? String ?: "",
                closingTime      = data["closingTime"] as? String ?: "",
                closedOn         = data["closedOn"] as? String ?: "",
                entryFee         = (data["entryFee"] as? Number)?.toDouble() ?: 0.0,
                entryFeeIndian   = (data["entryFeeIndian"] as? Number)?.toDouble() ?: 0.0,
                bestVisitingTime = data["bestVisitingTime"] as? String ?: "",
                imageUrl         = data["imageUrl"] as? String ?: "",
                rating           = (data["rating"] as? Number)?.toFloat() ?: 0f,
                reviewCount      = (data["reviewCount"] as? Long)?.toInt() ?: 0,
                latitude         = (data["latitude"] as? Number)?.toDouble() ?: 0.0,
                longitude        = (data["longitude"] as? Number)?.toDouble() ?: 0.0,
                officialBookingUrl = data["officialBookingUrl"] as? String ?: "",
                category         = data["category"] as? String ?: "",
                @Suppress("UNCHECKED_CAST")
                tags             = (data["tags"] as? List<String>) ?: emptyList(),
                isFeatured       = data["isFeatured"] as? Boolean ?: false
            )
        } catch (e: Exception) {
            null
        }
    }

    private fun monumentToMap(monument: Monument): Map<String, Any?> = mapOf(
        "name"             to monument.name,
        "location"         to monument.location,
        "city"             to monument.city,
        "state"            to monument.state,
        "description"      to monument.description,
        "history"          to monument.history,
        "architecture"     to monument.architecture,
        "builtBy"          to monument.builtBy,
        "year"             to monument.year,
        "dynasty"          to monument.dynasty,
        "unescoStatus"     to monument.unescoStatus,
        "openingTime"      to monument.openingTime,
        "closingTime"      to monument.closingTime,
        "closedOn"         to monument.closedOn,
        "entryFee"         to monument.entryFee,
        "entryFeeIndian"   to monument.entryFeeIndian,
        "bestVisitingTime" to monument.bestVisitingTime,
        "imageUrl"         to monument.imageUrl,
        "rating"           to monument.rating,
        "reviewCount"      to monument.reviewCount,
        "latitude"         to monument.latitude,
        "longitude"        to monument.longitude,
        "officialBookingUrl" to monument.officialBookingUrl,
        "category"         to monument.category,
        "tags"             to monument.tags,
        "isFeatured"       to monument.isFeatured
    )
}
