//================ DEPENDENCIES ==================
const express = require("express");
const router = express.Router();
const path = require("path");

//================ HTML GET Requests ===============
// displays index.html
router.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// displays notes.html when user visits notes page
router.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/notes.html"));
});

// defaults to index.html if user tries to visit any other route
router.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = router;