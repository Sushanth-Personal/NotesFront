import { createRoot } from "react-dom/client";
import MainPage from "./pages/mainpage.jsx";
import { UserProvider } from "./Contexts/UserContext";
import { NotesProvider } from "./Contexts/NotesContext.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';

const root = createRoot(document.getElementById("root"));
root.render(
  <UserProvider>
    <NotesProvider>
      <MainPage />
    </NotesProvider>
  </UserProvider>
);

// Register service worker if in production and supported by the browser
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
