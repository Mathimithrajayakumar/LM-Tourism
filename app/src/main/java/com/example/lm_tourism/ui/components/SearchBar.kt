package com.example.lm_tourism.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppSearchBar(
    query: String,
    onQueryChange: (String) -> Unit,
    placeholder: String = "Search monuments, cities…",
    modifier: Modifier = Modifier
) {
    OutlinedTextField(
        value            = query,
        onValueChange    = onQueryChange,
        modifier         = modifier.fillMaxWidth(),
        placeholder      = {
            Text(
                text  = placeholder,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        },
        leadingIcon      = {
            Icon(
                imageVector        = Icons.Filled.Search,
                contentDescription = "Search",
                tint               = MaterialTheme.colorScheme.primary
            )
        },
        trailingIcon     = {
            AnimatedVisibility(
                visible  = query.isNotEmpty(),
                enter    = fadeIn(),
                exit     = fadeOut()
            ) {
                IconButton(onClick = { onQueryChange("") }) {
                    Icon(
                        imageVector        = Icons.Filled.Close,
                        contentDescription = "Clear search",
                        modifier           = Modifier.size(18.dp),
                        tint               = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        },
        singleLine       = true,
        shape            = RoundedCornerShape(12.dp),
        colors           = OutlinedTextFieldDefaults.colors(
            focusedBorderColor   = MaterialTheme.colorScheme.primary,
            unfocusedBorderColor = MaterialTheme.colorScheme.outline,
            focusedContainerColor   = MaterialTheme.colorScheme.surfaceVariant,
            unfocusedContainerColor = MaterialTheme.colorScheme.surfaceVariant
        )
    )
}
