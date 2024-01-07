import android.content.Context
import com.google.gson.Gson
import java.io.BufferedReader
import java.io.InputStreamReader


data class FormField(
    val number: Int,
    val field: String,
    val label: String,
    val description: String?,
    val type: String,
    val required: Boolean,
    val options: List<String>? = null,
    val errorMessage: String? = null,
    val constraint: List<Constraint>? = null,
    val dependencies: List<Dependency>? = null,
    val data_source_util_function_name: String? = null,
    val validator_function_name: String? = null
)

data class Constraint(
    val minAge: Int,
    val maxAge: Int
)

data class Dependency(
    val field: String,
    val value: String,
    val reversed: Boolean? = null
)


class JsonFileReader(private val context: Context) {

    fun readJsonFile(fileName: String): String? {
        val assetManager = context.assets

        try {
            // Open the file
            val inputStream = assetManager.open(fileName)
            val reader = BufferedReader(InputStreamReader(inputStream))

            // Read the file contents
            val stringBuilder = StringBuilder()
            var line: String?
            while (reader.readLine().also { line = it } != null) {
                stringBuilder.append(line)
            }

            // Close the reader and return the JSON string
            reader.close()
            return stringBuilder.toString()

        } catch (e: Exception) {
            e.printStackTrace()
        }

        return null
    }

    inline fun <reified T> parseJsonFile(fileName: String): T? {
        val jsonString = readJsonFile(fileName)
        return Gson().fromJson(jsonString, T::class.java)
    }
}
