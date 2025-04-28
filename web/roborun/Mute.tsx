import { useAudio } from "audio/useAudio";
import { Volume2, VolumeX } from "lucide-react";

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
    <div
      className="pointer-events-auto flex flex-col gap-2 text-roborun"
      style={
        minimal
          ? { position: "absolute", top: "2px", right: "2px", color: "white" }
          : {
              aspectRatio: "1.208",
              width: "80px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundImage: "url(ui/menus/ButtonB.webp)",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }
      }
      onClick={toggleMute}
    >
      {isMuted ? <VolumeX size={size} /> : <Volume2 size={size} />}
    </div>
  );
};
