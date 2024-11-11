import { addNotes } from "../../api/notesAPI";
import {getNotes} from "../../api/notesAPI";
const addNote = async (newNote, groupId) => {
  const userId = localStorage.getItem("userId");

  try {
    const {response,status} = await addNotes(userId, groupId, newNote);
    if (status === 200) {
      const allNotes = response.data;
      
      // Save the updated notes to sessionStorage
      sessionStorage.setItem("notes", JSON.stringify(allNotes));
      return allNotes[groupId-1];
    }
  } catch (error) {
    console.error("Error adding notes:", error);
  }
};



  export default addNote;