import { useAudio } from "audio/useAudio";
import { Volume2, VolumeX } from "lucide-react";
import { ToggleButton } from "roborun/ToggleButton";

export const Mute = ({ minimal = false }: { minimal?: boolean }) => {
  const { music, sfx } = useAudio();

  const isMuted = music.isMuted && sfx.isMuted;

  const toggleMute = () => {
    // if any is unmuted due to unsync with local storage, we mute all. better to mute one time too many
    const shouldMute = !music.isMuted || !sfx.isMuted;
    music.mute(shouldMute);
    sfx.mute(shouldMute);
  };

  const size = 32;

  return (
    <ToggleButton onClick={toggleMute} minimal={minimal}>
      {isMuted ? <VolumeX size={size} /> : <Volume2 size={size} />}
    </ToggleButton>
  );
};
