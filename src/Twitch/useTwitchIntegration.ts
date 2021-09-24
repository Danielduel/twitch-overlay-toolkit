import React from "react";
import { StaticAuthProvider } from "@twurple/auth";
import { ChatClient } from "@twurple/chat";
import { PubSubClient } from "@twurple/pubsub";

// keys

type UseTwitchIntegrationConfig = {
  username: string;
  token: string;
  channels: string[];
  isAlwaysMod: boolean;
};

export type OnChatMessageEvent = {
  channel: string;
  user: string;
  message: string;
};
export type TwitchEventSubHandlers = {
  onRedemption: Parameters<PubSubClient["onRedemption"]>[1],
  onChatMessage: (e: OnChatMessageEvent) => void
};

export function createUseTwitchIntegration(clientId: string, accessToken: string) {
  return function ({
    username,
    token,
    channels,
    isAlwaysMod,
  }: UseTwitchIntegrationConfig, handlers: TwitchEventSubHandlers) {
    const authProvider = React.useRef<StaticAuthProvider>(
      new StaticAuthProvider(username, token)
    );
    const authProviderTtg = React.useRef<StaticAuthProvider>(
      new StaticAuthProvider(clientId, accessToken)
    );
    const chatInstance = React.useRef<ChatClient>(
      new ChatClient({
        authProvider: authProvider.current,
        channels,
        isAlwaysMod,
      })
    );
    const pubSubClient = React.useRef(new PubSubClient());
    React.useEffect(() => {
      // pubSubClient.current.connect()
      //   .catch((err) => console.error(err));
      // pubSubClient.current.onConnect(() => {
      //   console.log("PubSub connected");
      //   pubSubClient.current.listen("channel-points-channel-v1.29831480", authProviderTtg.current);
      // });
      // pubSubClient.current.onMessage((...a) => {
      //   console.log(a);
      // });
      pubSubClient.current.registerUserListener(authProviderTtg.current)
        .then(userId => {
          pubSubClient.current.onRedemption(userId, handlers.onRedemption);
        });
    }, [pubSubClient, authProviderTtg]);

    React.useEffect(() => {
      chatInstance.current.connect();
      chatInstance.current.onConnect(() => {
        console.log("Twitch integration connected");
      });
      chatInstance.current.onDisconnect(() => {});
      chatInstance.current.onJoin(() => {
        console.log("Twitch integration joined");
        // chatInstance.current.say("danielduel", "Hello");
      });
      chatInstance.current.onMessage((channel, user, message) => {
        handlers.onChatMessage({
          channel,
          user,
          message
        });
      });
    }, [chatInstance]);
  }
}