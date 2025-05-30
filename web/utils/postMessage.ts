type Score = {
  type: string;
  score: number;
};

type Payload = {
  action: "hiber3d_postScores";
  payload: Score[];
};

type StatusPayload = {
  action: "hiber3d_postStatus";
  payload: {
    isNewRound: boolean;
  };
};

export const postScores = (scores: Score[]) => {
  const payload: Payload = {
    action: "hiber3d_postScores",
    payload: scores,
  };
  window.parent.postMessage(payload, "*");
};

export const postStatus = () => {
  const payload: StatusPayload = {
    action: "hiber3d_postStatus",
    payload: {
      isNewRound: true,
    },
  };
  window.parent.postMessage(payload, "*");
};
