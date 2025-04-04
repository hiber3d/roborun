import { useMusicMultiTracks } from "audio/useMusicMultiTracks";
import { useSoundEffects } from "audio/useSoundEffects";
import { AnimatePresence } from "framer-motion";
import { LeaderboardContent } from "./LeaderboardContent";
import { RoborunUI } from "./RoborunUI";
import { useLeaderboard } from "./useLeaderboard";
import { useTouchControls } from "./useTouchControls";
import { Mute } from "./Mute";

const urlParams = new URLSearchParams(window.location.search);
const tapMode = urlParams.get("tapmode") ? true : false;

export const RoborunMode = () => {
  const { submitName, state } = useLeaderboard();
  useTouchControls({ tapMode });
  useSoundEffects();
  useMusicMultiTracks();

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = new FormData(e.currentTarget).get("player")?.toString() ?? "";
    if (name.trim().length === 0) {
      return;
    }
    submitName(name);
  };

  return (
    <AnimatePresence>
      <RoborunUI key="ui" />
      <LeaderboardContent
        key="leaderboard"
        state={state}
        onSubmitName={submitForm}
      />
      <Mute />
    </AnimatePresence>
  );
};
