import { useHiber3D } from "./../hiber3d";
import { motion } from "framer-motion";
import { LucideLoader2 } from "lucide-react";
import { Button } from "roborun/Button";
import { twMerge } from "tailwind-merge";
import { Entry, State } from "./useGameState";

const Column = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <td className={twMerge("p-2 py-[6px]", className)}>{children}</td>
);

const EntryItem = ({
  entry,
  isNewEntry,
  rank = entry.rank,
  newEntryName,
}: {
  entry: Entry;
  isNewEntry: boolean;
  rank?: number;
  newEntryName?: string;
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
    <Column className="truncate max-w-[150px] md:max-w-[300px]">{entry.player_name}</Column>
    <Column className="text-end">{entry.points}</Column>
    <Column className="text-end">{entry.meters}</Column>
    <Column className="text-end">{entry.collectibles}</Column>
    <Column className="text-end">x{entry.multiplier.toFixed(1)}</Column>
  </tr>
);

export const LeaderboardContent = ({
  state,
  onSubmitName,
  showMainMenu,
}: {
  state: State;
  onSubmitName: (e: React.FormEvent<HTMLFormElement>) => void;
  showMainMenu: () => void;
}) => {
  const { api } = useHiber3D();

  if (["leaderboardAddName", "leaderboardSubmittingName"].includes(state.mode)) {
    return (
      <motion.div
        key="addName"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute w-full h-full flex items-center justify-center backdrop-blur-sm"
      >
        <form onSubmit={onSubmitName} className="flex flex-col items-center gap-2">
          <input
            placeholder="Enter your name"
            type="text"
            className="bg-black/50 p-4 outline-none rounded-2xl"
            name="player"
            autoFocus
            data-1p-ignore
          />
          <Button className="w-full" type="submit" disabled={state.mode === "leaderboardSubmittingName"}>
            SUBMIT
          </Button>
          <LucideLoader2
            className={twMerge(
              "animate-spin text-roborun",
              state.mode === "leaderboardSubmittingName" ? "visible" : "invisible"
            )}
            size={32}
          />
        </form>
      </motion.div>
    );
  }

  const entryIsInLeaderboard = state.leaderboard?.leaderboard?.some(
    (entry) => entry.id === state.leaderboard?.newEntry?.id
  );

  const showStickyFooter = !entryIsInLeaderboard;

  return (
    <motion.div
      key="leaderboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute w-full h-full flex items-center justify-center backdrop-blur-sm"
    >
      {!!state.leaderboard.leaderboard.length && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="flex flex-col max-w-[100%] max-h-[100%] select-none"
        >
          <div className="flex flex-col relative">
            <div
              className="absolute w-full h-full z-1 pointer-events-none"
              style={{
                borderImageSource: "url(ui/menus/LeaderboardFrame.webp)",
                borderImageSlice: "220 fill",
                borderImageRepeat: "stretch",
                borderWidth: "90px",
              }}
            />
            <div className="m-[30px] mx-[34px] relative overflow-hidden">
              <table
                className="leaderboard-table"
                style={{
                  gridTemplateRows: `1fr fit-content(${state.mode === "leaderboard" ? "50vh" : "42vh"}) ${
                    showStickyFooter && "1fr"
                  }`,
                }}
              >
                <thead>
                  <tr className="font-bold">
                    <Column>Rank</Column>
                    <Column>Player</Column>
                    <Column className="text-end">Points</Column>
                    <Column className="text-end">Meters</Column>
                    <Column className="text-end">Collectibles</Column>
                    <Column className="text-end">Multiplier</Column>
                  </tr>
                </thead>
                <tbody className="overflow-auto overflow-x-hidden">
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
                {showStickyFooter && state.leaderboard.newEntry && (
                  <tfoot>
                    <EntryItem
                      entry={state.leaderboard.newEntry}
                      isNewEntry={true}
                      newEntryName={state.leaderboard.newEntry.player_name}
                    />
                  </tfoot>
                )}
              </table>
            </div>
          </div>
          <div className="flex flex-col items-center sm:flex-row justify-center">
            {state.mode === "leaderboardWithRetry" && (
              <>
                <Button
                  onClick={() =>
                    api?.writeRestartGame({
                      autoStart: true,
                    })
                  }
                >
                  Play again
                </Button>
                <Button
                  onClick={() => {
                    api?.writeRestartGame({
                      autoStart: false,
                    });
                  }}
                >
                  Main menu
                </Button>
              </>
            )}
            {state.mode === "leaderboard" && <Button onClick={showMainMenu}>Close</Button>}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
