
const express = require('express');
const { createNote, editNote, getNotes, deleteNote, updateIsPinned, searchNotes} = require('../controllers/NoteConroller');
const router = express.Router();
const authenticateToken = require('../utilities')

router.post('/createNote', authenticateToken , createNote);
router.put('/editNote/:noteId',authenticateToken, editNote);
router.get('/getNotes', authenticateToken ,getNotes);
router.get('/searchNotes', authenticateToken, searchNotes);
router.delete('/deleteNote/:noteId',authenticateToken, deleteNote );
router.put('/updatePinnedNote/:noteId',authenticateToken, updateIsPinned);



module.exports = router