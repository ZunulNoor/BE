const { createPool } = require('mysql2');
require('dotenv').config()

const pool = createPool(
    {
        port: process.env.MYSQL_ADDON_PORT,
        host: process.env.MYSQL_ADDON_HOST,
        user: process.env.MYSQL_ADDON_USER,
        password: process.env.MYSQL_ADDON_PASSWORD,
        database: process.env.MYSQL_ADDON_DB,
        // connection:process.env.MYSQL_ADDON_URI,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    }
)

module.exports = pool