import { PostScore } from "GameTemplate_webgpu";

type Payload = {
  action: "hiber3d_postScores";
  payload: PostScore;
  version: number;
};

type StatusPayload = {
  action: "hiber3d_postStatus";
  payload: {
    isNewRound: boolean;
  };
};

export const postScores = (scores: PostScore) => {
  const payload: Payload = {
    action: "hiber3d_postScores",
    payload: scores,
    version: 2,
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
