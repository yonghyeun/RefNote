import ReactDOM from "react-dom/client";
import { SidePanelPage } from "./pages";
import { ChromeStorageProvider } from "./shared/store/chromeStorage";
import "./styles.css";
import { TabProvider } from "./shared/store";

ReactDOM.createRoot(document.body).render(
  <ChromeStorageProvider>
    <TabProvider>
      <SidePanelPage />
    </TabProvider>
  </ChromeStorageProvider>
);
