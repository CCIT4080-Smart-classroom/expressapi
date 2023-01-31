const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
var setCookie = require('set-cookie-parser');
const app = express();
const PORT = 443;
app.set('x-powered-by', false);


// mysql = require('mysql2');
// var pool = mysql.createPool({
//     host: "localhost",
//     user: "xoaincom_CCIT4080_admin",
//     password: "PmiW9z6cf%m[",
//     database: "xoaincom_CCIT4080",
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

app.use(express.json());

var corsOptions = {
    origin: /ccit4080\.tylerl\.cyou$/,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
};
app.use(cors(corsOptions))

app.post('/attendance/checkin', (req, res) => {
    const { student_id } = req.body;
    pool.query(`INSERT INTO attendance (student_id) VALUES ('${student_id}')`, (err, rows) => {
        if (err) throw err;
        res.status(200).send()
    });
});

app.get('/attendance/:student_id', (req, res) => {
    const { student_id } =  req.params;
    pool.query(`SELECT * FROM attendance WHERE student_id = '${student_id}'`, (err, result) => {
        if (err) throw err;
        var ts = [];
        for (var i = 0; i < result.length; i++) {
            ts.push(result[i].attendance_ts);
        }
        res.status(200).send(ts)
    });
});


app.get('/student/info', (req, res) => {
    const info = {}
    axios.request("https://www.score.hku.hk/psc/csprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSS_MY_ACAD.GBL", {
        "headers": {
          "cookie": req.headers.cookie
        },
        maxRedirects: 0,
        "method": "GET"
    })
    .then((response) => {       
        const html_data = response.data;
        const $ = cheerio.load(html_data);
        info["name"] = $("#DERIVED_SSTSNAV_PERSON_NAME").text()
        info["program"] = $("#win0divDERIVED_SSSACAD_HTMLAREA1 > div > span:nth-child(11)").text().split(" - ")[1]
        info["theme"] = $("#win0divDERIVED_SSSACAD_HTMLAREA1 > div > span:nth-child(15)").text().split(" - ")[1]
        res.status(200).send({"data":info}) 
    })
    .catch((error) => {
        res.status(200).send({"error":{
            "code": error.response.status,
            "message": error.message
        }});
    })
});

app.get('/student/course', (req, res) => {
    const courseArray = [];
    axios.request("https://www.score.hku.hk/psc/csprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSR_SSENRL_LIST.GBL", {
        "headers": {
          "cookie": req.headers.cookie
        },
        maxRedirects: 0,
        "method": "GET"
    })
    .then((response) => {       
        const html_data = response.data;
        const $ = cheerio.load(html_data);
        const tableSelector = "div[id^=win0divDERIVED_REGFRM1_DESCR20]"
        $(tableSelector).each((courseIndex, courseElem) => {
            var courseDetails = {};
            var h = $("table > tbody > tr:nth-child(1) > td", courseElem).text()
            courseDetails["code"] = h.split(" - ")[0].replace(/\s/, "");
            courseDetails["name"] = h.split(" - ")[1];
            const components = []
            var classDetails = {}
            $(`tr[id^=trCLASS_MTG_VW\$${courseIndex}]`).each((classIndex, classElem) => {
                var nbr = $("td:nth-child(1)", classElem).text().trim();
                if (nbr){
                    classDetails["number"] = $("td:nth-child(2)", classElem).text().trim();
                    classDetails["type"] = $("td:nth-child(3)", classElem).text().trim();
                }
                classDetails["time"] = $("td:nth-child(4)", classElem).text().trim();
                classDetails["room"] = $("td:nth-child(5)", classElem).text().trim();
                components.push(classDetails);
            })
            courseDetails["components"] = components
            courseArray.push(courseDetails);
        });
        // return coinArray;
        // console.log(courseArray)
        res.status(200).send({"data":courseArray}) 
    })
    .catch((error) => {
        res.status(200).send({"error":{
            "code": error.response.status,
            "message": error.message
        }});
    })
});

app.post('/score/login', (req, res) => {
    const { username } = req.body;
    const { password } = req.body;
    axios.request("https://cas.hkuspace.hku.hk/cas/login", {
        "method": "GET"
    })
    .then((response) => {   
        const $ = cheerio.load(response.data);   
        const lt = $("#credential > div.tpad10.h-margin > div:nth-child(4) > input[type=hidden]:nth-child(1)").attr('value')
        return axios.request("https://cas.hkuspace.hku.hk/cas/login", {
            headers: {
                "cookie": response.headers['set-cookie'],
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: "POST",
            params: {
                "method":"POST"
            },
            data: `username=${username}&password=${password}&lt=${lt}&execution=e1s1&_eventId=submit&submit=Login`
        })
    })
    .then((response) => {   
        if (!response.headers['set-cookie']){
            throw {
                response: response,
                message: "Wrong credentials"
            };
        }
        return axios.request("https://cas.hkuspace.hku.hk/cas/login", {
            headers: {
                "cookie": response.headers['set-cookie']
            },
            method: "GET",
            params: {
                "method":"POST",
                "service":"https://www.score.hku.hk/psp/csprd/EMPLOYEE/HRMS/h/?tab=DEFAULT&cas=SPACE_STUDENT&lookup=N&java=HKINFI012&msg=9&languageCd=ENG"
            }
        })
    })
    .then((response) => {
        const $ = cheerio.load(response.data);   
        // console.log($("body > form > div > textarea").text())
        return axios.request("https://www.score.hku.hk/psp/csprd/EMPLOYEE/HRMS/h/", {
            method: "POST",
            params: {
                "tab": "DEFAULT",
                "cas": "SPACE_STUDENT",
                "lookup": "N",
                "java": "HKINFI012",
                "msg": "9",
                "languageCd": "ENG"
            },
            data: `ticket=${$("body > form > div > textarea").text()}`,
            maxRedirects: 0,    
            validateStatus: function(status) {
                return status >= 200 && status < 303;
            }
        })
    })
    .then((response) => {
        var cookies = setCookie.parse(response)
        // console.log(cookies[5])
        res.cookie(cookies[5].name, cookies[5].value, {encode: v => v})
        res.send()
    })
    .catch((error) => {
        res.status(200).send({"error":{
            "code": error.response.status,
            "message": error.message
        }});
    })
});



app.listen(
    PORT,
    () => console.log(`listening on port ${PORT}`)    
);