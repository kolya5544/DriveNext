package ax.nk.drivenext.core

import android.content.Context
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

val Context.dataStore by preferencesDataStore("drive_next_prefs")

class AppPreferences(private val context: Context) {

    companion object {
        val IS_FIRST_LAUNCH = booleanPreferencesKey("is_first_launch")
        val TOKEN = stringPreferencesKey("auth_token")
        private val ONBOARDING_COMPLETED_KEY = booleanPreferencesKey("onboarding_completed")
    }

    val isFirstLaunch: Flow<Boolean> = context.dataStore.data.map { prefs ->
        prefs[IS_FIRST_LAUNCH] ?: true
    }

    val token: Flow<String?> = context.dataStore.data.map { prefs ->
        prefs[TOKEN]
    }

    suspend fun setFirstLaunchDone() {
        context.dataStore.edit { prefs ->
            prefs[IS_FIRST_LAUNCH] = false
        }
    }

    suspend fun saveToken(token: String) {
        context.dataStore.edit { prefs ->
            prefs[TOKEN] = token
        }
    }

    suspend fun clearToken() {
        context.dataStore.edit { prefs ->
            prefs.remove(TOKEN)
        }
    }
}
