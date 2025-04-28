import { Player } from "roborun/useGameState";

export const LeaderboardButton = ({ player, showLeaderboard }: { player: Player; showLeaderboard: () => void }) => (
  <div className="relative h-[84px] truncate min-w-[150px] roborun-button select-none" onClick={showLeaderboard}>
    <div
      className="absolute w-full h-full"
      style={{
        borderImageSource: "url(ui/menus/ButtonC.webp)",
        borderImageSlice: "50% 360",
        borderImageRepeat: "repeat",
        borderWidth: "42px 70px",
      }}
    />
    <div className=" text-roborun font-roborun text-4xl top-[18px] ml-[20px] mr-[65px] relative truncate text-center">
      {player.name}
    </div>
    {player.bestEntry && (
      <div className="absolute text-roborun font-roborun text-3xl bottom-[8px] right-[10px] w-[48px] text-center">
        #{player.bestEntry.rank}
      </div>
    )}
  </div>
);
