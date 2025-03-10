import { Hiber3D } from "@hiber3d/web";
import { moduleFactory } from "../build/moduleFactory";
import { RoborunMode } from "roborun/RoborunMode";

export const App = () => (
  <Hiber3D
    moduleFactory={moduleFactory}
    config={{ Renderer: { Quality: 3, MSAASampleCount: 1 } }}
  >
    <RoborunMode />
  </Hiber3D>
);
