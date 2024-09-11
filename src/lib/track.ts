import { sendGAEvent } from "@next/third-parties/google";

export const trackEvent = async (
  eventName: string,
  properties = {},
  user_id: string | null = null,
) => {
  const timestamp = new Date().toISOString();
  const payload = {
    ...properties,
    timestamp,
    ...(user_id !== null && { user_id }),
  };
  let gaTrackEvent = null;
  if (!gaTrackEvent) {
    gaTrackEvent = sendGAEvent;
  }

  gaTrackEvent("event", eventName, payload);

  // Umami tracking (only if window is defined)
  if (typeof window !== "undefined" && window.umami) {
    window.umami.track(eventName, payload);
  }
};
