import ReactDOM from "react-dom/client";
import { SidePanelPage } from "./pages";
import { ChromeSyncStorageUpdater } from "./shared/store/chromeSyncStorage";
import { SaveErrorProvider, TabProvider } from "./shared/store";
import "./styles.css";

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <TabProvider>
    <SaveErrorProvider>
      <ChromeSyncStorageUpdater />
      <SidePanelPage />
    </SaveErrorProvider>
  </TabProvider>
);
