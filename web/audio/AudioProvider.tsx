import sfxJson from "./sfx.json";
import { AudioContext, SFXSounds, SpriteData } from "./AudioContext";
import { useSoundSource } from "./useSoundSource";

const typedFxJson = sfxJson as unknown as SpriteData<SFXSounds>;

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const sfx = useSoundSource<SFXSounds>(
    {
      sprite: typedFxJson.sprite,
      src: "audio/sfx/sprite/sfx.mp3",
    },
    { localStorageKey: "sfx" }
  );

  return (
    <AudioContext.Provider value={{ sfx }}>{children}</AudioContext.Provider>
  );
};
