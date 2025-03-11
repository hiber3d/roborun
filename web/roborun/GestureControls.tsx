import { useHiber3D } from "@hiber3d/web";
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";

const useTouchControls = (hasTiltPermission: boolean) => {
  const { canvasRef, api } = useHiber3D();
  const { ref } = useSwipeable({
    onSwiped: () => {
      console.log("SWIPE");
    },
    onSwipedLeft: () => api?.writeSwipedLeft(),
    onSwipedRight: () => api?.writeSwipedRight(),
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
    if (!api || !hasTiltPermission) {
      return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const notilt = urlParams.get("notilt") ? true : false;
    if (notilt) {
      return;
    }
    const handleOrientation = (event: Event) => {
      const { gamma } = event as DeviceOrientationEvent;
      api?.writeTilted({ value: gamma });
    };
    window.addEventListener("deviceorientation", handleOrientation);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [api, hasTiltPermission]);

  // Tap controls
  useEffect(() => {
    if (!canvasRef) {
      return;
    }

    const handlePointerDown = (e: PointerEvent) => {
      // Check if pointer is on first half of x-axis
      if (e.x < canvasRef.clientWidth / 2) {
        api?.writeLeftTapped();
      } else {
        api?.writeRightTapped();
      }
    };

    canvasRef?.addEventListener("pointerdown", handlePointerDown);

    return () => {
      canvasRef?.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [api, canvasRef]);

  return null;
};

export const GestureControls = () => {
  const { api } = useHiber3D();
  const needsPermission =
    typeof DeviceOrientationEvent.requestPermission === "function";
  const [hasTiltPermission, setHasTiltPermission] = useState(
    needsPermission ? false : true
  );
  useTouchControls(hasTiltPermission);

  const handleClick = () => {
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission().then((response) => {
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
