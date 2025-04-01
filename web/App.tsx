import { Hiber3D } from "@hiber3d/web";
import { AudioProvider } from "audio/AudioProvider";
import { RoborunMode } from "roborun/RoborunMode";

export const App = () => (
  <Hiber3D
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
