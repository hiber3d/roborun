import { useHiber3D } from "@hiber3d/web";
import { motion } from "framer-motion";
import { Button } from "roborun/Button";
import { twMerge } from "tailwind-merge";
import { Entry, State } from "./useGameState";

const Column = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <td className={twMerge("p-2", className)}>{children}</td>
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
          <input type="text" className="bg-black/50 p-4" name="player" autoFocus data-1p-ignore />
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
          className="flex flex-col max-w-[100%] select-none"
        >
          <div className="">
            <div className="flex flex-col relative">
              <div
                className="absolute w-full h-full"
                style={{
                  borderImageSource: "url(ui/menus/LeaderboardFrame.webp)",
                  borderImageSlice: "220 fill",
                  borderImageRepeat: "stretch",
                  borderWidth: "90px",
                }}
              />
              <div className="m-[30px] mx-[34px] relative rounded-2xl overflow-hidden">
                <table
                  className="leaderboard-table"
                  style={{
                    gridTemplateRows: `1fr fit-content(${state.mode === "showLeaderboard" ? "55vh" : "45vh"}) ${
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
                  <tbody className="overflow-auto">
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
          </div>
          <div className="flex flex-col items-center">
            {state.mode === "showLeaderboardWithRetry" && (
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
            {state.mode === "showLeaderboard" && <Button onClick={showMainMenu}>Close</Button>}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
