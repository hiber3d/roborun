import { AnimatePresence } from "framer-motion";
import { LeaderboardContent } from "./LeaderboardContent";
import { useLeaderboard } from "./useLeaderboard";
import { RoborunUI } from "./RoborunUI";

export const RoborunMode = () => {
  const { submitName, state } = useLeaderboard();

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
      <RoborunUI />
      <LeaderboardContent state={state} onSubmitName={submitForm} />
    </AnimatePresence>
  );
};
