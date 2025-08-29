import { Notes } from "../models/notesModel.js";






export const createNote = async (req,res) => {
    const {content} = req.body;
    const userId = req.user._id
    console.log(userId)
    try {
        if(!userId){
            return res.status(404).json({
                success: false,
                messsage: "User not Found"
            })
        }
        if(!content){
            return res.status(400).json({
                success: false,
                message: "Field is required"
            })
        }
        const note = await Notes.create({userId, content})
        if(!note) return res.status(400).json({
            message: "Note does not created"
        })
        res.status(201).json({
            success: true,
            message: "Note created Successfully",
            note
        })
    } catch (error) {
        console.log("Error in note creation",error);
        res.status(500).json({
            success: false,
            message: "note creation failed",
            error
        })
    }
}

export const deleteNote = async (req,res) => {
    const {noteId} = req.params;
    try {
        if(!noteId){
            return res.status(500).json({
                message: "Note Id not found"
            })
        }

        const note = await Notes.findOne({_id: noteId})
        if(!note){
            return res.status(400).json({
                message: 'Note not found'
            })
        }
        await Notes.deleteOne({_id: noteId});
        return res.status(200).json({
            success: true,
            message: "Note deleted Successfully"
        })
    } catch (error) {
        console.log("Error in deleting note",error);
        res.status(500).json({
            success: false,
            message: "Deletion Failed",
            error
        })
    }
}

export const getAllNotes = async (req,res) => {
    const userId = req.user._id;
    try {
        if(!userId){
            return res.status(404).json({
                message: "User not Found"
            })
        }
        const notes = await Notes.find({userId});
        res.status(200).json({
            success: true,
            message: "Notes fetched Successfully",
            notes
        })
    } catch (error) {
        
    }
}