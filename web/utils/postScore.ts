type Score = {
  type: string;
  score: number;
};

type Payload = {
  action: "hiber3d_postScores";
  payload: Score[];
};

export const postScores = (scores: Score[]) => {
  const payload: Payload = {
    action: "hiber3d_postScores",
    payload: scores,
  };
  window.parent.postMessage(payload, "*");
};
