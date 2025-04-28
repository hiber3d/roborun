import { Stats, useHiber3D } from "@hiber3d/web";
import { useCallback, useEffect, useReducer } from "react";
import { telegramUser } from "utils/telegram";

type Score = Stats;
export type Player = {
  name: string;
  uuid: string;
  rank?: number;
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
  mode: "mainMenu" | "playing" | "addName" | "showLeaderboard" | "showLeaderboardWithRetry";
  pendingScore?: Score;
  player?: Player;
  leaderboard: Leaderboard;
};

type Actions =
  | {
      action: "SHOW_LEADERBOARD";
      leaderboard: Leaderboard;
      mode: "showLeaderboard" | "showLeaderboardWithRetry";
    }
  | {
      action: "UPDATE_LEADERBOARD";
      leaderboard: Leaderboard;
    }
  | {
      action: "START_PLAYING";
    }
  | {
      action: "SHOW_MAIN_MENU";
    }
  | {
      action: "SHOW_PLAYER_FORM";
      pendingScore: Score;
    }
  | {
      action: "CREATE_PLAYER";
      player: Player;
    }
  | {
      action: "SET_PLAYER_RANK";
      rank: number;
    };

const reducer = (state: State, action: Actions): State => {
  switch (action.action) {
    case "SHOW_LEADERBOARD":
      return {
        ...state,
        pendingScore: undefined,
        leaderboard: action.leaderboard,
        mode: action.mode,
      };
    case "UPDATE_LEADERBOARD":
      return {
        ...state,
        leaderboard: {
          ...state.leaderboard,
          leaderboard: action.leaderboard.leaderboard,
        },
      };
    case "START_PLAYING":
      return {
        ...state,
        mode: "playing",
      };
    case "SHOW_MAIN_MENU":
      return {
        ...state,
        mode: "mainMenu",
      };
    case "SHOW_PLAYER_FORM":
      return { ...state, mode: "addName", pendingScore: action.pendingScore };
    case "CREATE_PLAYER":
      return {
        ...state,
        player: action.player,
      };
    case "SET_PLAYER_RANK":
      if (!state.player) {
        return state;
      }
      return {
        ...state,
        player: {
          ...state.player,
          rank: action.rank,
        },
      };
  }
};

const loadPlayerName = (): Player => {
  if (telegramUser?.username && telegramUser?.id) {
    return {
      name: telegramUser.username,
      uuid: telegramUser.id.toString(),
    };
  }

  return JSON.parse(localStorage.getItem("player") || "null");
};

export const useLeaderboard = () => {
  const { api, canvasRef } = useHiber3D();
  const [state, dispatch] = useReducer(reducer, {
    mode: "mainMenu",
    player: loadPlayerName(),
    leaderboard: { leaderboard: [] },
  });

  useEffect(() => {
    if (!api) {
      return;
    }

    const startGameListener = api.onBroadcastGameStarted(() => {
      canvasRef?.focus();
      dispatch({
        action: "START_PLAYING",
      });
    });

    const restartGameListener = api.onGameRestarted((payload) => {
      if (payload.autoStart) {
        dispatch({
          action: "START_PLAYING",
        });
      } else {
        dispatch({
          action: "SHOW_MAIN_MENU",
        });
      }
    });

    return () => {
      api.removeEventCallback(restartGameListener);
      api.removeEventCallback(startGameListener);
    };
  }, [api, canvasRef]);

  const sendScore = useCallback(
    async (player: Player, score: Score) => {
      const payload = {
        ...score,
        multiplier: (Math.floor(score.multiplier * 10 + 0.0001) / 10).toFixed(1),
        points: Math.round(score.points),
        meters: Math.round(score.meters),
        ...player,
      };
      const result = await fetch("https://filipengberg-gameleaderboardapi.web.val.run/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!result.ok) {
        console.error("Failed to submit score:", await result.text());
        return;
      }
      const leaderboard = await result.json();
      dispatch({ action: "SHOW_LEADERBOARD", leaderboard, mode: "showLeaderboardWithRetry" });
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

  const fetchRank = useCallback(async () => {
    if (!state.player?.uuid) {
      return;
    }
    try {
      const result = await fetch(`https://filipengberg-gameleaderboardapi.web.val.run/rank?uuid=${state.player.uuid}`);
      const json = await result.json();
      dispatch({
        action: "SET_PLAYER_RANK",
        rank: json.rank,
      });
    } catch (error) {
      console.error("Failed to fetch rank:", error);
    }
  }, [state.player?.uuid]);

  const showLeaderboard = async () => {
    dispatch({
      action: "SHOW_LEADERBOARD",
      leaderboard: {
        leaderboard: state.leaderboard.leaderboard,
      },
      mode: "showLeaderboard",
    });

    try {
      const result = await fetch("https://filipengberg-gameleaderboardapi.web.val.run/leaderboard");
      const leaderboard = await result.json();
      dispatch({
        action: "UPDATE_LEADERBOARD",
        leaderboard: {
          leaderboard,
        },
      });
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    }
  };

  const showMainMenu = () => {
    dispatch({
      action: "SHOW_MAIN_MENU",
    });
  };

  return {
    submitName,
    state,
    fetchRank,
    showLeaderboard,
    showMainMenu,
  };
};
