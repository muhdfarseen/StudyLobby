import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { router } from "./routes/router";
import "@mantine/core/styles.css";
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/notifications/styles.css';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider>
    <Notifications />
      <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>
);
