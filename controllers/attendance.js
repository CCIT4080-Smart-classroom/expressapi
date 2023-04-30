const sqlConfig = require('../config/db')
var sql = require("mssql");

exports.checkIn = (async (req, res) => {
    const { student_id } = req.body;
    try {
        await sql.connect(sqlConfig)
        const lastAttendanceResult = (await sql.query`SELECT TOP 1 attendance_ts FROM Attendance WHERE student_id = ${student_id} ORDER BY attendance_ts DESC`).recordset;
        if (lastAttendanceResult.length > 0) {
            const lastAttendanceTime = new Date(lastAttendanceResult[0].attendance_ts);
            const now = new Date();
            const diffMinutes = Math.round((now - lastAttendanceTime) / (1000 * 60));
            if (diffMinutes < 30) {
                return res.status(200).send({
                    "data": {
                        "message": "Attendance already taken within the last 30 minutes"
                    }
                });
            }
        }
        const result = await sql.query`INSERT INTO Attendance (student_id) VALUES (${student_id})`
        res.status(200).send({
            "data": {
                "message": "Checked in"
            }
        });
    } catch (err) {
        console.log(err);
    }
});

exports.getAttendance = (async (req, res) => {
    const { student_id } = req.params;
    try {
        await sql.connect(sqlConfig)
        const result = (await sql.query`SELECT DATEDIFF(s, '1970-01-01 00:00:00', attendance_ts) as attendance_unix FROM Attendance WHERE student_id = ${student_id}`).recordset
        var ts = [];
        console.log(result);
        for (var i = 0; i < result.length; i++) {
            var tzoffset = (new Date()).getTimezoneOffset() * 60;
            var localISOTime = (new Date((result[i]['attendance_unix'] - tzoffset) * 1000)).toISOString().slice(0, -1);
            ts.push(localISOTime);
        }
        res.status(200).send({ "data": ts })
    } catch (err) {
        console.log(err);
    }
});

exports.saveRate = (async (req, res) => {

    const { attendance_data, student_id } = req.body;
    try {
        // Connect to the database
        await sql.connect(sqlConfig);

        // Loop through each attendance record and save it to the database
        attendance_data.forEach(async (record) => {
            const { class_id, attendance_rate } = record;
            console.log(class_id, attendance_rate)
            // Save the attendance rate to the database
            const result = await sql.query`SELECT * FROM AttendanceRate WHERE student_id = ${student_id} AND class_id = ${class_id};`;

            if (result.recordset.length > 0) {
                // If the row exists, update the attendance rate
                let cmd = `UPDATE AttendanceRate SET attendance_rate = ${attendance_rate} WHERE student_id = ${student_id} AND class_id = '${class_id}'`
                console.log(cmd)
                let res = await sql.query(cmd);
                console.log(res)
            } else {
                // If the row doesn't exist, insert a new row
                await sql.query(`INSERT INTO AttendanceRate (student_id, class_id, attendance_rate) VALUES (${student_id}, '${class_id}', ${attendance_rate});`);
            }

            // console.log(result);
        })

        // Return a success response
        res.status(200).send(({
            "data": {
                "message": "Attendance rate save successfully"
            }
        }));
    } catch (err) {
        // Handle any errors
        console.error(err);
        res.status(500).send('Error recording attendance');
    }
});