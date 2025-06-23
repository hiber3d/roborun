import { useHiber3D } from "hiber3d";
import { ToggleButton } from "roborun/ToggleButton";
import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getConfigFromLocalStorage, setConfigInLocalStorage } from "audio/utils/audioLocalStorage";

const localStorageKey = "sound";

export const Mute = ({ minimal = false }: { minimal?: boolean }) => {
  const { api } = useHiber3D();

  const [ isMuted, setMuted ] = useState(false);

  const toggleMute = () => {
    const newMutedState = !isMuted;

    api?.writeMuteAudio({ doMute: newMutedState });
    setMuted(newMutedState);
    setConfigInLocalStorage(localStorageKey, { mute: newMutedState, volume: 1 });
  };

  useEffect(() => {
    if (!api) {
      return;
    }
    const muteListener = api.onBroadcastRequestMuteState(() => {
      const initialMutedState = getConfigFromLocalStorage(localStorageKey) ?? { mute: false, volume: 1 };
      setMuted(initialMutedState.mute);
      requestAnimationFrame(() => {
        api?.writeMuteAudio({ doMute: initialMutedState.mute });
      })
    })
    return () => {
      api.removeEventCallback(muteListener);
    }
  }, [api])

  const size = 32;

  return (
    <ToggleButton onClick={toggleMute} minimal={minimal}>
      {isMuted ? <VolumeX size={size} /> : <Volume2 size={size} />}
    </ToggleButton>
  );
};
