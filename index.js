const express = require('express');
const cors = require('cors');
const { marked } = require('marked')
var fs = require('fs'),
    http = require('http'),
    https = require('https')
const path = require('path');
const app = express();
const PORT = 443;

const studentRoutes = require('./routes/student');
const lecturerRoutes = require('./routes/lecturer');
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');

app.set('x-powered-by', false);

app.use(express.json());
app.set('view engine', 'jade');
var corsOptions = {
    origin: /ccit4080\.tylerl\.cyou$/,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
};
app.use(cors(corsOptions))

app.use('/student', studentRoutes)
app.use('/lecturer', lecturerRoutes)
app.use('/auth', authRoutes);
app.use('/attendance', attendanceRoutes);

app.get("/", (req, res) => {
	res.render(
		'index',
		{contents : marked(fs.readFileSync(path.resolve('./README.md'), 'utf8'))}
	);
});

https.createServer({
    key: fs.readFileSync("./pem/private.key.pem"),
    cert: fs.readFileSync("./pem/domain.cert.pem"),
    ca: [
        fs.readFileSync('./pem/intermediate.cert.pem'),
        fs.readFileSync('./pem/public.key.pem')
        ]
}, app).listen(
    PORT,
    () => console.log(`listening on port ${PORT}`)    
);