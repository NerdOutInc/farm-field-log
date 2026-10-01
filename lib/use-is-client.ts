import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// True only in the browser. Dates are rendered in the viewer's own time zone,
// which the server doesn't know, so date UI waits until it's on the client.
export function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
