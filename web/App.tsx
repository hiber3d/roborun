import { Hiber3D } from "./hiber3d";
import { RoborunMode } from "roborun/RoborunMode";

export const App = () => (
  <Hiber3D
    logs={{ showLogsInBrowserConsole: true }}
    config={{
      Editor: {
        Enabled: false,
        Mode: "play",
      },
      Assets: {
        EnableWatcher: import.meta.env.DEV,
      },
    }}
  >
    <RoborunMode />
  </Hiber3D>
);
