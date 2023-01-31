# Smart Classroom System API
An Express REST API for the Smart Classroom System.

## Endpoints
The root url of the API is currently [https://api.ccit4080.tylerl.cyou/](https://api.ccit4080.tylerl.cyou/). `student_id` is the student ID.

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

### POST /score/login
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
					"time": "We 2:30PM - 4:00PM",
					"room": "KEC708"
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
					"number": "EXAM",
					"type": "Exam",
					"time": "TBA",
					"room": "TBA"
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
