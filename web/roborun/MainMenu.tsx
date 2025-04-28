import { useHiber3D } from "@hiber3d/web";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Button } from "roborun/Button";
import { LeaderboardButton } from "roborun/LeaderboardButton";
import { Mute } from "roborun/Mute";
import { Player } from "roborun/useGameState";

type MainMenuProps = {
  player?: Player;
  fetchRank: (player?: Player) => void;
  showLeaderboard: () => void;
};

export const MainMenu = ({ player, fetchRank, showLeaderboard }: MainMenuProps) => {
  const { api, canvasRef } = useHiber3D();

  useEffect(() => {
    fetchRank();
  }, [fetchRank]);

  const handlePlayButtonClick = () => {
    api?.writeStartInput();
    canvasRef?.focus();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute top-0 left-0 w-full h-full flex flex-col justify-between p-2"
    >
      <div className="flex justify-between items-start">
        {player && <LeaderboardButton player={player} showLeaderboard={showLeaderboard} />}
        <Mute />
      </div>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center justify-center">
        <img src="ui/menus/RoboRunLogo.webp" className="h-full max-h-[80vh]" />
      </motion.div>

      <div className="flex items-center justify-center">
        <Button onClick={handlePlayButtonClick}>Start run</Button>
      </div>
    </motion.div>
  );
};
