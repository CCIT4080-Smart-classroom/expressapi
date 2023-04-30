const sqlconfig = {
    user: "tyler",
    password: 'pr9b3ic4?HIswI8+_r3_',
    server: "tylerjlcy.database.windows.net",
    port: 1433,
    database: 'db', // better stored in an app setting such as process.env.DB_NAME
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
}


// const conn = new sql.connect(config);


module.exports = sqlconfig