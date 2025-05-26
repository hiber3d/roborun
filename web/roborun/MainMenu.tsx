import { useHiber3D } from "./../hiber3d";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Button } from "roborun/Button";
import { Fullscreen } from "roborun/Fullscreen";
import { LeaderboardButton } from "roborun/LeaderboardButton";
import { Mute } from "roborun/Mute";
import { Player } from "roborun/useGameState";
import { sendGaEvent } from "utils/ga";

type MainMenuProps = {
  player?: Player;
  fetchRank: (player?: Player) => void;
  showLeaderboard: () => void;
};

export const MainMenu = ({ player, fetchRank, showLeaderboard }: MainMenuProps) => {
  const { api } = useHiber3D();

  useEffect(() => {
    fetchRank();
  }, [fetchRank]);

  const handlePlayButtonClick = () => {
    api?.writeStartInput();
    sendGaEvent("press_start_button");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute top-0 left-0 w-full h-full flex flex-col justify-between p-2"
    >
      <div className="flex justify-between items-start">
        <LeaderboardButton player={player} showLeaderboard={showLeaderboard} />
        <div className="flex gap-2 items-center">
          <Mute />
          <Fullscreen />
        </div>
      </div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex items-center justify-center pointer-events-none select-none"
      >
        <img src="ui/menus/RoboRunLogo.svg" className="h-full max-h-[55vh]" />
      </motion.div>

      <div className="flex items-center justify-center">
        <Button onClick={handlePlayButtonClick}>Start run</Button>
      </div>
    </motion.div>
  );
};
