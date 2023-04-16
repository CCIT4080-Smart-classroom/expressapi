const express = require("express");
const { studentCourse, studentAssignment } = require("../controllers/student");
const router = express.Router()

// router.get('/student/info', (req, res) => {
    
// });

router.get('/course', (req, res) => {
    studentCourse(req, res);
});

router.post('/assignment', (req, res) => {
    studentAssignment(req, res);
});

module.exports = router