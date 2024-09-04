import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateTrip from "./create-trip/index.jsx";
import Header from "./components/custom/header.jsx";
import { Toaster } from "./components/ui/sonner.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: '/create-trip',
    element: <CreateTrip />
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <Header />
    <Toaster />
    <RouterProvider router={router} />
    </GoogleOAuthProvider>;
  </StrictMode>
);
