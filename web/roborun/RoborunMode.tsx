import { AnimatePresence } from "framer-motion";
import { GestureControls } from "roborun/GestureControls";
import { LeaderboardContent } from "./LeaderboardContent";
import { RoborunUI } from "./RoborunUI";
import { useLeaderboard } from "./useLeaderboard";
import { useSoundEffects } from "audio/useSoundEffects";

export const RoborunMode = () => {
  const { submitName, state } = useLeaderboard();
  useSoundEffects();

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
      <GestureControls key="controls" />
      <RoborunUI key="ui" />
      <LeaderboardContent
        key="leaderboard"
        state={state}
        onSubmitName={submitForm}
      />
    </AnimatePresence>
  );
};
