import { useHiber3D } from "./../hiber3d";
import { useEffect } from "react";
import { useSwipeable } from "react-swipeable";

export const useTouchControls = ({ tapMode }: { tapMode: boolean }) => {
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
