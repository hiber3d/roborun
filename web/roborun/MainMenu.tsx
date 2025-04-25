import { useHiber3D } from "@hiber3d/web";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const MainMenu = () => {
  const { api, canvasRef } = useHiber3D();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!api) {
      return;
    }

    const listener = api.onGameRestarted((payload) => {
      console.log("Game restarted!", payload);
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

  const handlePlayButtonClick = () => {
    api?.writeStartInput();
    setVisible(false);
    canvasRef?.focus();
  };

  if (!visible) {
    return null;
  }

  return (
    <motion.div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-6xl font-black text-white">Roborun</h1>
        <button className="bg-emerald-500 text-white px-4 py-2 rounded-md" onClick={handlePlayButtonClick}>
          Play
        </button>
      </div>
    </motion.div>
  );
};
