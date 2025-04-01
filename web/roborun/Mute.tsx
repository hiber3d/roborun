import { useAudio } from "audio/useAudio";
import { Volume2, VolumeOff } from "lucide-react";

export const Mute = () => {
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
    <div className="pointer-events-auto flex flex-col gap-2 absolute  text-slate-200 top-0 right-0 p-4 ">
      {isMuted ? (
        <VolumeOff size={size} onClick={toggleMute} />
      ) : (
        <Volume2 size={size} onClick={toggleMute} />
      )}
    </div>
  );
};
