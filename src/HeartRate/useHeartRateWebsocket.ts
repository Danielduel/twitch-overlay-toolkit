import React from "react";
import { UseWebsocketConfig, useWebsocket } from "../common/useWebsocket";

export type UseHeartRateWebsocketConfig = Pick<UseWebsocketConfig, "address" | "debug" | "errorHandler">;

export type HeartRateReading = {
  Flags: number;
  Status: number; // bool-like?
  BeatsPerMinute: number;
  EnergyExpended: null | number; // number?
  RRIntervals: [ number ];
};

export function useHeartRateWebsocket(
  opts: UseHeartRateWebsocketConfig
) {
  const [flags, setFlags] = React.useState(0);
  const [status, setStatus] = React.useState(0);
  const [bpm, setBpm] = React.useState(0);
  const [rrIntervals, setRrIntervals] = React.useState([1000]);

  const messageHandler = React.useCallback(
    (message: HeartRateReading) => {
      setFlags(message.Flags);
      setStatus(message.Status);
      setBpm(message.BeatsPerMinute);
      setRrIntervals(message.RRIntervals);
    },
    [setFlags, setStatus, setBpm, setRrIntervals]
  );

  useWebsocket({
    address: opts.address,
    debug: opts.debug,
    errorHandler: opts.errorHandler,
    messageHandler
  });

  return {
    flags,
    status,
    bpm,
    rrIntervals
  }  as const;
}
