import { useMusicMultiTracks } from "audio/useMusicMultiTracks";
import { useSoundEffects } from "audio/useSoundEffects";
import { AnimatePresence } from "framer-motion";
import { LeaderboardContent } from "./LeaderboardContent";
import { MainMenu } from "./MainMenu";
import { useLeaderboard } from "./useLeaderboard";
import { useTouchControls } from "./useTouchControls";

const urlParams = new URLSearchParams(window.location.search);
const tapMode = urlParams.get("tapmode") ? true : false;

export const RoborunMode = () => {
  const { submitName, state, fetchRank, showLeaderboard, showMainMenu } = useLeaderboard();
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
      {state.mode === "mainMenu" && (
        <MainMenu key="mainmenu" player={state.player} fetchRank={fetchRank} showLeaderboard={showLeaderboard} />
      )}
      {state.mode === "playing" && <div>JAJ</div>}
      {["showLeaderboard", "showLeaderboardWithRetry"].includes(state.mode) && (
        <LeaderboardContent
          key="leaderboardContent"
          state={state}
          onSubmitName={submitForm}
          showMainMenu={showMainMenu}
        />
      )}
    </AnimatePresence>
  );
};
