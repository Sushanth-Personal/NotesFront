import axios from "axios";
import { jwtDecode } from "jwt-decode";
import authCheck from "../components/Logic/authCheck";
// const baseURL = "https://notesback-6yp0.onrender.com";
const baseURL = "http://localhost:5000";

const api = axios.create({
  baseURL: `${baseURL}/api`,
});

api.interceptors.request.use(
  async (config) => {
    try {
      await authCheck();
      const accessToken = localStorage.getItem("accessToken");
      config.headers[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("accessToken")}`;
      return config;
    } catch (error) {
      return null;
    }
  },
  (error) => Promise.reject(error)
);

// Interceptor for handling expired access token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 403) {
      // Try to refresh the token
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        error.config.headers[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        return api(error.config);
      } else {
        // Redirect to login if refresh token is invalid
        window.location.href = "/login";
      }
    }
    if (error.response.status === 401) {
      return null;
    }
    return Promise.reject(error);
  }
);

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await axios.post(`${baseURL}/auth/refresh`, {
      token: refreshToken,
    });
    const { accessToken } = response.data;

    // Save the new access token
    localStorage.setItem("accessToken", accessToken);

    return accessToken;
  } catch (error) {
    console.error("Unable to refresh access token:", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return null;
  }
};

export const loginUser = async (identifier, password) => {
  // Check if identifier and password are provided
  if (!identifier || !password) {
    console.error("Identifier and password are required");
    return { message: "Identifier and password are required" };
  }
  try {
    const response = await axios.post(`${baseURL}/auth/login`, {
      identifier,
      password,
    });

    const { userId, accessToken, refreshToken } = response.data;
    console.log("Login successful:", response.data);
    return { message: "Success", userId, accessToken, refreshToken };
  } catch (error) {
    console.error(
      "Error logging in:",
      error.response?.data || error.message
    );

    return { message: error.response?.data?.error || "Login failed" };
  }
};

export const registerUser = async (userName, password, email) => {
  try {
    const response = await axios.post(`${baseURL}/auth/register`, {
      userName,
      password,
      email,
    });
    return response.data.message; // Return the data directly
  } catch (error) {
    console.error("Error registering:", error.response.data.message);

    return error.response.data.message; // Handle error by returning null or an empty array
  }
};

export const addNotes = async (userId, groupId, notes) => {
  try {
    const response = await api.put(`/notes/${userId}/${groupId}`, {
      notes,
    });
    return {response: response.data, status: response.status}; // Return the resposne.data, response.status;
  } catch (error) {
    console.error("Error adding notes:", error);
    return response.status;
  }
};

export const deleteNotes = async (groupId) => {
  try {
    // Ensure the groupId and userId are present
    if (!groupId) {
      return { status: 400, message: "Group ID is required" };
    }

    const userId = localStorage.getItem("userId");

    // Check if userId is available
    if (!userId) {
      return {
        status: 400,
        message: "User ID is not found in localStorage",
      };
    }

    // Make the DELETE request
    const response = await api.delete(`/notes/${userId}/${groupId}`);

    // Check for successful response
    if (response.status === 200) {
      return { status: 200, message: "Note deleted successfully" };
    } else {
      // Handle non-200 status codes
      return {
        status: response.status,
        message: response.data.message || "Error deleting note",
      };
    }
  } catch (error) {
    console.error("Error deleting notes:", error);
    // Handle error with a fallback message
    return { status: 500, message: "Error deleting note" };
  }
};

export const createNotesGroup = async (
  userId,
  groupName,
  groupColor,
  shortForm
) => {
  try {
    const response = await api.post("/notes", {
      userId,
      groupName,
      groupColor,
      shortForm,
      notes: [],
    });
    return response.data;
  } catch (error) {
    console.error("Error creating group:", error);
    throw error;
  }
};

export const getNotes = async (userId, groupId) => {
  try {
    const response = await api.get(`/notes/${userId}`);
    sessionStorage.setItem("notes", JSON.stringify(response.data));
    if (groupId) {
      return response.data[groupId-1];
    } else return response.data;
  } catch (error) {
    console.error("Error getting notes:", error);
    return null;
  }
};

export const getGroups = async (userId) => {
  try {
    const response = await api.get(`/groups/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting groups:", error);
    return null;
  }
};
