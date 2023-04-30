# Smart Classroom System API
An Express REST API for the Smart Classroom System.

## Endpoints
The root url of the API is currently [https://api.tylerl.cyou/](https://api.tylerl.cyou/). `student_id` is the student ID.  `lecturer_id` is the lecturer ID.

### POST /attendance/checkin
Record student attendacne.

Payload:
```javascript
{
  "student_id": 20182960
}
```

### GET /attendance/`student_id`
Get all attendance record of `student_id`.

```javascript
[
  "2023-01-21T09:23:58.000Z",
  "2023-01-29T08:13:13.000Z",
  "2023-01-29T08:19:41.000Z",
  "2023-01-29T08:21:48.000Z",
  "2023-01-29T08:23:10.000Z",
  "2023-01-29T08:26:55.000Z",
  "2023-01-29T08:27:55.000Z",
  "2023-01-29T08:28:44.000Z",
  "2023-01-29T08:29:51.000Z",
  "2023-01-29T08:30:12.000Z",
  "2023-01-29T08:30:33.000Z",
  "2023-01-29T08:31:27.000Z",
  "2023-01-29T08:52:41.000Z",
  "2023-01-29T08:53:15.000Z",
  "2023-01-29T08:54:29.000Z",
  "2023-01-29T08:55:34.000Z",
  "2023-01-29T08:56:55.000Z",
  "2023-01-29T09:08:55.000Z",
  "2023-01-29T09:09:49.000Z",
  "2023-01-29T09:10:02.000Z"
]
```

### POST /attendance/rate
Save attendance rate of `student_id`.

Payload:
```javascript
{
	"attendance_data": [
		{
			"attendance_rate": 0,
			"course_code": "CCCH4003"
		},
		{
			"attendance_rate": 7,
			"course_code": "CCEN4005"
		},
		{
			"attendance_rate": 7,
			"course_code": "CCIT4021"
		},
		{
			"attendance_rate": 7,
			"course_code": "CCIT4033"
		},
		{
			"attendance_rate": 0,
			"course_code": "CCIT4079"
		},
		{
			"attendance_rate": 0,
			"course_code": "CCIT4080B"
		}
	],
	"student_id": "20182960"
}
```

### GET /lecturer/`lecturer_id`
Get all attendance rate of students of `lecturer_id`.

```javascript
{
	"data": [
		{
			"c_code": "CCIT4021CL06",
			"students": [
				{
					"student_id": 20000001,
					"attendance_rate": 70
				},
				{
					"student_id": 20000003,
					"attendance_rate": 50
				},
				{
					"student_id": 20182960,
					"attendance_rate": 7
				}
			]
		},
		{
			"c_code": "CCIT4033CL02",
			"students": [
				{
					"student_id": 20000001,
					"attendance_rate": 80
				},
				{
					"student_id": 20000002,
					"attendance_rate": 40
				},
				{
					"student_id": 20000003,
					"attendance_rate": 90
				},
				{
					"student_id": 20182960,
					"attendance_rate": 7
				}
			]
		}
	]
}
```

### POST /auth/score
Get SCORE `PS_TOKEN` cookie by sending credentials.

Payload:
```javascript
{
  "username":"20000000",
  "password":"12345678"
}
```


### GET /student/info
Get the information about a student from SCORE (`PS_TOKEN` required).

```javascript
{
  "data": {
    "name": "CHUN YU LAM",
    "program": "AEng",
    "theme": "AENG (Computer Science)"
  }
}
```

### GET /student/course
Get the courses of a student from SCORE (`PS_TOKEN` required).

```javascript
[
  "data": [
    {
      "code": "CCCH4003",
      "name": "Advanced Chinese Language",
      "components": [
        {
          "number": "CL53",
          "type": "Lecture",
          "time": "Tu 8:30AM - 11:30AM",
          "room": "KEC503"
        }
      ]
    },
    {
      "code": "CCEN4005",
      "name": "EAP II",
      "components": [
        {
          "number": "CL48",
          "type": "Lecture",
          "time": "Tu 1:00PM - 2:30PM",
          "room": "KEC709"
        },
        {
          "number": "CL48",
          "type": "Lecture",
          "time": "We 2:30PM - 4:00PM",
          "room": "KEC708"
        }
      ]
    },
    {
      "code": "CCIT4021",
      "name": "Discrete Mathematics",
      "components": [
        {
          "number": "CL06",
          "type": "Lecture",
          "time": "Tu 2:30PM - 5:30PM",
          "room": "KEC505"
        },
        {
          "number": "EXAM",
          "type": "Exam",
          "time": "TBA",
          "room": "TBA"
        }
      ]
    },
    {
      "code": "CCIT4033",
      "name": "Intro to Database Systems",
      "components": [
        {
          "number": "CL02",
          "type": "Lecture",
          "time": "Th 8:30AM - 11:30AM",
          "room": "KEC910"
        },
        {
          "number": "EXAM",
          "type": "Exam",
          "time": "TBA",
          "room": "TBA"
        }
      ]
    },
    ...
  ]
]
```

### GET /student/assignment
Get the pending assignment(s) of a student from SOUL by sending credentials.


Payload:
```javascript
{
  "username":"20000000",
  "password":"12345678"
}
```

```javascript
{
	"data": [
		{
			"name": "書面專題報告（呈交） is due",
			"end_time": 1681833540,
			"course_name": "Advanced Chinese Language / 高級中國語文",
			"url": "https://soul2.hkuspace.hku.hk/mod/assign/view.php?id=1766501&action=editsubmission"
		},
		{
			"name": "書面專題報告（相似程度檢查） - Part 1",
			"end_time": 1681833540,
			"course_name": "Advanced Chinese Language / 高級中國語文",
			"url": "https://soul2.hkuspace.hku.hk/mod/turnitintooltwo/view.php?id=1766502"
		},
		{
			"name": "專題報告互評表（呈交） is due",
			"end_time": 1682092740,
			"course_name": "Advanced Chinese Language / 高級中國語文",
			"url": "https://soul2.hkuspace.hku.hk/mod/assign/view.php?id=1766503&action=editsubmission"
		},
		{
			"name": "Assignment (20% of course total, individual work) - due 25th April 2023, 5:30pm is due",
			"end_time": 1682415000,
			"course_name": "Big Data Applications and Analytics / 大數據應用及分析",
			"url": "https://soul2.hkuspace.hku.hk/mod/assign/view.php?id=1840920&action=editsubmission"
		},
		{
			"name": "[Submission] Assignment 02 is due",
			"end_time": 1682501400,
			"course_name": "Discrete Mathematics / 電腦數學",
			"url": "https://soul2.hkuspace.hku.hk/mod/assign/view.php?id=1851176&action=editsubmission"
		},
		{
			"name": "Final Report [Min: 2000 words][pdf] + A2 poster [pdf][Due on 30 Apr 2023 Sun 23:59][20%] is due",
			"end_time": 1682870340,
			"course_name": "Project on Knowledge Products Development / 工程專題項目",
			"url": "https://soul2.hkuspace.hku.hk/mod/assign/view.php?id=1809564&action=editsubmission"
		}
	]
}
```
