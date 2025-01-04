import { Page } from "@geist-ui/core";
import { Outlet } from "react-router";

export const MainLayout = () => (
  <Page>
    <Page.Header>header</Page.Header>
    <Page.Content>
      <Outlet />
    </Page.Content>
    <Page.Footer>footer</Page.Footer>
  </Page>
);
