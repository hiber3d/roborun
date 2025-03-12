import { useHiber3D } from "@hiber3d/web";
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";

// eslint-disable-next-line @typescript-eslint/no-namespace
interface DeviceOrientationEventExtended extends DeviceOrientationEvent {
  requestPermission?: () => Promise<"granted" | "denied">;
}

const useTouchControls = ({
  hasTiltPermission,
  tapMode,
}: {
  hasTiltPermission: boolean;
  tapMode: boolean;
}) => {
  const { canvasRef, api } = useHiber3D();
  const { ref } = useSwipeable({
    preventScrollOnSwipe: true,
    onSwipedLeft: () => !tapMode && api?.writeSwipedLeft(),
    onSwipedRight: () => !tapMode && api?.writeSwipedRight(),
    onSwipedUp: () => api?.writeSwipedUp(),
    onSwipedDown: () => api?.writeSwipedDown(),
  });

  useEffect(() => {
    ref(canvasRef);

    return () => {
      ref(null);
    };
  });

  // Tilt controls
  useEffect(() => {
    if (!api || !hasTiltPermission || tapMode) {
      return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const notilt = urlParams.get("notilt") ? true : false;
    if (notilt) {
      return;
    }
    const handleOrientation = (event: Event) => {
      const { gamma } = event as DeviceOrientationEvent;
      api?.writeTilted({ value: gamma ?? 0 });
    };
    window.addEventListener("deviceorientation", handleOrientation);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [api, hasTiltPermission, tapMode]);

  // Tap controls
  useEffect(() => {
    if (!canvasRef || !tapMode) {
      return;
    }

    const handlePointerDown = (e: PointerEvent) => {
      // Check if pointer is on first half of x-axis
      if (e.x < canvasRef.clientWidth / 3) {
        api?.writeLeftTapped();
      } else if (e.x > (canvasRef.clientWidth / 3) * 2) {
        api?.writeRightTapped();
      }
    };

    canvasRef?.addEventListener("pointerdown", handlePointerDown);

    return () => {
      canvasRef?.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [api, canvasRef, tapMode]);

  return null;
};

const DeviceOrientationEventEx =
  DeviceOrientationEvent as unknown as DeviceOrientationEventExtended;

const urlParams = new URLSearchParams(window.location.search);
const tapMode = urlParams.get("tapmode") ? true : false;

export const GestureControls = () => {
  const { api } = useHiber3D();
  const needsPermission =
    typeof DeviceOrientationEventEx.requestPermission === "function";
  const [hasTiltPermission, setHasTiltPermission] = useState(
    needsPermission ? false : true
  );
  useTouchControls({ hasTiltPermission, tapMode });

  const handleClick = () => {
    if (typeof DeviceOrientationEventEx.requestPermission === "function") {
      DeviceOrientationEventEx.requestPermission().then((response) => {
        setHasTiltPermission(response === "granted");
        api?.writeStartInput();
      });
      return;
    }
    setHasTiltPermission(true);
    api?.writeStartInput();
  };

  return (
    <>
      {hasTiltPermission ? null : (
        <div
          className="absolute w-full h-full bg-black/50 flex items-center justify-center"
          onClick={handleClick}
        >
          Tap to start
        </div>
      )}
    </>
  );
};
