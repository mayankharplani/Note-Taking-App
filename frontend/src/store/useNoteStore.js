import {create} from "zustand"
import {axiosInstance} from "../libs/axios.js"


export const useNoteStore = create((set) => ({
    notes: [],
    note: null,
    isLoading: false,


    getAllNotes: async () => {
        try {
            set({isLoading: true});
            const res = await axiosInstance.get("/note/get-all-notes");
            set({notes: res.data.notes})
        } catch (error) {
            console.log("Error in fetching notes:",error)
        }
        finally{
            set({isLoading: false})
        }
    },

    createNote: async (data) => {
        console.log(data)
        try {
            set({isLoading: true});
            const res = await axiosInstance.post("/note/create",data);
            console.log(res.data)
            set({note: res.data.note})
            set((state) => ({
                notes: [...state.notes,res.data.note]
            }))
        } catch (error) {
            console.log("Error in creating note:",error);
        }
        finally{
            set({isLoading: false})
        }
    },

    deleteNote: async (noteId) => {
        try {
            set({isLoading: true});
            await axiosInstance.delete(`/note/delete-note/${noteId}`)
            set((state) => ({
                notes: state.notes.filter((n) => n._id !== noteId)
            }))
        } catch (error) {
            console.log("Error in Deleting Note",error)
        }
        finally{
            set({isLoading: false})
        }
    }





}))