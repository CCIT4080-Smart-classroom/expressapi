const express = require("express");
const router = express.Router()
const attendance = require("../controllers/attendance")

router.post('/checkin', (req, res) => {
    attendance.checkIn(req, res)
});

router.get('/:student_id', (req, res) => {
    attendance.getAttendance(req, res);
});

module.exports = router