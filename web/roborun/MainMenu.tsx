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
    if (!visible) {
      return;
    }
    fetchRank();
  }, [visible, fetchRank]);

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
      <div className="flex justify-between items-start">
        {player?.rank && (
          <div className="relative">
            <img src="ui/menus/ButtonC.webp" className="w-[220px]" />
            <div className="absolute text-roborun font-roborun text-4xl top-[20px] left-[23px] w-[124px] truncate text-center">
              {player.name}
            </div>
            <div className="absolute text-roborun font-roborun text-3xl bottom-[10px] right-[14px] w-[48px] text-center">
              #{player.rank}
            </div>
          </div>
        )}
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
