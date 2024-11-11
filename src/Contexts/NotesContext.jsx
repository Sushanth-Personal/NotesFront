import { useState, useContext, createContext } from "react";
import PropTypes from "prop-types";

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
const [showAddNotes , setShowAddNotes] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [notes, setNotes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isGroupUpdated, setIsGroupUpdated] = useState(false);
  
  return (
    <NotesContext.Provider
      value={{
        notes,
        setNotes,
        selectedGroup,
        setSelectedGroup,
        selectedColor,
        setSelectedColor,
        selectedNote,
        setSelectedNote,
        groupId,
        setGroupId,
        showAddNotes,
        setShowAddNotes,
        groups,
        setGroups,
        isGroupUpdated,
        setIsGroupUpdated,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotesContext = () => {
  return useContext(NotesContext);
};

NotesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NotesContext;
