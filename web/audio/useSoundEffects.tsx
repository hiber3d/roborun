import { useHiber3D } from "@hiber3d/web";
import { useEffect, useRef } from "react";
import { useAudio } from "./useAudio";

const COOL_DOWN_TIMER_MS = 1000;

export const useSoundEffects = () => {
  const { api } = useHiber3D();
  const { sfx, music } = useAudio();
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

      sfx.play("collectible", { rate: 0.8 + pickupsInARow.current * 0.04 });
      pickupsInARow.current += 1;
    });

    return () => api.removeEventCallback(listener);
  }, [api, sfx]);

  useEffect(() => {
    console.log("playing");

    music.play("roborun_music_drums_01", { loop: true });
  }, [music]);
};
