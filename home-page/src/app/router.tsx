import { createBrowserRouter } from "react-router";
import { MainLayout, MainPage } from "@/page";
import { UpdatePage } from "@/page/update";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "/introduction", element: <MainPage /> },
      { path: "/update", element: <UpdatePage /> },
    ],
  },
]);
