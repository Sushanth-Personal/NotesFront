import { useEffect, useState } from "react";
import NotesGroupButton from "./NotesGroupButton";
import styles from "./styles/GroupListComponent.module.css";
import { useUserContext } from "../Contexts/UserContext";
import { useNotesContext } from "../Contexts/NotesContext";
import { getGroups } from "../api/notesAPI";
import { jwtDecode } from "jwt-decode";
const GroupList = () => {
  const { groups, setGroups, setShowAddNotes } = useNotesContext();
  const {
    setIsAuthenticated,
    setIsLoginMode,
    isAuthenticated,
    setUserId,
    userId,
  } = useUserContext();

  const [isGroupUpdated, setIsGroupUpdated] = useState(false);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("groups", groups);
        // Retrieve accessToken from localStorage
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        let id = localStorage.getItem("userId");

        if (!id && (accessToken || refreshToken)) {
          // Decode the access token to get userId
          let decodedToken = "";
          if (accessToken) {
            decodedToken = jwtDecode(accessToken);
          } else {
            decodedToken = jwtDecode(refreshToken);
          }

          const id = decodedToken.id; // Adjust this if your userId is stored under a different key

          localStorage.setItem("userId", id);
        }

        // Fetch groups using the extracted userId
        if (!isGroupUpdated) {
          let id = localStorage.getItem("userId");
          if (id) {
            console.log("Fetching group Data")
            const groupsStored = await getGroups(id);
            if (groupsStored) {
              setGroups(groupsStored);
              setIsGroupUpdated(true);
              setIsAuthenticated(true);
              setIsLoginMode(false);
              setUserId(id);
            } else {
              setIsAuthenticated(false);
              setIsLoginMode(true);
            }
          }
        }
      } catch (error) {
        console.error("Error:", error);
        // Handle errors (e.g., token may be invalid or expired)
        setIsAuthenticated(false);
        setIsLoginMode(true);
      }
    };
    fetchUserData();
  }, [userId, groups]);

  const createNewGroupButton = () => {
    setShowAddNotes(true);
  };

  return (
   
      <div className={styles.container} id="group-list-container">
        <div className={`col-lg-4 col-md-5 col-xl-3 ${styles.title}`}> 
          <h1 className = {styles.heading}>Pocket Notes</h1>         
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
            className={ styles.addNotesGroup}
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
