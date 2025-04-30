import { Hiber3D, useHiber3D } from "./hiber3d";
import { AudioProvider } from "audio/AudioProvider";
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
    <AudioProvider>
      <RoborunMode />
    </AudioProvider>
  </Hiber3D>
);
