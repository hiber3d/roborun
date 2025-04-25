import { Hiber3D } from "@hiber3d/web";
import { moduleFactory as webGPU } from "GameTemplate_webgpu";
import { moduleFactory as webGL } from "GameTemplate_webgl";
import { AudioProvider } from "audio/AudioProvider";
import { RoborunMode } from "roborun/RoborunMode";

export const App = () => (
  <Hiber3D
    build={{ webGPU, webGL }}
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
