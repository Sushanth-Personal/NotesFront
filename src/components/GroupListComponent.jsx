import { useEffect, useState } from "react";
import NotesGroupButton from "./NotesGroupButton";
import styles from "./styles/GroupListComponent.module.css";
import { useUserContext } from "../Contexts/UserContext";
import { useNotesContext } from "../Contexts/NotesContext";
import { getGroups } from "../api/notesAPI";
import { jwtDecode } from "jwt-decode";
import authCheck from "./Logic/authCheck";
const GroupList = () => {
  const {
    groups,
    setGroups,
    setShowAddNotes,
    isGroupUpdated,
    setIsGroupUpdated,
  } = useNotesContext();
  const {
    setIsAuthenticated,
    setIsLoginMode,
    isAuthenticated,
    setUserId,
    userId,
  } = useUserContext();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authCheck();
        if (!response) {
          setIsAuthenticated(false);
          setIsLoginMode(true);
          return;
        }
        let userId = localStorage.getItem("userId");
        let groupsStored = localStorage.getItem("groups");
        // Fetch groups if not stored locally
        if (!groupsStored) {
          groupsStored = await getGroups(userId);
          localStorage.setItem(
            "groups",
            JSON.stringify(groupsStored)
          ); // Cache fetched groups
        } else {
          groupsStored = JSON.parse(groupsStored); // Parse if groups are retrieved from localStorage
        }

        // Update state if groups are available
        if (groupsStored) {
          setGroups(groupsStored);
          setIsGroupUpdated(false);
          setIsAuthenticated(true);
          setIsLoginMode(false);
          setUserId(userId);
        } else {
          // Handle empty groups scenario
          setIsAuthenticated(false);
          setIsLoginMode(true);
          localStorage.clear();
        }
      } catch (error) {
        console.error("Error:", error);
        setIsGroupUpdated(true);
        setIsAuthenticated(false);
        setIsLoginMode(true);
      }
    };

    fetchUserData();
  }, [isGroupUpdated, isAuthenticated]); // Adjust dependencies as needed

  const createNewGroupButton = () => {
    setShowAddNotes(true);
  };

  return (
    <div className={styles.container} id="group-list-container">
      <div className={`col-lg-4 col-md-5 col-xl-3 ${styles.title}`}>
        <h1 className={styles.heading}>Pocket Notes</h1>
      </div>
      {groups && (
        <div className={styles.notesFetchContainer}>
          {groups.map((group) => (
            <NotesGroupButton
              key={group.groupId}
              groupId={group.groupId}
              groupName={group.groupName}
              groupColor={group.groupColor}
              shortForm={getShortForm(group.groupName)}
            />
          ))}
        </div>
      )}
      <button
        className={styles.addNotesGroup}
        style={{ width: "50px", height: "50px" }}
        onClick={createNewGroupButton}
      >
        +
      </button>
    </div>
  );
};

function getShortForm(groupName) {
  if (groupName) {
    const capitalizedName = groupName.toUpperCase();
    const words = capitalizedName.split(" ");
    if (words.length === 1) {
      return words[0].charAt(0);
    } else if (words.length === 2) {
      return words[0].charAt(0) + words[1].charAt(0);
    } else {
      return words[0].charAt(0) + words[1].charAt(0);
    }
  }
}

export default GroupList;
export { getShortForm };
