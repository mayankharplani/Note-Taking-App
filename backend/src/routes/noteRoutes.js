import express from "express"   
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createNote, deleteNote, getAllNotes } from "../controllers/noteController.js";

const noteRoutes = express.Router();

noteRoutes.post("/create", authMiddleware,createNote);

noteRoutes.get("/get-all-notes", authMiddleware, getAllNotes);

noteRoutes.delete("/delete-note/:noteId",authMiddleware,deleteNote)



export default noteRoutes