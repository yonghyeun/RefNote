import ReactDOM from "react-dom/client";
import { SidePanelPage } from "./pages";
import { ChromeStorageUpdater } from "./shared/store/chromeStorage";
import { SaveErrorProvider, TabProvider } from "./shared/store";
import "./styles.css";

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <TabProvider>
    <SaveErrorProvider>
      <ChromeStorageUpdater />
      <SidePanelPage />
    </SaveErrorProvider>
  </TabProvider>
);
