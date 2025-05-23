import { RxEnterFullScreen, RxExitFullScreen } from "react-icons/rx";
import { ToggleButton } from "roborun/ToggleButton";
import { useFullscreen } from "roborun/useFullscreen";

export const Fullscreen = ({ minimal = false }: { minimal?: boolean }) => {
  const { toggle, isAvailable, isFullscreen } = useFullscreen();

  if (!isAvailable) {
    return null;
  }

  const size = 32;

  return (
    <ToggleButton onClick={toggle} minimal={minimal}>
      {isFullscreen ? <RxExitFullScreen size={size} /> : <RxEnterFullScreen size={size} />}
    </ToggleButton>
  );
};
