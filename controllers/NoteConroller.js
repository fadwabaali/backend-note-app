const Note = require("../models/note.model");

// Create Note object
const createNote = async (req, res) => {  
    try {
        const { title, content, tags, user} = req.body;
    
        if(!title){
            return res
               .status(400)
               .json({ error: true, message: "Title is required." });
        }
        
        if(!content){
            return res
               .status(400)
               .json({ error: true, message: "Content is required." });
        }
        const note = new Note({
            title,
            content,
            tags,
            userId: user
        });

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note added successfully."
        });
    }catch(error) {
        console.error("Error adding note:", error);  // Log the actual error details
        return res
           .status(500)
           .json({ error: true, message: "An error occurred while adding note." });
    }
}

// edit note
const editNote = async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, user, isPinned} = req.body;

    if(!title && !content && !tags){
        return res
           .status(400)
           .json({ error: true, message: "At least one field is required." });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user});

        if(!note) {
            return res
               .status(404)
               .json({ error: true, message: "Note not found." });
        }

        if(title) note.title = title;
        if(content) note.content = content;
        if(tags) note.tags = tags;
        if(isPinned) note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully."
        });
    }catch (error) {
        return res
           .status(500)
           .json({ error: true, message: "An error occurred while editing note." });
    }
}

// get notes by user
const getNotes = async (req, res) => {
    const { user }  = req.query;

    try {
        const notes = await Note.find({ userId: user}).sort({isPinned: -1});
        return res.json({
           notes
        });
    } catch (error) {
        console.error('Error retrieving notes:', error);
        return res
           .status(500)
           .json({ error: true, message: "An error occurred while retrieving notes." });
    }
}

// delete note 
const deleteNote = async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.body;

    try{
        const note = await Note.findOne({ _id: noteId, userId: user});

        if(!note) {
            return res
               .status(404)
               .json({ error: true, message: "Note not found." });
        }

        await Note.deleteOne({ _id: noteId, userId: user});

        return res.json({
            error: false,
            message: "Note deleted successfully."
        });
    }catch (error) {
        return res
           .status(500)
           .json({ error: true, message: "An error occurred while deleting note." });
    }
}

// Update IsPinned Note
const updateIsPinned = async (req, res) => {
    const {noteId} = req.params;
    const { isPinned, user} = req.body;

    if(isPinned === undefined){
        return res
           .status(400)
           .json({ error: true, message: "At least one field is required." });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user});

        if(!note) {
            return res
               .status(404)
               .json({ error: true, message: "Note not found." });
        }

        note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully."
        });
    }catch (error) {
        return res
           .status(500)
           .json({ error: true, message: "An error occurred while editing note." });
    }
}

// Search Query
const searchNotes = async (req, res) => {
    const { user }  = req.query;
    //const {user} = req.user;
    const { query } = req.query;

    if(!query) {
        return res
           .status(400)
           .json({ error: true, message: "Search query is required." });
    }

    try {
        const matchingNotes = await Note.find({
            userId: user,
            $or: [
                { title: {$regex: new RegExp(query, "i")}},
                { content: {$regex: new RegExp(query, "i")}},
                { tags: {$regex: new RegExp(query, "i")} }
            ]
        });

        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes matching the search query retrieved successfully"
        })
    }catch (error) {
        return res
           .status(500)
           .json({ error: true, message: "An error occurred while deleting note." });
    }
}

module.exports = {createNote, editNote, getNotes, deleteNote, updateIsPinned, searchNotes};