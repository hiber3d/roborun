import sfxJson from "./sfx.json";
import musicJson from "./music.json";
import {
  AudioContext,
  MusicSounds,
  SFXSounds,
  SpriteData,
} from "./AudioContext";
import { useSoundSource } from "./useSoundSource";

const typedFxJson = sfxJson as unknown as SpriteData<SFXSounds>;
const typedMusicJson = musicJson as unknown as SpriteData<MusicSounds>;

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const sfx = useSoundSource<SFXSounds>(
    {
      sprite: typedFxJson.sprite,
      src: "audio/sfx/sprite/sfx.mp3",
    },
    { localStorageKey: "sfx" }
  );

  const music = useSoundSource<MusicSounds>(
    {
      sprite: typedMusicJson.sprite,
      src: "audio/music/sprite/music.mp3",
    },
    { localStorageKey: "music" }
  );

  return (
    <AudioContext.Provider value={{ sfx, music }}>
      {children}
    </AudioContext.Provider>
  );
};
