// const sql = require('mssql');

// const requiredEnv = ['DB_USER', 'DB_PASSWORD', 'DB_SERVER', 'DB_DATABASE', 'DB_PORT'];
// requiredEnv.forEach((key) => {
//     if (!process.env[key]) {
//         console.error(`Missing environment variable: ${key}`);
//         process.exit(1);
//     }
// });

// const dbConfig = {
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     server: process.env.DB_SERVER,
//     database: process.env.DB_DATABASE,
//     port: parseInt(process.env.DB_PORT, 10),
//     options: {
//         encrypt: false,
//         trustServerCertificate: true,
//     }, pool: {
//         max: 10,
//         min: 0,
//         idleTimeoutMillis: 30000
//     }
// };

// let pool = null;

// async function getConnection() {
//     try {
//         if (!pool || !pool.connected) {
//             pool = await sql.connect(dbConfig);
//             console.log('✅ Connected to MSSQL');
//         }
//         return pool;
//     } catch (err) {
//         console.error('❌ MSSQL Connection Failed:', err.message);
//         throw err;
//     }
// }

// async function closeConnection() {
//     try {
//         if (pool && pool.connected) {
//             await pool.close();
//             console.log('🔒 MSSQL connection closed');
//         }
//     } catch (err) {
//         console.error('❌ Error closing MSSQL connection:', err.message);
//     }
// }

// function isConnected() {
//     return !!(pool && pool.connected);
// }

// module.exports = {
//     sql,
//     getConnection,
//     closeConnection,
//     isConnected,
// };

// db.js

const sql = require('mssql');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT, 10),
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('✅ Connected to MSSQL');
        return pool;
    })
    .catch(err => {
        console.error('❌ MSSQL Connection Failed:', err.message);
        process.exit(1);
    });

module.exports = {
    sql,
    poolPromise
};
