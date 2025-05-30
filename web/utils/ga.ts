export const sendGaEvent = (
  eventName: Gtag.EventNames | (string & {}),
  params?: Gtag.EventParams | Gtag.ControlParams | Gtag.CustomParams | undefined
) => {
  gtag?.("event", eventName, params);
};
