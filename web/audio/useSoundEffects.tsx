import { useHiber3D } from "@hiber3d/web";
import { useEffect, useRef } from "react";
import { useAudio } from "./useAudio";

const COOL_DOWN_TIMER_MS = 1000;

export const useSoundEffects = () => {
  const { api } = useHiber3D();
  const { sfx } = useAudio();
  const lastPickup = useRef<number>(null);
  const pickupsInARow = useRef(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const listener = api.onBroadcastCollectiblePickup(() => {
      const now = Date.now();

      // if the last pickup was more than 1 second ago, reset the count
      if (lastPickup.current && now - lastPickup.current > COOL_DOWN_TIMER_MS) {
        pickupsInARow.current = 0;
      } else {
        // if the last pickup was less than 1 second ago, increment the count
        pickupsInARow.current += 1;
      }
      lastPickup.current = now;

      sfx.play("collectible", {
        rate: 0.8 + pickupsInARow.current * 0.04,
        volume: 0.5,
      });
      pickupsInARow.current += 1;
    });

    return () => api.removeEventCallback(listener);
  }, [api, sfx]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const jump = api.onJumpedEvent(() => {
      sfx.play("jump_01", { volume: 0.6 });
    });
    const land = api.onLandedEvent(() => {
      sfx.play("land_01", { volume: 0.6 });
    });

    return () => {
      api.removeEventCallback(jump);
      api.removeEventCallback(land);
    };
  }, [api, sfx]);
};
