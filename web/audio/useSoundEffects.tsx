import { useHiber3D } from "@hiber3d/web";
import { useEffect } from "react";
import { useAudio } from "./useAudio";

export const useSoundEffects = () => {
  const { api } = useHiber3D();
  const { sfx } = useAudio();

  useEffect(() => {
    if (!api) {
      return;
    }

    console.log("Sound effect played");

    sfx.play("collectible");

    api.onBroadcastCollectiblePickup(() => {});
  }, [api, sfx]);
};
