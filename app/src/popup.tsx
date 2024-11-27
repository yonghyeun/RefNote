import React from "react";
import ReactDOM from "react-dom/client";
import { Popup } from "./pages";
import { ChromeStorageProvider } from "./shared/store/chromeStorage";
import "./styles.css";

ReactDOM.createRoot(document.body).render(
  <React.StrictMode>
    <ChromeStorageProvider>
      <Popup />
    </ChromeStorageProvider>
  </React.StrictMode>
);
