import React from "react";

type UseWebsocketConfig = {
  address: string;
  messageHandler: (message: unknown) => void;
  errorHandler: (error: unknown) => void;
  debug: boolean;
};

function useLogger (debug: boolean) {
  return React.useCallback((message: string, level: "log" | "error" | "info" | "warn" = "log") => {
    if (!debug) return;

    switch (level) {
      case "log": console.log(message); return;
      case "error": console.error(message); return;
      case "info": console.info(message); return;
      case "warn": console.warn(message); return;
    }
  }, [ debug ]);
}

function useOnClose (setShouldReconnect: React.Dispatch<React.SetStateAction<boolean>>) {
  return React.useCallback(() => {
    setShouldReconnect(true);
  }, [setShouldReconnect]);
}

function useOnMessage(
  messageHandler: (message: unknown) => void,
  errorHandler: (error: unknown) => void
) {
  return React.useCallback(
    (ev: MessageEvent<string>) => {
      try {
        const eventData = JSON.parse(ev.data) as unknown;
        messageHandler(eventData);
      }
      catch (parsingOrHandlingError: unknown) {
        errorHandler(parsingOrHandlingError);
      }
    },
    [ messageHandler, errorHandler ]
  );
}

function useWebsocketReset (
  address: string,
  websocket: React.MutableRefObject<WebSocket | null>,
  onClose: () => void,
  onMessage: (ev: MessageEvent<string>) => void
) {
  return React.useCallback(() => {
    console.log("resetWs");
    websocket.current?.close();
    websocket.current = null;

    websocket.current = new WebSocket(address);
    websocket.current.onclose = onClose;
    websocket.current.onmessage = onMessage;
    websocket.current.onopen = () => {
      console.log("Connected");
    };
    websocket.current.onerror = onClose;
  }, [onClose, onMessage]);
}

function useWebsocket ({
  address,
  messageHandler,
  errorHandler,
  debug
}: UseWebsocketConfig) {
  const log = useLogger(debug);
  const websocket = React.useRef<WebSocket | null>(null);
  const [shouldReconnect, setShouldReconnect] = React.useState(true);
  
  const onClose = useOnClose(setShouldReconnect);
  const onMessage = useOnMessage(messageHandler, errorHandler);
  const onWebsocketReset = useWebsocketReset(address, websocket, onClose, onMessage);

  React.useEffect(() => {
    if (shouldReconnect) {
      setShouldReconnect(false);
      onWebsocketReset();
    }
  }, [shouldReconnect, setShouldReconnect, onWebsocketReset]);
  return [ websocket ] as const;
}

export { useWebsocket };
export type { UseWebsocketConfig };
