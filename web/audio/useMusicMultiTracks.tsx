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
  bass_02: Track;
  bass_03: Track;
  strings: Track;
};

const startValues: Track = {
  id: undefined,
  playing: false,
};

export const useMusicMultiTracks = () => {
  const { music, sfx } = useAudio();
  const { api } = useHiber3D();

  const musicTracks = useRef<MusicTracks>({
    drums: { ...startValues },
    drums_02: { ...startValues },
    bass: { ...startValues },
    bass_02: { ...startValues },
    bass_03: { ...startValues },
    strings: { ...startValues },
  });

  useEffect(() => {
    if (!api) {
      return;
    }
    const listener = api.onHiber3DEditorModeChanged((payload) => {
      music.mute(payload.editMode);
      sfx.mute(payload.editMode);
    });

    return () => api.removeEventCallback(listener ?? 1);
  }, [api, music, sfx]);

  useEffect(() => {
    const initTrack = (track: Track, sound: MusicSounds, play?: boolean) => {
      if (track.id) {
        return;
      }
      track.id = music.play(sound, { loop: true, volume: play ? 1 : 0 });
      music.soundSource.current?.volume(play ? 1 : 0, track.id ?? 0);
      track.playing = play || false;
    };

    const signal = new AbortController();
    window.addEventListener(
      "click",
      () => {
        initTrack(musicTracks.current.drums, "drums_01", true);
        initTrack(musicTracks.current.drums_02, "drums_02");
        initTrack(musicTracks.current.bass, "bass_01");
        initTrack(musicTracks.current.bass_02, "bass_02");
        initTrack(musicTracks.current.bass_03, "bass_03");

        initTrack(musicTracks.current.strings, "strings_01");

        signal.abort();
      },
      { signal: signal.signal }
    );

    return () => {
      signal.abort();
    };
  }, [music]);

  const updateTrack = useCallback(
    (track: Track, play?: boolean) => {
      if (track.playing === play || !track.id) {
        return;
      }

      music.soundSource.current?.volume(play ? 1 : 0, track.id);
      track.playing = play || false;
    },
    [music.soundSource]
  );

  const resetMusic = useCallback(() => {
    updateTrack(musicTracks.current.drums, true);

    updateTrack(musicTracks.current.drums_02, false);
    updateTrack(musicTracks.current.bass, false);
    updateTrack(musicTracks.current.bass_02, false);
    updateTrack(musicTracks.current.bass_03, false);
    updateTrack(musicTracks.current.strings, false);
  }, [updateTrack]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const distanceListener = api.onBroadcastPlayerStats((payload) => {
      const meters = payload.stats.meters;
      if (meters > 200) {
        updateTrack(musicTracks.current.bass, true);
      }
      if (meters > 1000) {
        updateTrack(musicTracks.current.bass, false);
        updateTrack(musicTracks.current.bass_02, true);
      }
      if (meters > 2500) {
        updateTrack(musicTracks.current.bass_02, false);
        updateTrack(musicTracks.current.bass_03, true);
      }
    });

    const listener = api.onBroadcastGameStarted(() => {
      updateTrack(musicTracks.current.drums, false);
      updateTrack(musicTracks.current.drums_02, true);
    });

    const restartListener = api.onGameRestarted(() => {
      resetMusic();
    });

    return () => {
      api.removeEventCallback(listener);
      api.removeEventCallback(distanceListener);
      api.removeEventCallback(restartListener);
    };
  }, [api, music, resetMusic, updateTrack]);
};
