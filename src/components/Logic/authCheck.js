import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../api/notesAPI";

const authCheck = async () => {
  const refreshTime = 5000; // Threshold time to refresh the access token
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (accessToken) {
    const decodedAccessToken = jwtDecode(accessToken);
    const accessTokenExpiryTime = decodedAccessToken.exp * 1000 - Date.now();

    // Check if userId is stored in localStorage; if not, decode and store it
    if (!localStorage.getItem("userId")) {
      const userId = decodedAccessToken.id;
      localStorage.setItem("userId", userId);
    }

    if (accessTokenExpiryTime > 0) {
      // Access token is still valid
      if (accessTokenExpiryTime < refreshTime && refreshToken) {
        // Refresh if close to expiry
        try {
          await refreshAccessToken();
        } catch (error) {
          console.error("Failed to refresh access token:", error);
          return false;
        }
      }
      return true;
    }
  }

  // If access token is missing or expired, check the refresh token
  if (refreshToken) {
    const decodedRefreshToken = jwtDecode(refreshToken);
    const refreshTokenExpiryTime = decodedRefreshToken.exp * 1000 - Date.now();

    if (refreshTokenExpiryTime > 0) {
      try {
        if (!localStorage.getItem("userId")) {
            const userId = decodedRefreshToken.id;
            localStorage.setItem("userId", userId);
          }
        await refreshAccessToken();
        return true;
      } catch (error) {
        console.error("Failed to refresh access token:", error);
        return false;
      }
    } else {
      console.warn("Both tokens are expired. Redirecting to login...");
      return false;
    }
  }

  console.error("No valid tokens found. Redirecting to login...");
  return false;
};

export default authCheck;
