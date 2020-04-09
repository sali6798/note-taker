//================ DEPENDENCIES ==================
const express = require("express");
const fs = require("fs");
const path = require("path");
const util = require("util");

//================ GLOBAL VARIABLES ==================
const router = express.Router();
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const DB_PATH = path.join(__dirname, "../db/db.json");

//================== API GET Request =====================
// gets the notes from file and returns the JSON array
router.get("/notes", async function (req, res) {
    try {
        // gets the existing notes from file 
        // and parses it back into an array
        const data = await readFileAsync(DB_PATH, "utf8");
        res.json(JSON.parse(data));
    }
    catch {
        console.log(error);
    }
});

//================== API POST Request ======================
// gets the notes from file, adds a new note, and then
// writes the new notes back to file, replacing the old one
router.post("/notes", async function (req, res) {
    try {
        // JSON object of the new note
        const newNote = req.body;
        
        const data = await readFileAsync(DB_PATH, "utf8");
        const notes = JSON.parse(data);
        
        // assigns an id to the new note, 1 number higher than the
        // last note in the array, since notes are always inserted
        // at the end of the array it is guaranteed the id will be unique
        // if the note is the first, id will be 1 
        if (notes.length > 0) {
            newNote.id = notes[notes.length - 1].id + 1;
        }
        else {
            newNote.id = 1;
        }

        notes.push(newNote);
        
        // write array with new note to file, overwriting the old array
        await writeFileAsync(DB_PATH, JSON.stringify(notes, null, "\t"));
        res.json(newNote)
    }
    catch {
        console.log(error);
    }
});

//===================== API DELETE Request ==============================
// removes the note from the array based on its id
router.delete("/notes/:id", async function (req, res) {
    try {
        // gets the note's id from the id parameter in the url
        const deletedNoteID = parseInt(req.params.id);
        const data = await readFileAsync(DB_PATH, "utf8");
        const notes = JSON.parse(data);

        // iterate through all the notes, find the note being
        // deleted and remove it from the array
        for (let i = 0; i < notes.length; i++) {
            if (notes[i].id === deletedNoteID) {
                notes.splice(i, 1);
                break;
            }
        }

        await writeFileAsync(DB_PATH, JSON.stringify(notes, null, "\t"));
        res.json({ ok: true })
    }
    catch {
        console.log(error)
    }
});

module.exports = router;