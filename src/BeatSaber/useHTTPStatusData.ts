import React from "react";
import { HTTPStatus } from "./HTTPStatusProtocol";

function useHTTPStatusData() {
  const [statusGame, setStatusGame] = React.useState<HTTPStatus.StatusObjectGame | null>(null);
  const [statusBeatmap, setStatusBeatmap] = React.useState<HTTPStatus.StatusObjectBeatmap | null>(null);
  const [statusModifiers, setStatusModifiers] = React.useState<HTTPStatus.StatusObjectMod | null>(null);
  const [statusPerformance, setStatusPerformance] = React.useState<HTTPStatus.StatusObjectPerformance | null>(null);
  const [statusPlayerSettings, setStatusPlayerSettings] = React.useState<HTTPStatus.StatusObjectPlayerSettings | null>(null);

  const noHandler = React.useCallback(() => {}, []);
  const pushStatus = React.useCallback<(msg: HTTPStatus.FullStatusMessage) => void>((message) => {
    setStatusGame(message.status.game || null);
    setStatusModifiers(message.status.mod || null);
    setStatusBeatmap(message.status.beatmap || null);
    setStatusPerformance(message.status.performance || null);
    setStatusPlayerSettings(message.status.playerSettings || null);
  }, [setStatusGame, setStatusBeatmap, setStatusPerformance, setStatusModifiers, setStatusPlayerSettings]);
  const pushPerformanceStatus = React.useCallback<(msg: HTTPStatus.PerformanceStatusMessage) => void>((message) => {
    setStatusPerformance(message.status.performance || null);
  }, [setStatusPerformance]);
  const pushSoftFailedMessage = React.useCallback<(msg: HTTPStatus.SoftFailedMessage) => void>((message) => {
    setStatusPerformance(message.status.performance || null);
    setStatusModifiers(message.status.mod || null);
    setStatusBeatmap(message.status.beatmap || null);
  }, [setStatusPerformance, setStatusModifiers, setStatusBeatmap]);
  const pushBeatmapStatus = React.useCallback<(msg: HTTPStatus.BeatmapStatusMessage) => void>((message) => {
    setStatusBeatmap(message.status.beatmap || null);
  }, [setStatusBeatmap]);

  const handlers: HTTPStatus.UseHTTPStatusWebsocketHandlers = {
    beatmapEvent: noHandler,
    bombCut: pushPerformanceStatus,
    bombMissed: pushPerformanceStatus,
    failed: pushPerformanceStatus,
    finished: pushPerformanceStatus,
    hello: pushStatus,
    menu: pushStatus,
    noteCut: pushPerformanceStatus,
    noteFullyCut: pushPerformanceStatus,
    noteMissed: pushPerformanceStatus,
    obstacleEnter: pushPerformanceStatus,
    obstacleExit: pushPerformanceStatus,
    pause: pushBeatmapStatus,
    resume: pushBeatmapStatus,
    scoreChanged: pushPerformanceStatus,
    softFailed: pushSoftFailedMessage,
    songStart: pushStatus
  };

  return {
    handlers,
    statusGame,
    statusBeatmap,
    statusModifiers,
    statusPerformance,
    statusPlayerSettings
  } as const;
}

export { useHTTPStatusData };
