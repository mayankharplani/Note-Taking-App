import { LogOut, Loader2, Trash2, Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useAuthStore } from "../store/useAuthStore.js";
import { useNoteStore } from "../store/useNoteStore.js";

const NoteSchema = z.object({
  content: z.string(),
});

const Dashboard = () => {


  const [showForm, setShowForm] = useState(false);


  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(NoteSchema),
  });


  const {authUser,logout,clearAuth} = useAuthStore()
  const {isLoading,notes,createNote,getAllNotes,deleteNote} = useNoteStore()

  useEffect(() => {
    getAllNotes()
  },[])

  console.log(authUser);
  console.log(notes);


  const onSubmit = async (data) => {
    try {
      await createNote(data);
      setShowForm(false);
      await getAllNotes()
      reset();
    } catch (error) {
      console.log("Error in creating note submission",error)
    }
  }


  const handleDelete = async (noteId) => {
    console.log(noteId)
    try {
      await deleteNote(noteId);
      await getAllNotes()
    } catch (error) {
      console.log("Error in deleting",error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout();
      await clearAuth()
    } catch (error) {
      console.log("Error in logout",error)
    }
  }

  return (
    <div className="min-h-screen bg-white px-4 py-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-8">
          <Loader className="w-7 h-7 text-blue-500" />
          <span className="text-2xl font-semibold">Dashboard</span>
        </div>
        <button 
          onClick={handleLogout}
        className="text-blue-500 text-sm font-medium hover:underline">
          Sign Out
        </button>
      </div>

      {/* Welcome Card */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Welcome, {authUser?.name} !
        </h2>
        <p className="text-gray-500 text-sm mt-1">Email: {authUser?.email}</p>
      </div>

      {/* Create Note Button */}
      <button
        onClick={() => setShowForm(true)}
        className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition mb-6"
      >
        Create Note
      </button>
      {showForm && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note
              </label>
              <input
                type="text"
                {...register("content")}
                placeholder="Enter your note"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium 
                       hover:bg-blue-600 transition"
            >
              Save Note
            </button>
          </form>
        </div>
      )}

      {/* Notes Section */}
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Notes</h3>
      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note._id}
            className="flex items-center justify-between bg-white border rounded-lg shadow-sm px-4 py-3"
          >
            <span className="text-gray-700">{note.content}</span>
            <button 
            onClick={() => handleDelete(note._id)}
            className="text-gray-500 hover:text-red-500 transition">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
