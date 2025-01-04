import { BorderNavLink, Stack } from "@/shared/ui";
import { Page } from "@/shared/ui/Page";
import { Outlet } from "react-router";
import { Text } from "@geist-ui/core";

export const MainLayout = () => (
  <Page>
    <Page.Header>
      <Stack className="justify-between">
        <Stack className="items-center">
          <img src="./128.png" className="w-12 h-12" />
          <Text h1 className="font-normal">
            RefNote
          </Text>
        </Stack>
        <div>darkMode toggle</div>
      </Stack>
      <nav className="flex gap-4">
        <BorderNavLink to="/">Home</BorderNavLink>
        <BorderNavLink to="/update">Update</BorderNavLink>
      </nav>
    </Page.Header>
    <Page.Content>
      <Outlet />
    </Page.Content>
    <Page.Footer>footer</Page.Footer>
  </Page>
);
