const express = require("express");
const { studentInfo, studentCourse, studentAssignment } = require("../controllers/student");
const router = express.Router()

router.get('/info', (req, res) => {
    studentInfo(req, res);
});

router.get('/course', (req, res) => {
    studentCourse(req, res);
});

router.get('/assignment', (req, res) => {
    studentAssignment(req, res);
});

module.exports = router