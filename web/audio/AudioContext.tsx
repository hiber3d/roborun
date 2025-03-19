import { createContext } from "react";
import { useSoundSource } from "./useSoundSource";

export type SFXSounds = keyof typeof import("./sfx.json")["sprite"];
export type DialogueSounds = "";

export type SpriteData<T extends string> = {
  urls: string[];
  sprite: {
    [key in T]: [number, number];
  };
};

export type AudioContextType = {
  sfx: ReturnType<typeof useSoundSource<SFXSounds>>;
};

export type AudioChannels = AudioContextType["sfx"];

export const AudioContext = createContext<AudioContextType | undefined>(
  undefined
);
