import { createContext } from "react";
import { useSoundSource } from "./useSoundSource";

export type SFXSounds = keyof typeof import("./sfx.json")["sprite"];
export type MusicSounds = keyof typeof import("./music.json")["sprite"];

export type SpriteData<T extends string> = {
  urls: string[];
  sprite: {
    [key in T]: [number, number];
  };
};

export type AudioContextType = {
  sfx: ReturnType<typeof useSoundSource<SFXSounds>>;
  music: ReturnType<typeof useSoundSource<MusicSounds>>;
};

export const AudioContext = createContext<AudioContextType | undefined>(
  undefined
);
