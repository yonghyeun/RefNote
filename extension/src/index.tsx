import ReactDOM from "react-dom/client";
import { SidePanelPage } from "./pages";
import { ChromeStorageProvider } from "./shared/store/chromeStorage";
import { SaveErrorProvider, TabProvider } from "./shared/store";
import "./styles.css";

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <ChromeStorageProvider>
    <TabProvider>
      <SaveErrorProvider>
        <SidePanelPage />
      </SaveErrorProvider>
    </TabProvider>
  </ChromeStorageProvider>
);
