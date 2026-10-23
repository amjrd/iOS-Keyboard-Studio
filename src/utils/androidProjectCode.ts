import { AndroidBuildConfig } from '../types/keyboard';
import JSZip from 'jszip';

export const getAndroidFiles = (config: AndroidBuildConfig) => {
  const packagePath = config.packageName.replace(/\./g, '/');

  const iqKeyboardManagerKotlin = `package ${config.packageName}.iqkeyboard

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.relocation.BringIntoViewRequester
import androidx.compose.foundation.relocation.bringIntoViewRequester
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusDirection
import androidx.compose.ui.focus.onFocusEvent
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch

/**
 * IQKeyboardManager for Jetpack Compose (Android 17 / API 35+)
 * Inspired by hackiftekhar/IQKeyboardManager
 *
 * Provides:
 * - Automatic soft keyboard scroll avoidance
 * - Animated IQToolbar with Previous, Next, Title placeholder, and Done buttons
 * - Tap background to dismiss (resignFirstResponder)
 */
@Composable
fun ProvideIQKeyboardManager(
    modifier: Modifier = Modifier,
    distanceFromField: Int = 15,
    enableAutoToolbar: Boolean = ${config.includeToolbar},
    shouldResignOnTouchOutside: Boolean = true,
    toolbarDoneText: String = "Done",
    toolbarTintColor: Color = Color(0xFF007AFF),
    content: @Composable BoxScope.() -> Unit
) {
    val focusManager = LocalFocusManager.current
    val keyboardController = LocalSoftwareKeyboardController.current
    val imeInsets = WindowInsets.ime
    val density = LocalDensity.current
    val isKeyboardOpen = imeInsets.getBottom(density) > 0

    var currentFocusedTitle by remember { mutableStateOf("") }

    Box(
        modifier = modifier
            .fillMaxSize()
            .then(
                if (shouldResignOnTouchOutside) {
                    Modifier.clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null
                    ) {
                        focusManager.clearFocus()
                        keyboardController?.hide()
                    }
                } else Modifier
            )
            .windowInsetsPadding(WindowInsets.statusBars)
    ) {
        // Main Screen Content with IME Padding
        Box(
            modifier = Modifier
                .fillMaxSize()
                .imePadding()
        ) {
            content()
        }

        // Automatic IQToolbar placed right above the IME keyboard
        if (enableAutoToolbar) {
            AnimatedVisibility(
                visible = isKeyboardOpen,
                enter = slideInVertically(initialOffsetY = { it }),
                exit = slideOutVertically(targetOffsetY = { it }),
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .imePadding()
            ) {
                IQToolbar(
                    title = currentFocusedTitle,
                    tintColor = toolbarTintColor,
                    doneText = toolbarDoneText,
                    onPrevious = { focusManager.moveFocus(FocusDirection.Previous) },
                    onNext = { focusManager.moveFocus(FocusDirection.Next) },
                    onDone = {
                        focusManager.clearFocus()
                        keyboardController?.hide()
                    }
                )
            }
        }
    }
}

@Composable
fun IQToolbar(
    title: String,
    tintColor: Color,
    doneText: String,
    onPrevious: () -> Unit,
    onNext: () -> Unit,
    onDone: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier
            .fillMaxWidth()
            .height(44.dp),
        color = MaterialTheme.colorScheme.surfaceVariant,
        tonalElevation = 4.dp
    ) {
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            // Previous & Next Chevrons
            Row {
                IconButton(onClick = onPrevious) {
                    Icon(
                        imageVector = Icons.Default.KeyboardArrowUp,
                        contentDescription = "Previous Field",
                        tint = tintColor
                    )
                }
                IconButton(onClick = onNext) {
                    Icon(
                        imageVector = Icons.Default.KeyboardArrowDown,
                        contentDescription = "Next Field",
                        tint = tintColor
                    )
                }
            }

            // Toolbar Title / Placeholder
            Text(
                text = title.ifEmpty { "IQKeyboardManager" },
                style = MaterialTheme.typography.bodySmall.copy(fontSize = 12.sp),
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            // Done Button
            TextButton(onClick = onDone) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = doneText,
                        color = tintColor,
                        style = MaterialTheme.typography.labelLarge
                    )
                    Spacer(Modifier.width(4.dp))
                    Icon(
                        imageVector = Icons.Default.Check,
                        contentDescription = "Done",
                        tint = tintColor,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }
        }
    }
}

/**
 * Modifier to ensure focused field is brought into view above keyboard
 */
@Composable
fun Modifier.iqField(
    title: String = "",
    requester: BringIntoViewRequester = remember { BringIntoViewRequester() }
): Modifier {
    val coroutineScope = rememberCoroutineScope()
    return this
        .bringIntoViewRequester(requester)
        .onFocusEvent { focusState ->
            if (focusState.isFocused) {
                coroutineScope.launch {
                    requester.bringIntoView()
                }
            }
        }
}
`;

  const iosKeyboardServiceKotlin = `package ${config.packageName}.service

import android.inputmethodservice.InputMethodService
import android.view.View
import androidx.compose.ui.platform.ComposeView
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.ViewModelStore
import androidx.lifecycle.ViewTreeLifecycleOwner
import androidx.lifecycle.ViewTreeViewModelStoreOwner
import androidx.savedstate.SavedStateRegistry
import androidx.savedstate.SavedStateRegistryController
import androidx.savedstate.SavedStateRegistryOwner
import androidx.savedstate.ViewTreeSavedStateRegistryOwner
import ${config.packageName}.ui.IosKeyboardView

/**
 * Android InputMethodService (IME) that renders the authentic iOS 17 keyboard
 * for system-wide text input on Android 17 / API 35+.
 */
class IosKeyboardService : InputMethodService(), SavedStateRegistryOwner {

    private val lifecycle = CustomLifecycleOwner()
    private val savedStateRegistryController = SavedStateRegistryController.create(this)
    private val viewModelStore = ViewModelStore()

    override val savedStateRegistry: SavedStateRegistry
        get() = savedStateRegistryController.savedStateRegistry

    override fun onCreate() {
        super.onCreate()
        savedStateRegistryController.performRestore(null)
        lifecycle.handleLifecycleEvent(Lifecycle.Event.ON_CREATE)
    }

    override fun onCreateInputView(): View {
        val composeView = ComposeView(this).apply {
            ViewTreeLifecycleOwner.set(this, lifecycle)
            ViewTreeViewModelStoreOwner.set(this) { viewModelStore }
            ViewTreeSavedStateRegistryOwner.set(this, this@IosKeyboardService)

            setContent {
                IosKeyboardView(
                    onCharacter = { char ->
                        currentInputConnection?.commitText(char, 1)
                    },
                    onBackspace = {
                        currentInputConnection?.deleteSurroundingText(1, 0)
                    },
                    onActionReturn = {
                        currentInputConnection?.sendKeyEvent(
                            android.view.KeyEvent(
                                android.view.KeyEvent.ACTION_DOWN,
                                android.view.KeyEvent.KEYCODE_ENTER
                            )
                        )
                    }
                )
            }
        }
        return composeView
    }

    override fun onDestroy() {
        super.onDestroy()
        lifecycle.handleLifecycleEvent(Lifecycle.Event.ON_DESTROY)
    }
}

class CustomLifecycleOwner : androidx.lifecycle.LifecycleOwner {
    private val lifecycleRegistry = androidx.lifecycle.LifecycleRegistry(this)
    override val lifecycle: Lifecycle get() = lifecycleRegistry

    fun handleLifecycleEvent(event: Lifecycle.Event) {
        lifecycleRegistry.handleLifecycleEvent(event)
    }
}
`;

  const iosKeyboardViewKotlin = `package ${config.packageName}.ui

import android.view.HapticFeedbackConstants
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * Jetpack Compose UI replicating the iOS 17 Keyboard Layout
 * Supporting English QWERTY and Arabic (العربية)
 */
@Composable
fun IosKeyboardView(
    onCharacter: (String) -> Unit,
    onBackspace: () -> Unit,
    onActionReturn: () -> Unit,
    modifier: Modifier = Modifier
) {
    val view = LocalView.current
    var isArabic by remember { mutableStateOf(${config.languageSupport === 'ar'}) }
    var isShifted by remember { mutableStateOf(false) }

    fun playFeedback() {
        ${config.enableHaptics ? 'view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)' : '// Haptics disabled'}
    }

    val englishRows = listOf(
        listOf("q", "w", "e", "r", "t", "y", "u", "i", "o", "p"),
        listOf("a", "s", "d", "f", "g", "h", "j", "k", "l"),
        listOf("z", "x", "c", "v", "b", "n", "m")
    )

    val arabicRows = listOf(
        listOf("ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "د"),
        listOf("ش", "س", "ي", "ب", "ل", "ا", "ت", "ن", "م", "ك", "ط"),
        listOf("ذ", "ئ", "ء", "ؤ", "ر", "لا", "ى", "ة", "و", "ز", "ظ")
    )

    val activeRows = if (isArabic) arabicRows else englishRows

    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(Color(0xFFD0D3D9))
            .padding(horizontal = 4.dp, vertical = 6.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        // Render Key Rows
        activeRows.forEachIndexed { index, row ->
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.Center
            ) {
                if (index == 2 && !isArabic) {
                    // Shift Key
                    KeyButton(
                        label = if (isShifted) "⬆" else "⇧",
                        modifier = Modifier.weight(1.3f),
                        isSpecial = true,
                        onClick = {
                            playFeedback()
                            isShifted = !isShifted
                        }
                    )
                    Spacer(Modifier.width(4.dp))
                }

                row.forEach { char ->
                    val displayChar = if (isShifted) char.uppercase() else char
                    KeyButton(
                        label = displayChar,
                        modifier = Modifier.weight(1f),
                        onClick = {
                            playFeedback()
                            onCharacter(displayChar)
                        }
                    )
                    Spacer(Modifier.width(4.dp))
                }

                if (index == 2) {
                    // Backspace Key
                    KeyButton(
                        label = "⌫",
                        modifier = Modifier.weight(1.3f),
                        isSpecial = true,
                        onClick = {
                            playFeedback()
                            onBackspace()
                        }
                    )
                }
            }
        }

        // Bottom Action Bar: Globe, Space, Return
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            // Language switch
            KeyButton(
                label = if (isArabic) "EN" else "عربي",
                modifier = Modifier.weight(1.2f),
                isSpecial = true,
                onClick = {
                    playFeedback()
                    isArabic = !isArabic
                }
            )

            // Spacebar
            KeyButton(
                label = if (isArabic) "مسافة" else "space",
                modifier = Modifier.weight(4f),
                onClick = {
                    playFeedback()
                    onCharacter(" ")
                }
            )

            // Return / Done Key
            KeyButton(
                label = if (isArabic) "إدخال" else "return",
                modifier = Modifier.weight(1.6f),
                isReturn = true,
                onClick = {
                    playFeedback()
                    onActionReturn()
                }
            )
        }
    }
}

@Composable
fun KeyButton(
    label: String,
    modifier: Modifier = Modifier,
    isSpecial: Boolean = false,
    isReturn: Boolean = false,
    onClick: () -> Unit
) {
    val bgColor = when {
        isReturn -> Color(0xFF007AFF)
        isSpecial -> Color(0xFFB0B5BE)
        else -> Color.White
    }
    val textColor = if (isReturn) Color.White else Color.Black

    Surface(
        modifier = modifier
            .height(44.dp)
            .shadow(1.dp, RoundedCornerShape(6.dp)),
        shape = RoundedCornerShape(6.dp),
        color = bgColor
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    onClick = onClick
                ),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = label,
                color = textColor,
                fontSize = 17.sp,
                fontWeight = if (isSpecial || isReturn) FontWeight.SemiBold else FontWeight.Normal
            )
        }
    }
}
`;

  const mainActivityKotlin = `package ${config.packageName}

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import ${config.packageName}.iqkeyboard.ProvideIQKeyboardManager
import ${config.packageName}.iqkeyboard.iqField

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                ProvideIQKeyboardManager(
                    distanceFromField = 15,
                    enableAutoToolbar = ${config.includeToolbar},
                    shouldResignOnTouchOutside = true
                ) {
                    DemoRegistrationScreen()
                }
            }
        }
    }
}

@Composable
fun DemoRegistrationScreen() {
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = "IQKeyboardManager Demo",
            style = MaterialTheme.typography.headlineMedium
        )
        Text(
            text = "Fields automatically scroll into view with animated iOS toolbar.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("Full Name") },
            modifier = Modifier.fillMaxWidth().iqField("Full Name")
        )

        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email Address") },
            modifier = Modifier.fillMaxWidth().iqField("Email Address")
        )

        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Password") },
            modifier = Modifier.fillMaxWidth().iqField("Password")
        )

        Button(
            onClick = { /* Submit */ },
            modifier = Modifier.fillMaxWidth().height(48.dp)
        ) {
            Text("Create Account")
        }
    }
}
`;

  const androidManifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${config.packageName}">

    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="${config.appName}"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.Material.Light.NoActionBar">

        <!-- Main Test Activity -->
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- iOS 17 Keyboard InputMethodService -->
        <service
            android:name=".service.IosKeyboardService"
            android:exported="true"
            android:permission="android.permission.BIND_INPUT_METHOD">
            <intent-filter>
                <action android:name="android.view.InputMethod" />
            </intent-filter>
            <meta-data
                android:name="android.view.im"
                android:resource="@xml/method" />
        </service>

    </application>
</manifest>
`;

  const methodXml = `<?xml version="1.0" encoding="utf-8"?>
<input-method xmlns:android="http://schemas.android.com/apk/res/android"
    android:settingsActivity=".MainActivity"
    android:isDefault="false">
    <subtype
        android:label="English (iOS 17 Keyboard)"
        android:imeSubtypeLocale="en_US"
        android:imeSubtypeMode="keyboard" />
    <subtype
        android:label="العربية (iOS 17 Keyboard)"
        android:imeSubtypeLocale="ar"
        android:imeSubtypeMode="keyboard" />
</input-method>
`;

  const buildGradleKts = `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "${config.packageName}"
    compileSdk = ${config.targetSdk}

    defaultConfig {
        applicationId = "${config.packageName}"
        minSdk = ${config.minSdk}
        targetSdk = ${config.targetSdk}
        versionCode = ${config.versionCode}
        versionName = "${config.versionName}"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug") // Demo signing
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_21
        targetCompatibility = JavaVersion.VERSION_21
    }
    kotlinOptions {
        jvmTarget = "21"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.activity.compose)
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons.extended)
    implementation(libs.androidx.core.ktx)
}
`;

  const githubActionsYml = `name: Build Android 17 APK & Bundle

