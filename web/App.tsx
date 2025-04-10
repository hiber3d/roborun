import { Hiber3D } from "@hiber3d/web";
import { moduleFactory as moduleFactoryWebGPU } from "GameTemplate_webgpu";
import { moduleFactory as moduleFactoryWebGL } from "GameTemplate_webgl";
import { AudioProvider } from "audio/AudioProvider";
import { RoborunMode } from "roborun/RoborunMode";

export const App = () => (
  <Hiber3D
    build={{webGPU: moduleFactoryWebGPU as any, webGL: moduleFactoryWebGL as any}}
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
