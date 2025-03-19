import { useRef, useEffect, useCallback } from "react";
import { useAudio } from "./useAudio";
import { useHiber3D } from "@hiber3d/web";
import { MusicSounds } from "./AudioContext";

type Track = {
  id: number | undefined;
  playing: boolean;
};

type MusicTracks = {
  drums: Track;
  drums_02: Track;
  bass: Track;
  strings: Track;
};

const startValues: Track = {
  id: undefined,
  playing: false,
};

export const useMusicMultiTracks = () => {
  const { music } = useAudio();
  const { api } = useHiber3D();

  const musicTracks = useRef<MusicTracks>({
    drums: { ...startValues },
    drums_02: { ...startValues },
    bass: { ...startValues },
    strings: { ...startValues },
  });

  useEffect(() => {
    const initTrack = (track: Track, sound: MusicSounds, play?: boolean) => {
      if (track.id) {
        return;
      }
      track.id = music.play(sound, { loop: true, volume: play ? 1 : 0 });
      music.soundSource.current?.volume(play ? 1 : 0, track.id ?? 0);
      track.playing = play || false;
    };

    initTrack(musicTracks.current.drums, "roborun_music_drums_01", true);
    initTrack(musicTracks.current.drums_02, "roborun_music_drums_02");
    initTrack(musicTracks.current.bass, "roborun_music_bass_01");
    initTrack(musicTracks.current.strings, "roborun_music_strings_01");
  }, [music]);

  const updateTrack = useCallback(
    (track: Track, play?: boolean) => {
      if (track.playing === play || !track.id) {
        return;
      }
      console.log("updateTrack", play ? 1 : 0, track.id, music.soundSource);

      music.soundSource.current?.volume(play ? 1 : 0, track.id);
      track.playing = play || false;
    },
    [music.soundSource]
  );

  useEffect(() => {
    if (!api) {
      return;
    }

    const distanceListener = api.onBroadcastPlayerStats((payload) => {
      if (payload.stats.meters > 200) {
        updateTrack(musicTracks.current.bass, true);
      }
      if (payload.stats.meters > 600) {
        updateTrack(musicTracks.current.strings, true);
      }
    });

    const listener = api.onBroadcastGameStarted(() => {
      updateTrack(musicTracks.current.drums, false);
      updateTrack(musicTracks.current.drums_02, true);
    });

    const restartListener = api.onGameRestarted(() => {
      updateTrack(musicTracks.current.drums, true);
      updateTrack(musicTracks.current.drums_02, false);
      updateTrack(musicTracks.current.bass, false);
      updateTrack(musicTracks.current.strings, false);
    });

    return () => {
      api.removeEventCallback(listener);
      api.removeEventCallback(distanceListener);
      api.removeEventCallback(restartListener);
    };
  }, [api, music, updateTrack]);
};
