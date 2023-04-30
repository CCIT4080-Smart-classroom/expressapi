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
// app.use(function(request, response, next) {

//     if (process.env.NODE_ENV != 'development' && !request.secure) {
//        return response.redirect("https://" + request.headers.host + request.url);
//     }

//     next();
// })


// app.post('/attendance/checkin', (req, res) => {
//     const { student_id } = req.body;
//     pool.query(`INSERT INTO attendance (student_id) VALUES ('${student_id}')`, (err, rows) => {
//         if (err) throw err;
//         res.status(200).send({"data":{
//             "message": "Checked in"
//         }});
//     });
// });

// app.get('/attendance/:student_id', (req, res) => {
//     const { student_id } =  req.params;
//     pool.query(`SELECT UNIX_TIMESTAMP(attendance_ts) FROM attendance WHERE student_id = '${student_id}'`, (err, result) => {
//         if (err) throw err;
//         var ts = [];
//         for (var i = 0; i < result.length; i++) {
//             var tzoffset = (new Date()).getTimezoneOffset() * 60;
//             var localISOTime = (new Date((result[i]['UNIX_TIMESTAMP(attendance_ts)'] - tzoffset)*1000)).toISOString().slice(0, -1);
//             ts.push(localISOTime);
//         }
//         res.status(200).send({"data":ts})
//     });
// });


// app.get('/student/info', (req, res) => {
//     const info = {}
//     axios.request("https://www.score.hku.hk/psc/csprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSS_MY_ACAD.GBL", {
//         "headers": {
//           "cookie": req.headers.cookie
//         },
//         maxRedirects: 0,
//         "method": "GET"
//     })
//     .then((response) => {       
//         const html_data = response.data;
//         const $ = cheerio.load(html_data);
//         info["name"] = $("#DERIVED_SSTSNAV_PERSON_NAME").text()
//         info["program"] = $("#win0divDERIVED_SSSACAD_HTMLAREA1 > div > span:nth-child(11)").text().split(" - ")[1]
//         info["theme"] = $("#win0divDERIVED_SSSACAD_HTMLAREA1 > div > span:nth-child(15)").text().split(" - ")[1]
//         res.status(200).send({"data":info}) 
//     })
//     .catch((error) => {
//         res.status(200).send({"error":{
//             "code": error.response.status,
//             "message": error.message
//         }});
//     })
// });

// app.get('/student/course', (req, res) => {
//     const courseArray = [];
//     axios.request("https://www.score.hku.hk/psc/csprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSR_SSENRL_LIST.GBL", {
//         "headers": {
//           "cookie": req.headers.cookie
//         },
//         maxRedirects: 0,
//         "method": "GET"
//     })
//     .then((response) => {       
//         const html_data = response.data;
//         const $ = cheerio.load(html_data);
//         const tableSelector = "div[id^=win0divDERIVED_REGFRM1_DESCR20]"
//         $(tableSelector).each((courseIndex, courseElem) => {
//             var courseDetails = {};
//             var h = $("table > tbody > tr:nth-child(1) > td", courseElem).text()
//             courseDetails["code"] = h.split(" - ")[0].replace(/\s/, "");
//             courseDetails["name"] = h.split(" - ")[1];
//             const components = []
//             var cls_num, cls_type
//             $(`tr[id^=trCLASS_MTG_VW\$${courseIndex}]`).each((classIndex, classElem) => {
//                 const classDetails = {}
//                 var td = $(classElem).children().map((i, elem) => {
//                     return $(elem).text().trim();
//                 })
//                 if (td[0]){
//                     cls_num = td[1];
//                     cls_type = td[2];
//                 }
//                 classDetails["number"] = cls_num;
//                 classDetails["type"] = cls_type;
//                 classDetails["time"] = td[3];
//                 classDetails["room"] = td[4];
//                 console.log(classDetails)
//                 components.push(classDetails);
//             }) 
//             courseDetails["components"] = components
//             courseArray.push(courseDetails);
//         });
//         res.status(200).send({"data":courseArray}) 
//     })
//     .catch((error) => {
//         console.log(error)
//         res.status(200).send({"error":{
//             "code": error.response.status,
//             "message": error.message
//         }});
//     })
// });

