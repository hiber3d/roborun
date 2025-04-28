import { useHiber3D } from "@hiber3d/web";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "roborun/Button";
import { Mute } from "roborun/Mute";
import { Player } from "roborun/useLeaderboard";

type MainMenuProps = {
  player?: Player;
  fetchRank: (player?: Player) => void;
};

export const MainMenu = ({ player, fetchRank }: MainMenuProps) => {
  const { api, canvasRef } = useHiber3D();
  const [visible, setVisible] = useState(true);

  // Handle showing / hiding the main menu on Game restart
  useEffect(() => {
    if (!api) {
      return;
    }

    const listener = api.onGameRestarted((payload) => {
      if (payload.autoStart) {
        canvasRef?.focus();
      } else {
        setVisible(true);
      }
    });

    return () => {
      api.removeEventCallback(listener);
    };
  }, [api, canvasRef]);

  useEffect(() => {
    if (!visible || !player?.uuid) {
      return;
    }
    fetchRank();
  }, [player?.uuid, visible, fetchRank]);

  const handlePlayButtonClick = () => {
    api?.writeStartInput();
    setVisible(false);
    canvasRef?.focus();
  };

  if (!visible) {
    return (
      <div className="absolute top-2 right-2">
        <Mute minimal />
      </div>
    );
  }

  return (
    <motion.div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between p-2">
      <div className="flex justify-between">
        <div></div>
        <div>
          Leaderboard {player?.name} - {player?.rank}
        </div>
        <Mute />
      </div>
      <div className="flex items-center justify-center">
        <img src="ui/menus/RoboRunLogo.webp" className="h-full max-h-[80vh]" />
      </div>

      <div className="flex items-center justify-center">
        <Button onClick={handlePlayButtonClick}>Start run</Button>
      </div>
    </motion.div>
  );
};
