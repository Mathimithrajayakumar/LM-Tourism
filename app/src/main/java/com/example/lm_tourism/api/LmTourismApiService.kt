package com.example.lm_tourism.api

import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query

/**
 * Retrofit service interface — placeholder for future LM Tourism REST APIs.
 *
 * These endpoints will be implemented in Phase 2 when:
 * - Gemini AI integration provides monument information
 * - Google Maps Distance Matrix API provides nearby monument distances
 * - A custom backend serves monument data with pagination
 *
 * NOTE: Retrofit instance creation is in [RetrofitClient]. Do NOT call these
 * directly — they are consumed through [MonumentRepository].
 */
interface LmTourismApiService {

    // ─── Future: Monument Endpoints ────────────────────────────────────────

    /**
     * GET /monuments — paginated list of monuments.
     * [page] 1-based page index. [pageSize] number of items per page.
     */
    // @GET("monuments")
    // suspend fun getMonuments(
    //     @Query("page") page: Int = 1,
    //     @Query("pageSize") pageSize: Int = 20,
    //     @Query("category") category: String? = null
    // ): Response<List<MonumentDto>>

    /**
     * GET /monuments/{id} — single monument by ID.
     */
    // @GET("monuments/{id}")
    // suspend fun getMonumentById(@Path("id") id: String): Response<MonumentDto>

    /**
     * GET /monuments/search — full-text search.
     */
    // @GET("monuments/search")
    // suspend fun searchMonuments(@Query("q") query: String): Response<List<MonumentDto>>

    // ─── Future: Gemini AI Endpoint ────────────────────────────────────────

    /**
     * POST /ai/monument-info — send a user question about a monument,
     * receive a Gemini-generated answer.
     */
    // @POST("ai/monument-info")
    // suspend fun askAboutMonument(@Body request: AiQueryRequest): Response<AiQueryResponse>

    // ─── Future: Booking Endpoint ──────────────────────────────────────────

    /**
     * POST /bookings — create a ticket booking.
     */
    // @POST("bookings")
    // suspend fun createBooking(@Body request: BookingRequest): Response<BookingResponse>
}
