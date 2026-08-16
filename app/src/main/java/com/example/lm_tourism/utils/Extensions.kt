package com.example.lm_tourism.utils

import java.text.NumberFormat
import java.util.Locale

/** Extension functions used across the app. */

/** Formats an entry fee value as an Indian Rupee string (e.g. "₹50.00"). */
fun Double.toRupeeString(): String {
    val format = NumberFormat.getCurrencyInstance(Locale("en", "IN"))
    return format.format(this)
}

/** Returns "Free" if entry fee is 0, otherwise the formatted rupee string. */
fun Double.toEntryFeeString(): String =
    if (this <= 0.0) "Free Entry" else this.toRupeeString()

/** Clamps a float rating between 0 and 5 and formats to one decimal. */
fun Float.toRatingString(): String = "%.1f".format(this.coerceIn(0f, 5f))

/** Truncates text to [maxLength] characters, appending "…" if truncated. */
fun String.truncate(maxLength: Int): String =
    if (this.length <= maxLength) this else "${this.take(maxLength)}…"

/** Returns a safe non-empty string, or the [fallback] if blank. */
fun String.orFallback(fallback: String): String =
    if (this.isBlank()) fallback else this
