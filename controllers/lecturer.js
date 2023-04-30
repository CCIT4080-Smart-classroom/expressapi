const sqlConfig = require('../config/db')
var sql = require("mssql");

exports.ClassesAttendance = (async (req, res) => {
    const lecturerId = req.params.lecturer_id;
    try {
        // Connect to Azure SQL database
        await sql.connect(sqlConfig);

        // Query for classes taught by the specified lecturer
        const classQuery = `SELECT class_id FROM Classes WHERE lecturer_id = ${lecturerId}`;
        const classResult = await sql.query(classQuery);

        // Loop through the classes and retrieve attendance records for each student
        const attendanceData = [];
        for (let i = 0; i < classResult.recordset.length; i++) {
            const classId = classResult.recordset[i].class_id;

            // Query for attendance rates for each student in the current class
            const attendanceQuery = `SELECT student_id, attendance_rate FROM AttendanceRate WHERE class_id = '${classId}'`;
            const attendanceResult = await sql.query(attendanceQuery);

            // Push the attendance data for the current class into the result array
            attendanceData.push({
                c_code: classId,
                students: attendanceResult.recordset
            });
        }

        // Return the attendance data as a JSON object
        res.json({
            data: attendanceData
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
})