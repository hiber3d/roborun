import { useEffect, useRef, useState } from "react";
import {
  getConfigFromLocalStorage,
  setConfigInLocalStorage,
} from "./utils/audioLocalStorage";
import { Howl } from "howler";

type Config = {
  src: string;
  sprite: Record<string, [number, number]>;
};

type Options = {
  playMode?: "interrupt" | "overlap";
  localStorageKey?: string;
};

export type PlayOptions = {
  loop?: boolean;
  rate?: number | [number, number];
  delayMs?: number;
  volume?: number;
  mute?: boolean;
  interrupt?: boolean;
  onPlay?: () => void;
  onStop?: () => void;
  onEnd?: () => void;
};

export const useSoundSource = <Sound extends string>(
  { src, sprite }: Config,
  options?: Options
) => {
  const [vol, setVol] = useState<number>(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const soundSource = useRef<Howl | null>(null);
  const externalSoundSources = useRef<Howl[]>([]);
  const settingsLoaded = useRef(false);
  const lastplayedAt = useRef<number>(Date.now());
  const [soundQueued, setSoundQueued] = useState(false);

  useEffect(() => {
    if (settingsLoaded.current || src.length === 0) return;
    const settings = getConfigFromLocalStorage(options?.localStorageKey);

    const howl = new Howl({
      src,
      sprite,
      ...settings,
    });
    setVol(settings.volume);
    setIsMuted(settings.mute);

    soundSource.current = howl;
    settingsLoaded.current = true;
  }, [src, sprite, options]);

  const stopAll = (id?: number) => {
    soundSource.current?.stop(id);
    externalSoundSources.current.forEach((howl) => howl.stop(id));
  };

  const playUrl = (url: string, playOptions?: PlayOptions) => {
    if (options?.playMode === "interrupt") {
      stopAll();
    }
    const howl = new Howl({
      src: url,
      format: "mp3",
      volume: vol,
      mute: isMuted,
    });

    const index = externalSoundSources.current.push(howl);

    howl.once("end", () => {
      playOptions?.onEnd?.();
      externalSoundSources.current.splice(index, 1);
    });

    const id = howl.play();

    applySettings(howl, id, playOptions);

    return id;
  };

  const applySettings = (
    howl: Howl | null,
    id?: number,
    playOptions?: PlayOptions
  ) => {
    if (playOptions?.delayMs) {
      howl?.pause(id);
      setTimeout(() => {
        howl?.play(id);
      }, playOptions.delayMs);
    }

    if (playOptions?.loop) {
      howl?.loop(playOptions.loop, id);
    }
    if (typeof playOptions?.rate === "number") {
      howl?.rate(playOptions?.rate, id);
    }
    if (Array.isArray(playOptions?.rate) && playOptions?.rate.length > 1) {
      howl?.rate(
        playOptions?.rate[0] +
          Math.random() * (playOptions?.rate[1] - playOptions?.rate[0]),
        id
      );
    }
    if (playOptions?.volume && id) {
      howl?.volume(playOptions.volume * vol, id);
    }

    if (playOptions?.onEnd) {
      howl?.once("end", playOptions.onEnd);
    }

    if (playOptions?.onPlay) {
      howl?.once("play", playOptions.onPlay);
    }

    if (playOptions?.onStop) {
      howl?.once("stop", playOptions.onStop);
    }

    lastplayedAt.current = Date.now();

    return id;
  };

  const play = (sound?: Sound, playOptions?: PlayOptions) => {
    if (!sound) {
      console.warn("No sound provided");
      return;
    }

    if (src.length === 0) {
      console.warn("No sound source provided");
      return;
    }

    if (!Object.keys(sprite).includes(sound)) {
      console.warn(`Sound: "${sound}" not found in sprite`);
    }

    if (options?.playMode === "interrupt") {
      stopAll();
    }

    const id = soundSource.current?.play(sound);

    applySettings(soundSource.current, id, playOptions);

    return id;
  };

  const mute = (muted?: boolean) => {
    soundSource.current?.mute(!!muted);
    externalSoundSources.current.forEach((howl) => howl.mute(!!muted));
    setIsMuted(!!muted);
  };

  useEffect(() => {
    if (!soundSource.current || !options?.localStorageKey) return;

    setConfigInLocalStorage(options?.localStorageKey, {
      mute: isMuted,
      volume: vol,
    });
  }, [isMuted, options?.localStorageKey, vol]);

  const setVolume = (volume: number) => {
    setVol(volume);
    mute(false);
    soundSource.current?.volume(volume);
    externalSoundSources.current.forEach((howl) => howl.volume(volume));
  };

  const isPlaying = () => {
    if (soundSource.current?.playing()) return true;

    return externalSoundSources.current.some((howl) => howl.playing());
  };

  return {
    play,
    mute,
    setVolume,
    isMuted,
    stop: stopAll,
    volume: vol,
    playUrl,
    lastplayedAt: lastplayedAt.current,
    isPlaying,
    soundQueued,
    setSoundQueued,
  };
};
