const express = require("express");
const router = express.Router()
const auth = require("../controllers/auth");

router.post('/score', (req, res) => {
    auth.loginScore(req, res);
});

module.exports = router