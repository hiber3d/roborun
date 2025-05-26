import { useMusicMultiTracks } from "audio/useMusicMultiTracks";
import { useSoundEffects } from "audio/useSoundEffects";
import { AnimatePresence } from "framer-motion";
import { Mute } from "roborun/Mute";
import { LeaderboardContent } from "./LeaderboardContent";
import { MainMenu } from "./MainMenu";
import { useGameState } from "./useGameState";
import { useTouchControls } from "./useTouchControls";
import { Fullscreen } from "roborun/Fullscreen";

const urlParams = new URLSearchParams(window.location.search);
const tapMode = urlParams.get("tapmode") ? true : false;

export const RoborunMode = () => {
  const { submitName, state, fetchRank, showLeaderboard, showMainMenu } = useGameState();
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
      {state.mode === "playing" && (
        <div className="absolute top-2 right-2 flex gap-2 items-center">
          <Mute minimal />
          <Fullscreen minimal />
        </div>
      )}
      {state.mode.startsWith("leaderboard") && (
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
