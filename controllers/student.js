const axios = require('axios');
const cheerio = require('cheerio');

exports.studentInfo = ((req, res) => {
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

const weekdayMap = {
    Su: 0,
    Mo: 1,
    Tu: 2,
    We: 3,
    Th: 4,
    Fr: 5,
    Sa: 6,
  };

exports.studentCourse = ((req, res) => {
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
            var cls_num, cls_type
            $(`tr[id^=trCLASS_MTG_VW\$${courseIndex}]`).each((classIndex, classElem) => {
                const classDetails = {}
                var td = $(classElem).children().map((i, elem) => {
                    return $(elem).text().trim();
                })
                if (td[0]){
                    cls_num = td[1];
                    cls_type = td[2];
                }
                classDetails["number"] = cls_num;
                classDetails["type"] = cls_type;
                let timedetails = td[3];
                if (timedetails.includes("-")) {
                    // let temp, weekday, startTime, endTime, startDate, endDate;
                    let [temp, endTime] = timedetails.split(" - ");
                    let [weekday, startTime] = temp.split(" ");
                    classDetails["weekday"] = weekdayMap[weekday]
                    classDetails["startTime"] = startTime;
                    classDetails["endTime"] = endTime;
                    let [startDate, endDate] = td[6].split(" - ");
                    var [day, month, year] = startDate.split('/');
                    classDetails["startDate"] = `${year}-${month}-${day}`;
                    var [day, month, year] = endDate.split('/');
                    classDetails["endDate"] = `${year}-${month}-${day}`;
                }
                classDetails["room"] = td[4];
                // console.log(classDetails)
                components.push(classDetails);
            }) 
            courseDetails["components"] = components
            courseArray.push(courseDetails);
        });
        res.status(200).send({"data":courseArray}) 
    })
    .catch((error) => {
        console.log(error)
        res.status(200).send({"error":{
            "code": error.response.status,
            "message": error.message
        }});
    })
});

exports.studentAssignment = ((req, res) => {
    const { username } = req.body;
    const { password } = req.body;
    var FederationRedirectUrl;
    var MoodleSessionSOUL2;
    axios.request("https://soul2.hkuspace.hku.hk/auth/oidc/", {
            method: "GET",
            maxRedirects: 0,
            validateStatus: function(status) {
                return status == 303;
            }
        }
    )
    .then((response) => {
        return axios.request(response.headers.location, {
                method: "GET"
            }
        )
    })
    .then((response) => {   
        let originalRequest = response.data.match(/"sCtx":"(.*?)"/)[1]
        return axios.request("https://login.microsoftonline.com/common/GetCredentialType", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                "username": "@learner.hkuspace.hku.hk",
                "isOtherIdpSupported": true,
                "checkPhones": true,
                "isRemoteNGCSupported": true,
                "isCookieBannerShown": false,
                "isFidoSupported": true,
                "originalRequest": originalRequest,
                "country": "HK",
                "forceotclogin": false,
                "isExternalFederationDisallowed": false,
                "isRemoteConnectSupported": false,
                "federationFlags": 0,
                "isSignup": false,
                "isAccessPassSupported": true
            }     
        })
    })
    .then((response) => {   
        FederationRedirectUrl = response.data.Credentials.FederationRedirectUrl
        // console.log(FederationRedirectUrl)
        return axios.request(FederationRedirectUrl, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: "POST",
            maxRedirects: 0,
            data: `UserName=Learner%5c${username}&Password=${password}&AuthMethod=FormsAuthentication`,    
            validateStatus: function(status) {
                return status >= 200 && status < 303;
            }
        })
    })
    .then((response) => {   
        if (!response.headers['set-cookie']){
            throw {
                response: response,
                message: "Wrong credentials"
            };
        }
        return axios.request(FederationRedirectUrl, {
            headers: {
                "cookie": response.headers['set-cookie']
            },
            method: "GET",
            maxRedirects: 0,   
            validateStatus: function(status) {
                return status >= 200 && status < 303;
            }
        })
    })
    .then((response) => {   
        const $ = cheerio.load(response.data);   
        let wresult = $("body > form > input[type=hidden]:nth-child(2)").attr('value')
        let wctx = $("body > form > input[type=hidden]:nth-child(3)").attr('value')
        return axios.request("https://login.microsoftonline.com/login.srf", {
            headers: {
                "cookie": "AADSSO=NA|NoExtension",
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: "POST",
            data: {
                "wa": "wsignin1.0",
                "wresult": wresult,
                "wctx": wctx
            }
        })
    })
    .then((response) => {   
        const $ = cheerio.load(response.data);   
        let code = $("body > form > input[type=hidden]:nth-child(1)").attr('value')
        let state = $("body > form > input[type=hidden]:nth-child(2)").attr('value')
        let session_state = $("body > form > input[type=hidden]:nth-child(3)").attr('value')
        return axios.request("https://soul2.hkuspace.hku.hk/auth/oidc/", {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: "POST",
            data: {
                "code": code,
                "state": state,
                "session_state": session_state
            },
            maxRedirects: 0,
            validateStatus: function(status) {
                return status == 303;
            }
        })
    })
    .then((response) => {   
        MoodleSessionSOUL2 = response.headers["set-cookie"][2]
        return axios.request("https://soul2.hkuspace.hku.hk/", {
            headers: {
                "cookie": MoodleSessionSOUL2
            },
            method: "GET",
            maxRedirects: 0
        })
    })
    .then((response) => {     
        let sesskey = response.data.match(/"sesskey":"(.*?)"/)[1]
        // console.log(sesskey)
        return axios.request("https://soul2.hkuspace.hku.hk/lib/ajax/service.php", {
            headers: {
                'Content-Type': 'application/json',
                "cookie": MoodleSessionSOUL2
            },
            method: "POST",
            data: [
                {
                    "index": 0,
                    "methodname": "core_calendar_get_action_events_by_timesort",
                    "args": {
                        "limitnum": 50,
                        "timesortfrom": parseInt(Date.now()/1000)
                    }
                }
            ],
            params: {
                "sesskey": sesskey
            }
        })
    })
    .then((response) => {   
        let asslist = response.data[0].data.events;
        let parsedAssList = [];
        for (var i = 0; i < asslist.length; i++) {
            // console.log(asslist[i])
            parsedAssList.push({
                name: asslist[i].name,
                end_time: asslist[i].timesort,
                course_name: asslist[i].course.fullname,
                url: asslist[i].action.url
            })
        }
        // console.log(asslist)
        res.status(200).send({data: parsedAssList})
    })
    .catch((error) => {
        console.log(error)
        res.status(200).send({"error":{
            "code": error.response.status,
            "message": error.message
        }});
    })
});
