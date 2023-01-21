const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 443;
app.set('x-powered-by', false);


mysql = require('mysql2');
var pool = mysql.createPool({
    host: "localhost",
    user: "xoaincom_CCIT4080_admin",
    password: "PmiW9z6cf%m[",
    database: "xoaincom_CCIT4080",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.use(express.json());

var corsOptions = {
    origin: /ccit4080\.tylerl\.cyou$/,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
};
app.use(cors(corsOptions))

app.post('/student/checkin', (req, res) => {
    const { student_id } = req.body;
    pool.query(`INSERT INTO attendence (student_id) VALUES ('${student_id}')`, (err, rows) => {
        if (err) throw err;
        res.status(200).send("Success")
    });
});


app.listen(
    PORT,
    () => console.log(`listening on port ${PORT}`)    
);