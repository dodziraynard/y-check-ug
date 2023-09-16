package com.hrd.ycheck.components.compose

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material.MaterialTheme
import androidx.compose.material.MaterialTheme.shapes
import androidx.compose.material.darkColors
import androidx.compose.material.lightColors
import androidx.compose.runtime.Composable

private val LightColorPalette = lightColors(
    primary = primaryColor,
    secondary = accentAmber,
    surface = lightGrey,
    primaryVariant = gridLineColorLight,
    onPrimary = accentAmber,
    onSurface = accentAmber,
)

private val DarkColorPalette = darkColors(
    primary = primaryColorDark,
    secondary = accentAmber,
    surface = lightGreyAlpha,
    primaryVariant = gridLineColorLight,
    onPrimary = accentAmber,
    onSurface = accentAmber,
)

@Composable
fun YCheckTheme(
    darkTheme: Boolean = isSystemInDarkTheme(), content: @Composable () -> Unit
) {

    MaterialTheme(
        colors = if (darkTheme) DarkColorPalette else LightColorPalette,
        typography = typography,
        shapes = shapes,
        content = content
    )
}