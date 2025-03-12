import { useApi } from "@hiber3d/web";
import { useCallback, useEffect, useReducer } from "react";
import { Stats } from "../../build/web/src/moduleFactory";

type Score = Stats;
type Player = {
  name: string;
  uuid: string;
};
export type Entry = {
  id: number;
  rank: number;
  player_name: string;
  user_uuid: string;
} & Score;
type Leaderboard = {
  leaderboard: Entry[];
  newEntry?: Entry;
};
export type State = {
  mode: "hidden" | "addName" | "showLeaderboard";
  pendingScore?: Score;
  player?: Player;
  leaderboard: Leaderboard;
};
type Actions =
  | {
    action: "SHOW_LEADERBOARD";
    leaderboard: Leaderboard;
  }
  | {
    action: "HIDE_LEADERBOARD";
  }
  | {
    action: "SHOW_PLAYER_FORM";
    pendingScore: Score;
  }
  | {
    action: "CREATE_PLAYER";
    player: Player;
  };
const reducer = (state: State, action: Actions): State => {
  switch (action.action) {
    case "SHOW_LEADERBOARD":
      return {
        ...state,
        pendingScore: undefined,
        leaderboard: action.leaderboard,
        mode: "showLeaderboard",
      };
    case "HIDE_LEADERBOARD":
      return {
        ...state,
        mode: "hidden",
      };
    case "SHOW_PLAYER_FORM":
      return { ...state, mode: "addName", pendingScore: action.pendingScore };
    case "CREATE_PLAYER":
      return {
        ...state,
        player: action.player,
      };
  }
};
export const useLeaderboard = () => {
  const api = useApi();
  const [state, dispatch] = useReducer(reducer, {
    mode: "hidden",
    player: JSON.parse(localStorage.getItem("player") || "null"),
    leaderboard: { leaderboard: [] },
  });
  const sendScore = useCallback(
    async (player: Player, score: Score) => {
      const payload = {
        ...score,
        multiplier: (Math.floor(score.multiplier * 10) / 10).toFixed(1),
        points: Math.round(score.points),
        meters: Math.round(score.meters),
        ...player,
      };
      const result = await fetch(
        "https://filipengberg-gameleaderboardapi.web.val.run/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!result.ok) {
        console.error("Failed to submit score:", await result.text());
        return;
      }
      const leaderboard = await result.json();
      dispatch({ action: "SHOW_LEADERBOARD", leaderboard });
    },
    [dispatch]
  );
  const submitName = (name: string) => {
    const player = {
      name,
      uuid: name.toLowerCase(),
    };
    dispatch({ action: "CREATE_PLAYER", player });
    localStorage.setItem("player", JSON.stringify(player));
    if (state.pendingScore) {
      sendScore(player, state.pendingScore);
    }
  };
  useEffect(() => {
    if (!api) {
      return;
    }
    const listener = api.onPlayerDied((payload) => {
      const pendingScore = {
        ...payload.stats,
      };
      if (!state.player) {
        dispatch({
          action: "SHOW_PLAYER_FORM",
          pendingScore,
        });
        return;
      }
      sendScore(state.player, pendingScore);
    });
    return () => {
      api.removeEventCallback(listener);
    };
  }, [api, sendScore, state.player]);
  useEffect(() => {
    if (!api) {
      return;
    }
    const listener = api.onGameRestarted(() => {
      dispatch({
        action: "HIDE_LEADERBOARD"
      });
      return;
    });
    return () => {
      api.removeEventCallback(listener);
    };
  }, [api]);
  return {
    submitName,
    state,
  };
};
