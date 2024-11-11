import styles from "./styles/TextInputComponent.module.css";
import formatDateAndTime from "../utils/formatDateAndTime";
import { useState } from "react";
import GreyButton from "../assets/GreyButton.png";
import BlueButton from "../assets/BlueButton.png";
import {useUserContext} from "../Contexts/UserContext";
import {useNotesContext} from "../Contexts/NotesContext";
import addNote from "./Logic/addNote";
const TextInputComponent = () => {
  const [description, setDescription] = useState("");
  const { groupId, notes, setNotes } = useNotesContext();


  const handleClick = () => {
    if (description.trim() !== "") {

      const existingNotes = notes;
      const newNote = {
        id: existingNotes.length,
        date: formatDateAndTime(Date.now(), "date"),
        time: formatDateAndTime(Date.now(), "time"),
        text: description,
      };
  

      
      addNote(newNote,groupId).then((updatedAllNotes) => {
        setNotes(updatedAllNotes);
      })
      setDescription(""); // Clear the input field after adding the note
    }
  };

  
  const handleChange = (e) => {
    setDescription(e.target.value);
  };

  return (
    <div className={styles.container}>
      <textarea
        className={styles.textArea}
        onChange={handleChange}
        value={description}
        placeholder="Enter your text here........."
      />
      <button
        className={styles.textEnterButton}
        onClick={handleClick}
        aria-label="Submit Note"
      >
        <img
          className={styles.textEnterButton}
          src={description.trim() === "" ? GreyButton : BlueButton}
          alt="Submit"
        />
      </button>
    </div>
  );
};

export default TextInputComponent;
