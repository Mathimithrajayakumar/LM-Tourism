package com.example.lm_tourism.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.example.lm_tourism.navigation.Screen
import com.example.lm_tourism.ui.components.PrimaryButton
import com.example.lm_tourism.ui.components.SecondaryButton
import com.example.lm_tourism.viewmodel.AuthUiState
import com.example.lm_tourism.viewmodel.AuthViewModel

@Composable
fun LoginScreen(
    navController: NavController,
    viewModel: AuthViewModel = viewModel()
) {
    val loginState by viewModel.loginState.collectAsStateWithLifecycle()
    val email      by viewModel.email.collectAsStateWithLifecycle()
    val password   by viewModel.password.collectAsStateWithLifecycle()

    var passwordVisible by remember { mutableStateOf(false) }
    var formVisible     by remember { mutableStateOf(false) }

    // Navigate to Home on success
    LaunchedEffect(loginState) {
        if (loginState is AuthUiState.Success) {
            navController.navigate(Screen.Main.route) {
                popUpTo(Screen.Login.route) { inclusive = true }
            }
            viewModel.resetLoginState()
        }
    }

    LaunchedEffect(Unit) { formVisible = true }

    Box(modifier = Modifier.fillMaxSize()) {

        // ─── Blue header background ───────────────────────────────────
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .fillMaxHeight(0.42f)
                .background(
                    Brush.verticalGradient(
                        colors = listOf(Color(0xFF1565C0), Color(0xFF1976D2))
                    )
                )
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .systemBarsPadding(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(48.dp))

            // ─── Header ───────────────────────────────────────────────
            Icon(
                imageVector = Icons.Default.AccountBalance,
                contentDescription = null,
                modifier = Modifier.size(56.dp),
                tint = Color.White
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "LM Tourism",
                style = MaterialTheme.typography.headlineLarge,
                color = Color.White,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "Welcome back!",
                style = MaterialTheme.typography.bodyLarge,
                color = Color.White.copy(alpha = 0.85f)
            )
            Spacer(modifier = Modifier.height(32.dp))

            // ─── Login Card ───────────────────────────────────────────
            AnimatedVisibility(
                visible = formVisible,
                enter   = slideInVertically(initialOffsetY = { 120 }) + fadeIn()
            ) {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp),
                    shape = RoundedCornerShape(24.dp),
                    elevation = CardDefaults.cardElevation(defaultElevation = 12.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surface
                    )
                ) {
                    Column(
                        modifier = Modifier.padding(24.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        Text(
                            text = "Sign In",
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.Bold
                        )

                        // Email
                        OutlinedTextField(
                            value = email,
                            onValueChange = viewModel::updateEmail,
                            label = { Text("Email address") },
                            leadingIcon = { Icon(Icons.Default.Email, null) },
                            modifier = Modifier.fillMaxWidth(),
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                            singleLine = true,
                            shape = RoundedCornerShape(12.dp)
                        )

                        // Password
                        OutlinedTextField(
                            value = password,
                            onValueChange = viewModel::updatePassword,
                            label = { Text("Password") },
                            leadingIcon = { Icon(Icons.Default.Lock, null) },
                            trailingIcon = {
                                IconButton(onClick = { passwordVisible = !passwordVisible }) {
                                    Icon(
                                        imageVector = if (passwordVisible)
                                            Icons.Default.VisibilityOff
                                        else
                                            Icons.Default.Visibility,
                                        contentDescription = "Toggle password"
                                    )
                                }
                            },
                            visualTransformation = if (passwordVisible)
                                VisualTransformation.None
                            else
                                PasswordVisualTransformation(),
                            modifier = Modifier.fillMaxWidth(),
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                            singleLine = true,
                            shape = RoundedCornerShape(12.dp)
                        )

                        // Error message
                        if (loginState is AuthUiState.Error) {
                            Surface(
                                color = MaterialTheme.colorScheme.errorContainer,
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Text(
                                    text = (loginState as AuthUiState.Error).message,
                                    color = MaterialTheme.colorScheme.onErrorContainer,
                                    style = MaterialTheme.typography.bodySmall,
                                    modifier = Modifier.padding(10.dp)
                                )
                            }
                        }

                        // Forgot password
                        TextButton(
                            onClick = { navController.navigate(Screen.ForgotPassword.route) },
                            modifier = Modifier.align(Alignment.End)
                        ) {
                            Text("Forgot Password?")
                        }

                        // Sign In button
                        PrimaryButton(
                            text = "Sign In",
                            onClick = viewModel::login,
                            isLoading = loginState is AuthUiState.Loading
                        )

                        // Divider
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            HorizontalDivider(modifier = Modifier.weight(1f))
                            Text(
                                "  or  ",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            HorizontalDivider(modifier = Modifier.weight(1f))
                        }

                        // Guest Login
                        SecondaryButton(
                            text = "Continue as Guest",
                            onClick = viewModel::loginAsGuest,
                            leadingIcon = Icons.Default.PersonOutline
                        )

                        // Sign up
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.Center,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                "Don't have an account?",
                                style = MaterialTheme.typography.bodyMedium
                            )
                            TextButton(
                                onClick = { navController.navigate(Screen.Register.route) }
                            ) {
                                Text("Sign Up", fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(40.dp))
        }
    }
}
