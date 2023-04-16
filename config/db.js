const mysql = require('mysql2');

var pool = mysql.createPool({
    host: "localhost",
    user: "xroostco_admin",
    password: process.env.MYSQL_PASSWORD,
    database: "xroostco_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool