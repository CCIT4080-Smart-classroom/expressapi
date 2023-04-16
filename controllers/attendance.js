const pool = require('../config/db')

exports.checkIn = ((req, res) => {
    const { student_id } = req.body;
    pool.query(`INSERT INTO attendance (student_id) VALUES ('${student_id}')`, (err, rows) => {
        if (err) throw err;
        res.status(200).send({"data":{
            "message": "Checked in"
        }});
    });
});

exports.getAttendance = ((req, res) => {
    const { student_id } =  req.params;
    pool.query(`SELECT UNIX_TIMESTAMP(attendance_ts) FROM attendance WHERE student_id = '${student_id}'`, (err, result) => {
        if (err) throw err;
        var ts = [];
        for (var i = 0; i < result.length; i++) {
            var tzoffset = (new Date()).getTimezoneOffset() * 60;
            var localISOTime = (new Date((result[i]['UNIX_TIMESTAMP(attendance_ts)'] - tzoffset)*1000)).toISOString().slice(0, -1);
            ts.push(localISOTime);
        }
        res.status(200).send({"data":ts})
    });
});