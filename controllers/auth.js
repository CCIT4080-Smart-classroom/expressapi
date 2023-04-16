const axios = require('axios');
const cheerio = require('cheerio');
var setCookie = require('set-cookie-parser');

exports.loginScore = ((req, res) => {    
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
        res.status(200).send({"data":{
            "message": "Logged in"
        }});
    })
    .catch((error) => {
        res.status(200).send({"error":{
            "code": error.response.status,
            "message": error.message
        }});
    })
})
