import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://933538a66dc6495b293c2fd0412c819d@o1115554.ingest.us.sentry.io/4509399359029248",
  sendDefaultPii: true,
  integrations: [Sentry.captureConsoleIntegration({ levels: ["error"] })],
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
