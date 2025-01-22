import ReactDOM from "react-dom/client";
import { SidePanelPage } from "./pages";
import { SaveErrorProvider, TabProvider } from "./shared/store";
import "./styles.css";

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <TabProvider>
    <SaveErrorProvider>
      <SidePanelPage />
    </SaveErrorProvider>
  </TabProvider>
);
