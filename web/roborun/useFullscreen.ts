import { useHiber3D } from "hiber3d";
import { useEffect, useState } from "react";
import { telegramExitFullScreen, telegramRequestFullScreen } from "utils/telegram";

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(document.fullscreenElement !== null);
  const context = useHiber3D();

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const { mainRef } = context;

  const isAvailable = () => {
    return !!mainRef.current?.requestFullscreen || !!telegramRequestFullScreen;
  };

  const enter = () => {
    if (!isAvailable() || !mainRef.current) {
      return;
    }

    if (telegramRequestFullScreen) {
      telegramRequestFullScreen();
      return;
    }

    mainRef.current.requestFullscreen();
  };

  const exit = () => {
    if (telegramExitFullScreen) {
      telegramExitFullScreen();
      return;
    }
    document.exitFullscreen();
  };

  const toggle = () => {
    if (isFullscreen) {
      exit();
    } else {
      enter();
    }
  };

  return {
    isAvailable: isAvailable(),
    toggle,
    isFullscreen,
  };
};
