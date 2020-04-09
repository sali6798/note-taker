const express = require("express");
var fs = require("fs");
// const notes = require("../db/db")
const router = express.Router();
const path = require("path");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const DB_PATH = path.join(__dirname, "../db/db.json");



router.get("/api/notes", async function (req, res) {
    try {
        const data = await readFileAsync(DB_PATH, "utf8");
        res.json(JSON.parse(data));
    }
    catch {
        console.log(error);
    }
    // readFileAsync(DB_PATH, "utf8")
    // .then(data => res.json(JSON.parse(data)))
    // .catch(error => console.log(error))
});

router.post("/api/notes", async function (req, res) {
    try {
        const newNote = req.body;
        const data = await readFileAsync(DB_PATH, "utf8");
        const notes = JSON.parse(data);
        if (notes.length > 0) {
            newNote.id = notes[notes.length - 1].id + 1;
        }
        else {
            newNote.id = 1;
        }
        notes.push(newNote);
        const write = await writeFileAsync(DB_PATH, JSON.stringify(notes, null, "\t"));
        res.json(newNote)
    }
    catch {
        console.log(error);
    }
    

    // readFileAsync(DB_PATH, "utf8")
    // .then(data => {
    //     var notes = JSON.parse(data);
    //     if (notes.length > 0) {
    //         newNote.id = notes[notes.length - 1].id + 1;
    //     }
    //     else {
    //         newNote.id = 1;
    //     }
    //     notes.push(newNote);
    //     return notes;
    // })
    // .then(notes => writeFileAsync(DB_PATH, JSON.stringify(notes, null, "\t")))
    // .then(() => res.json(newNote))
    // .catch(error => console.log(error))
});

router.delete("/api/notes/:id", async function (req, res) {
    try {
        const deletedNoteID = parseInt(req.params.id);
        const data = await readFileAsync(DB_PATH, "utf8");
        const notes = JSON.parse(data);
        for (let i = 0; i < notes.length; i++) {
            if (notes[i].id === deletedNoteID) {
                notes.splice(i, 1);
                break;
            }
        }
        const write = await writeFileAsync(DB_PATH, JSON.stringify(notes, null, "\t"));
        res.json({ ok: true })
    }
    catch {
        console.log(error)
    }
    

    // readFileAsync(DB_PATH, "utf8")
    // .then(data => {
    //     var notes = JSON.parse(data);
    //     for (let i = 0; i < notes.length; i++) {
    //         if (notes[i].id === deletedNoteID) {
    //             notes.splice(i, 1);
    //             break;
    //         }
    //     } 
    //     return notes;
    // })
    // .then(notes => writeFileAsync(DB_PATH, JSON.stringify(notes, null, "\t")))
    // .then(() => res.json({ ok: true }))
    // .catch(error => console.log(error))
})

module.exports = router;