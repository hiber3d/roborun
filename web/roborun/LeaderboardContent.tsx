import { useHiber3D } from "@hiber3d/web";
import { motion } from "framer-motion";
import { Entry, State } from "./useLeaderboard";
import { twMerge } from "tailwind-merge";

const Column = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <td className={twMerge("p-2 md:p-3", className)}>{children}</td>;

const EntryItem = ({
  entry,
  isNewEntry,
  rank = entry.rank,
  newEntryName,
}: {
  entry: Entry;
  isNewEntry: boolean;
  rank?: number;
  newEntryName? : string;
}) => (
  <tr
    className={twMerge(
      newEntryName && entry.player_name === newEntryName && "font-bold text-blue-300",
      rank % 2 === 0 ? "bg-gray-600/20" : "bg-gray-500/30",
      isNewEntry && "bg-cyan-50/20 animate-pulse"
    )}
    key={rank}
  >
    <Column>{rank}</Column>
    <Column className="truncate max-w-[150px] md:max-w-[300px]">
      {entry.player_name}
    </Column>
    <Column className="text-end">{entry.points}</Column>
    <Column className="text-end">{entry.meters}</Column>
    <Column className="text-end">{entry.collectibles}</Column>
    <Column className="text-end">x{entry.multiplier.toFixed(1)}</Column>
  </tr>
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
          <div className="mb-2">Your Name</div>
          <input
            type="text"
            className="bg-black/50 p-4"
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
        <div className="">
          <div className="bg-black/50 rounded-lg flex flex-col overflow-auto max-h-[80vh]">
            <table>
              <tbody>
                <tr>
                  <Column>Rank</Column>
                  <Column>Player</Column>
                  <Column className="text-end">Points</Column>
                  <Column className="text-end">Meters</Column>
                  <Column className="text-end">Collectibles</Column>
                  <Column className="text-end">Multiplier</Column>
                </tr>

                {state.leaderboard.leaderboard.map((entry, index) => (
                  <EntryItem
                    key={entry.id}
                    entry={entry}
                    rank={index + 1}
                    isNewEntry={entry.id === state.leaderboard.newEntry?.id}
                    newEntryName={state.leaderboard.newEntry?.player_name}
                  />
                ))}
              </tbody>
              <tfoot>
                {state.leaderboard.newEntry && !entryIsInLeaderboard && (
                  <EntryItem
                    entry={state.leaderboard.newEntry}
                    isNewEntry={true}
                    newEntryName={state.leaderboard.newEntry?.player_name}
                  />
                )}
              </tfoot>
            </table>
          </div>
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
