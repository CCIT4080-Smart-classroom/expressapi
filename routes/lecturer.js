const express = require('express');
const router = express.Router();
const lecturer = require("../controllers/lecturer")

router.get('/:lecturer_id', async (req, res) => {
    lecturer.ClassesAttendance(req, res)
});

module.exports = router;