// app.post('/student/assignment', (req, res) => {
//     const { username } = req.body;
//     const { password } = req.body;
//     var FederationRedirectUrl;
//     var MoodleSessionSOUL2;
//     axios.request("https://soul2.hkuspace.hku.hk/auth/oidc/", {
//             method: "GET",
//             maxRedirects: 0,
//             validateStatus: function(status) {
//                 return status == 303;
//             }
//         }
//     )
//     .then((response) => {
//         return axios.request(response.headers.location, {
//                 method: "GET"
//             }
//         )
//     })
//     .then((response) => {   
//         let originalRequest = response.data.match(/"sCtx":"(.*?)"/)[1]
//         return axios.request("https://login.microsoftonline.com/common/GetCredentialType", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             data: {
//                 "username": "@learner.hkuspace.hku.hk",
//                 "isOtherIdpSupported": true,
//                 "checkPhones": true,
//                 "isRemoteNGCSupported": true,
//                 "isCookieBannerShown": false,
//                 "isFidoSupported": true,
//                 "originalRequest": originalRequest,
//                 "country": "HK",
//                 "forceotclogin": false,
//                 "isExternalFederationDisallowed": false,
//                 "isRemoteConnectSupported": false,
//                 "federationFlags": 0,
//                 "isSignup": false,
//                 "isAccessPassSupported": true
//             }     
//         })
//     })
//     .then((response) => {   
//         FederationRedirectUrl = response.data.Credentials.FederationRedirectUrl
//         // console.log(FederationRedirectUrl)
//         return axios.request(FederationRedirectUrl, {
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             method: "POST",
//             maxRedirects: 0,
//             data: `UserName=Learner%5c${username}&Password=${password}&AuthMethod=FormsAuthentication`,    
//             validateStatus: function(status) {
//                 return status >= 200 && status < 303;
//             }
//         })
//     })
//     .then((response) => {   
//         if (!response.headers['set-cookie']){
//             throw {
//                 response: response,
//                 message: "Wrong credentials"
//             };
//         }
//         return axios.request(FederationRedirectUrl, {
//             headers: {
//                 "cookie": response.headers['set-cookie']
//             },
//             method: "GET",
//             maxRedirects: 0,   
//             validateStatus: function(status) {
//                 return status >= 200 && status < 303;
//             }
//         })
//     })
//     .then((response) => {   
//         const $ = cheerio.load(response.data);   
//         let wresult = $("body > form > input[type=hidden]:nth-child(2)").attr('value')
//         let wctx = $("body > form > input[type=hidden]:nth-child(3)").attr('value')
//         return axios.request("https://login.microsoftonline.com/login.srf", {
//             headers: {
//                 "cookie": "AADSSO=NA|NoExtension",
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             method: "POST",
//             data: {
//                 "wa": "wsignin1.0",
//                 "wresult": wresult,
//                 "wctx": wctx
//             }
//         })
//     })
//     .then((response) => {   
//         const $ = cheerio.load(response.data);   
//         let code = $("body > form > input[type=hidden]:nth-child(1)").attr('value')
//         let state = $("body > form > input[type=hidden]:nth-child(2)").attr('value')
//         let session_state = $("body > form > input[type=hidden]:nth-child(3)").attr('value')
//         return axios.request("https://soul2.hkuspace.hku.hk/auth/oidc/", {
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             method: "POST",
//             data: {
//                 "code": code,
//                 "state": state,
//                 "session_state": session_state
//             },
//             maxRedirects: 0,
//             validateStatus: function(status) {
//                 return status == 303;
//             }
//         })
//     })
//     .then((response) => {   
//         MoodleSessionSOUL2 = response.headers["set-cookie"][2]
//         return axios.request("https://soul2.hkuspace.hku.hk/", {
//             headers: {
//                 "cookie": MoodleSessionSOUL2
//             },
//             method: "GET",
//             maxRedirects: 0
//         })
//     })
//     .then((response) => {     
//         let sesskey = response.data.match(/"sesskey":"(.*?)"/)[1]
//         // console.log(sesskey)
//         return axios.request("https://soul2.hkuspace.hku.hk/lib/ajax/service.php", {
//             headers: {
//                 'Content-Type': 'application/json',
//                 "cookie": MoodleSessionSOUL2
//             },
//             method: "POST",
//             data: [
//                 {
//                     "index": 0,
//                     "methodname": "core_calendar_get_action_events_by_timesort",
//                     "args": {
//                         "limitnum": 50,
//                         "timesortfrom": parseInt(Date.now()/1000)
//                     }
//                 }
//             ],
//             params: {
//                 "sesskey": sesskey
//             }
//         })
//     })
//     .then((response) => {   
//         let asslist = response.data[0].data.events;
//         let parsedAssList = [];
//         for (var i = 0; i < asslist.length; i++) {
//             console.log(asslist[i])
//             parsedAssList.push({
//                 name: asslist[i].name,
//                 end_time: asslist[i].timesort,
//                 course_name: asslist[i].course.fullname,
//                 url: asslist[i].action.url
//             })
//         }
//         // console.log(asslist)
//         res.status(200).send({data: parsedAssList})
//     })
//     .catch((error) => {
//         console.log(error)
//         res.status(200).send({"error":{
//             "code": error.response.status,
//             "message": error.message
//         }});
//     })
// });

