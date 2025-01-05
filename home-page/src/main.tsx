import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { GeistProvider, CssBaseline } from "@geist-ui/core";
import { RouterProvider } from "react-router";
import { router } from "./app/router.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GeistProvider>
      <CssBaseline />
      <RouterProvider router={router} />
    </GeistProvider>
  </StrictMode>
);
