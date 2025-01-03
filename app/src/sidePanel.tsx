import ReactDOM from "react-dom/client";
import { SidePanelPage } from "./pages";
import { ChromeStorageProvider } from "./shared/store/chromeStorage";
import { TabProvider } from "./shared/store";
import "./styles.css";

ReactDOM.createRoot(document.body).render(
  <ChromeStorageProvider>
    <TabProvider>
      <SidePanelPage />
    </TabProvider>
  </ChromeStorageProvider>
);