// app.post('/auth/score', (req, res) => {
//     const { username } = req.body;
//     const { password } = req.body;
//     axios.request("https://cas.hkuspace.hku.hk/cas/login", {
//         "method": "GET"
//     })
//     .then((response) => {   
//         const $ = cheerio.load(response.data);   
//         const lt = $("#credential > div.tpad10.h-margin > div:nth-child(4) > input[type=hidden]:nth-child(1)").attr('value')
//         return axios.request("https://cas.hkuspace.hku.hk/cas/login", {
//             headers: {
//                 "cookie": response.headers['set-cookie'],
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             method: "POST",
//             params: {
//                 "method":"POST"
//             },
//             data: `username=${username}&password=${password}&lt=${lt}&execution=e1s1&_eventId=submit&submit=Login`
//         })
//     })
//     .then((response) => {   
//         if (!response.headers['set-cookie']){
//             throw {
//                 response: response,
//                 message: "Wrong credentials"
//             };
//         }
//         return axios.request("https://cas.hkuspace.hku.hk/cas/login", {
//             headers: {
//                 "cookie": response.headers['set-cookie']
//             },
//             method: "GET",
//             params: {
//                 "method":"POST",
//                 "service":"https://www.score.hku.hk/psp/csprd/EMPLOYEE/HRMS/h/?tab=DEFAULT&cas=SPACE_STUDENT&lookup=N&java=HKINFI012&msg=9&languageCd=ENG"
//             }
//         })
//     })
//     .then((response) => {
//         const $ = cheerio.load(response.data);   
//         // console.log($("body > form > div > textarea").text())
//         return axios.request("https://www.score.hku.hk/psp/csprd/EMPLOYEE/HRMS/h/", {
//             method: "POST",
//             params: {
//                 "tab": "DEFAULT",
//                 "cas": "SPACE_STUDENT",
//                 "lookup": "N",
//                 "java": "HKINFI012",
//                 "msg": "9",
//                 "languageCd": "ENG"
//             },
//             data: `ticket=${$("body > form > div > textarea").text()}`,
//             maxRedirects: 0,    
//             validateStatus: function(status) {
//                 return status >= 200 && status < 303;
//             }
//         })
//     })
//     .then((response) => {
//         var cookies = setCookie.parse(response)
//         // console.log(cookies[5])
//         res.cookie(cookies[5].name, cookies[5].value, {encode: v => v})
//         res.status(200).send({"data":{
//             "message": "Logged in"
//         }});
//     })
//     .catch((error) => {
//         res.status(200).send({"error":{
//             "code": error.response.status,
//             "message": error.message
//         }});
//     })
// });

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
// https.createServer({
//         key: fs.readFileSync( 'key.pem' ),
//         cert: fs.readFileSync( 'cert.pem' ),
//         ca: fs.readFileSync( 'ca.pem')
// }, app).listen(
//     PORT,
//     () => console.log(`listening on port ${PORT}`)    
// );

// app.listen(
//     PORT,
//     () => console.log(`listening on port ${PORT}`)    
// );