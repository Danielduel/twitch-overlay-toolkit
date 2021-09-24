import React from "react";
import { HTTPStatus } from "./HTTPStatusProtocol";
import { useWebsocket, UseWebsocketConfig } from "../common/useWebsocket";

const httpStatusAddress = "ws://localhost:6557/socket";

type UseHTTPStatusWebsocketConfig = Pick<
  UseWebsocketConfig,
  "address" | "debug" | "errorHandler"
>;

function execute<
  M extends HTTPStatus.Message,
  H = HTTPStatus.UseHTTPStatusWebsocketHandlers[M["event"]]
>(handler: H | undefined, message: M) {
  if (typeof handler === "function") {
    handler(message);
  }
}

function executeHandlers(
  handlers: HTTPStatus.UseHTTPStatusWebsocketHandlers,
  message: HTTPStatus.Message
) {
  execute(handlers[message.event], message);
}

export function useHTTPStatusWebsocket(
  opts: UseHTTPStatusWebsocketConfig,
  handlersArr: HTTPStatus.UseHTTPStatusWebsocketHandlers[]
) {
  const messageHandler = React.useCallback(
    (message: HTTPStatus.Message) => {
      handlersArr.forEach(handlers => {
        executeHandlers(handlers, message);
      });
    },
    [handlersArr]
  );
  useWebsocket({
    address: opts.address,
    debug: opts.debug,
    errorHandler: opts.errorHandler,
    messageHandler,
  });
}
