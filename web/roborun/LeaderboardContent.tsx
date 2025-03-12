import { useHiber3D } from "@hiber3d/web";
import { motion } from "framer-motion";
import { Entry, State } from "./useLeaderboard";
import { twMerge } from "tailwind-merge";

const EntryItem = ({
  entry,
  isNewEntry,
  rank = entry.rank,
}: {
  entry: Entry;
  isNewEntry: boolean;
  rank?: number;
}) => (
  <div
    className={twMerge(
      "grid grid-cols-6 gap-6 p-4",
      rank === 1 && "font-bold text-2xl text-yellow-400",
      rank % 2 === 0 ? "bg-gray-600/20" : "bg-gray-500/30",
      isNewEntry && "bg-cyan-200/40 animate-pulse"
    )}
    key={rank}
  >
    <div>{rank}</div>
    <div>{entry.player_name}</div>
    <div className="text-end">{entry.points}</div>
    <div className="text-end">{entry.meters}</div>
    <div className="text-end">{entry.collectibles}</div>
    <div className="text-end">x{entry.multiplier.toFixed(1)}</div>
  </div>
);

export const LeaderboardContent = ({
  state,
  onSubmitName,
}: {
  state: State;
  onSubmitName: (e: React.FormEvent<HTMLFormElement>) => void;
}) => {
  const { api } = useHiber3D();

  if (state.mode === "hidden") {
    return null;
  }

  if (state.mode === "addName") {
    return (
      <motion.div
        key="addName"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute w-full h-full flex items-center justify-center backdrop-blur-sm"
      >
        <form onSubmit={onSubmitName}>
          <input
            type="text"
            className="bg-black/50 p-4"
            placeholder="Your name"
            name="player"
            autoFocus
            data-1p-ignore
          />
        </form>
      </motion.div>
    );
  }

  const entryIsInLeaderboard = state.leaderboard?.leaderboard?.some(
    (entry) => entry.id === state.leaderboard?.newEntry?.id
  );

  return (
    <motion.div
      key="leaderboard"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute w-full h-full flex items-center justify-center backdrop-blur-sm"
    >
      <div className="flex flex-col gap-2 max-w-[95%]">
        <div className="overflow-y-auto max-h-[80vh]">
          <div className="bg-black/50 rounded-lg flex flex-col">
            <div className="grid grid-cols-6 gap-6 p-4">
              <div>Rank</div>
              <div>Player</div>
              <div className="text-end">Points</div>
              <div className="text-end">Meters</div>
              <div className="text-end">Collectibles</div>
              <div className="text-end">Multiplier</div>
            </div>
            {state.leaderboard.leaderboard.map((entry, index) => (
              <EntryItem
                key={entry.id}
                entry={entry}
                rank={index + 1}
                isNewEntry={entry.id === state.leaderboard.newEntry?.id}
              />
            ))}
          </div>
          {state.leaderboard.newEntry && !entryIsInLeaderboard && (
            <div className="bg-black/50 rounded-lg flex flex-col overflow-hidden">
              <EntryItem entry={state.leaderboard.newEntry} isNewEntry={true} />
            </div>
          )}
        </div>
        <button
          className="bg-black/50 p-4 rounded-lg font-bold"
          onClick={() => api?.writeRestartGame()}
        >
          Play again
        </button>
      </div>
    </motion.div>
  );
};