on:
  push:
    branches: [ "main" ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Set up JDK 21
      uses: actions/setup-java@v4
      with:
        java-version: '21'
        distribution: 'temurin'

    - name: Setup Android SDK
      uses: android-actions/setup-android@v3

    - name: Grant execute permission for gradlew
      run: chmod +x gradlew

    - name: Build Release APK with Gradle
      run: ./gradlew assembleRelease --stacktrace

    - name: Upload APK Artifact
      uses: actions/upload-artifact@v4
      with:
        name: iqkeyboard-ios17-release.apk
        path: app/build/outputs/apk/release/*.apk
`;

  const readmeMd = `# ${config.appName} (Android 17 / API 35+)

High-performance Android implementation of **hackiftekhar/IQKeyboardManager** combined with an authentic **iOS 17 Soft Keyboard IME** built with **Kotlin** and **Jetpack Compose**.

## Features
- **IQKeyboardManager Engine**: Zero boilerplate scroll offset calculation, \`ProvideIQKeyboardManager\`, and \`BringIntoViewRequester\`.
- **IQToolbar**: Previous, Next, Placeholder, and Done buttons right above soft keyboard.
- **iOS 17 System Keyboard (IME)**: Full \`InputMethodService\` with English QWERTY and Arabic layouts, haptic feedback, and authentic iOS styling.
- **Ready for Android 15, 16, and 17 (API 35+)** with edge-to-edge window insets.

## How to Build the APK
1. Open this folder in **Android Studio** (Ladybug or newer).
2. Wait for Gradle sync to complete.
3. Run in terminal:
   \`\`\`bash
   ./gradlew assembleRelease
   \`\`\`
4. Your generated APK will be at:
   \`app/build/outputs/apk/release/app-release.apk\`
`;

  return {
    packagePath,
    iqKeyboardManagerKotlin,
    iosKeyboardServiceKotlin,
    iosKeyboardViewKotlin,
    mainActivityKotlin,
    androidManifestXml,
    methodXml,
    buildGradleKts,
    githubActionsYml,
    readmeMd,
  };
};

export const generateAndDownloadZip = async (config: AndroidBuildConfig) => {
  const files = getAndroidFiles(config);
  const zip = new JSZip();

  // Root project files
  zip.file('README.md', files.readmeMd);
  zip.file('.github/workflows/build-apk.yml', files.githubActionsYml);
  zip.file('gradlew', '#!/usr/bin/env sh\nexec gradle "$@"\n');

  // App module
  zip.file('app/build.gradle.kts', files.buildGradleKts);
  zip.file('app/src/main/AndroidManifest.xml', files.androidManifestXml);
  zip.file('app/src/main/res/xml/method.xml', files.methodXml);

  // Kotlin source files
  const baseSrc = `app/src/main/java/${files.packagePath}`;
  zip.file(`${baseSrc}/MainActivity.kt`, files.mainActivityKotlin);
  zip.file(`${baseSrc}/iqkeyboard/IQKeyboardManager.kt`, files.iqKeyboardManagerKotlin);
  zip.file(`${baseSrc}/service/IosKeyboardService.kt`, files.iosKeyboardServiceKotlin);
  zip.file(`${baseSrc}/ui/IosKeyboardView.kt`, files.iosKeyboardViewKotlin);

  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `${config.appName.toLowerCase().replace(/\s+/g, '-')}-android17-project.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
};
