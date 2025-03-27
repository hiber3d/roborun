import { Hiber3D } from "@hiber3d/web";
import { AudioProvider } from "audio/AudioProvider";
import { RoborunMode } from "roborun/RoborunMode";

export const App = () => (
  <Hiber3D
    config={{
      Renderer: {
        Quality: 0,
        MSAASampleCount: 0,
        EnableNormalMaps: true,
        MaxVerticalResolution: 1080,
      },
      Shadows: {
        Enabled: false,
      },
      Editor: {
        Enabled: false,
        Mode: "play",
      },
    }}
  >
    <AudioProvider>
      <RoborunMode />
    </AudioProvider>
  </Hiber3D>
);
