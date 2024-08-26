import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateTrip from "./create-trip/index.jsx";
import Header from "./components/custom/header.jsx";
import { Toaster } from "./components/ui/sonner.jsx";

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
    <Header />
    <Toaster />
    <RouterProvider router={router} />
  </StrictMode>
);
