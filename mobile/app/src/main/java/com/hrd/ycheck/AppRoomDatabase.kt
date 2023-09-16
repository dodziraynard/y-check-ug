package com.hrd.ycheckimport android.app.Applicationimport androidx.room.*import androidx.sqlite.db.SupportSQLiteDatabaseimport com.hrd.ycheck.dao.ConfigurationDaoimport com.hrd.ycheck.dao.UserDaoimport com.hrd.ycheck.models.*import com.hrd.ycheck.utils.StringListConvectorimport java.util.concurrent.ExecutorServiceimport java.util.concurrent.Executors@Database(entities = [User::class, Configuration::class], version = 1, autoMigrations = [])@TypeConverters(StringListConvector::class)abstract class AppRoomDatabase : RoomDatabase() {    abstract fun UserDao(): UserDao    abstract fun ConfigurationDao(): ConfigurationDao    companion object {        private const val DATABASE_NAME = "ycheck_database1.sql"        private const val NUMBER_OF_THREADS = 4        private var mContext: Application? = null        var INSTANCE: AppRoomDatabase? = null        val databaseWriteExecutor: ExecutorService = Executors.newFixedThreadPool(NUMBER_OF_THREADS)        private val sRoomDatabaseCallback: Callback = object : Callback() {            override fun onOpen(db: SupportSQLiteDatabase) {                super.onCreate(db)            }        }        fun getDatabase(context: Application): AppRoomDatabase? {            mContext = context            if (INSTANCE == null) {                synchronized(AppRoomDatabase::class.java) {                    if (INSTANCE == null) {                        INSTANCE = Room.databaseBuilder(                            context.applicationContext, AppRoomDatabase::class.java, DATABASE_NAME                        ).addMigrations().addCallback(sRoomDatabaseCallback).build()                    }                }            }            return INSTANCE        }    }}