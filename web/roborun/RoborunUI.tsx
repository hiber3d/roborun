import { Stats, useHiber3D } from "hiber3d";
import { useEffect, useState } from "react";

export const RoborunUI = () => {
  const { api } = useHiber3D();
  const [visible, setVisible] = useState(false);
  const [stats, setStats] = useState<Stats>({
    points: 0,
    meters: 0,
    collectibles: 0,
    multiplier: 1.0,
  });

  useEffect(() => {
    if (!api) {
      return;
    }
    const listener = api?.onBroadcastPlayerStats((payload) => {
      setStats(payload.stats);
    });

    const startedListener = api.onBroadcastGameStarted(() => {
      setTimeout(() => {
        setVisible(true);
      }, 1000);
    });

    const diedListener = api.onPostScore(() => {
      setTimeout(() => {
        setVisible(false);
      }, 1000);
    });

    return () => {
      api.removeEventCallback(listener);
      api.removeEventCallback(startedListener);
      api.removeEventCallback(diedListener);
    };
  }, [api, setStats]);

  if (!visible) {
    return null;
  }

  return (
    <div className="absolute top-0 left-0 p-4 text-white font-black text-xs md:text-xl flex gap-2 md:gap-4">
      <div className="flex flex-col gap-1 items-center">
        <div className="border-1 flex justify-center flex-col w-[30px] gap-[8px] md:gap-[12px]  md:w-[42px] border-emerald-400 rounded-md relative overflow-hidden bg-emerald-950">
          <div
            style={{
              height: `${(stats.collectibles % 10) * 10}%`,
            }}
            className={`absolute bg-emerald-500 bottom-0 w-full`}
          ></div>
          <div></div>
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-full h-[1px] bg-emerald-200/40 z-1" />
          ))}
          <div></div>
        </div>
        x{(Math.floor(stats.multiplier * 10 + 0.0001) / 10).toFixed(1)}
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-4xl md:text-6xl">{Math.round(stats.points)}</div>
        <div>{Math.round(stats.meters)} meters</div>
        <div>{stats.collectibles} collectibles</div>
      </div>
    </div>
  );
};
