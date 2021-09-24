export namespace HTTPStatus {
  export type HTTPStatusMessage = unknown & {
    time?: number;
  };

  export type NoteCutObject = {
    noteID: number;
    noteType: "NoteA" | "NoteB" | "Bomb";
    noteCutDirection:
      | "Up"
      | "Down"
      | "Left"
      | "Right"
      | "UpLeft"
      | "UpRight"
      | "DownLeft"
      | "DownRight"
      | "Any"
      | "None";
    noteLine: number;
    noteLayer: number;
    speedOK: boolean; // Cut speed was fast enough
    directionOK: null | boolean; // Note was cut in the correct direction. null for bombs.
    saberTypeOK: null | boolean; // Note was cut with the correct saber. null for bombs.
    wasCutTooSoon: boolean; // Note was cut too early
    initialScore: null | number; // Score without multipliers for the cut. It contains the prehit swing score and the cutDistanceScore, but doesn't include the score for swinging after cut. [0..85] null for bombs.
    finalScore: null | number; // Score without multipliers for the entire cut, including score for swinging after cut. [0..115] Available in [`noteFullyCut` event](#notefullycut-event). null for bombs.
    cutDistanceScore: null | number; // Score for the hit itself. [0..15]
    multiplier: number; // Combo multiplier at the time of cut
    saberSpeed: number; // Speed of the saber when the note was cut
    saberDir: [
      // Direction the saber was moving in when the note was cut
      number, // X value
      number, // Y value
      number // Z value
    ];
    saberType: "SaberA" | "SaberB"; // Saber used to cut this note
    swingRating: number; // Game's swing rating. Uses the before cut rating in noteCut events and after cut rating for noteFullyCut events. -1 for bombs.
    timeDeviation: number; // Time offset in seconds from the perfect time to cut a note
    cutDirectionDeviation: number; // Offset from the perfect cut angle in degrees
    cutPoint: [
      // Position of the point on the cut plane closests to the note center
      number, // X value
      number, // Y value
      number // Z value
    ];
    cutNormal: [
      // Normal of the ideal plane to cut along
      number, // X value
      number, // Y value
      number // Z value
    ];
    cutDistanceToCenter: number; // Distance from the center of the note to the cut plane
    timeToNextBasicNote: number; // Time until next note in seconds
  };

  export type StatusObjectGame = {
    pluginVersion: string;
    gameVersion: string;
    scene: "Menu" | "Song" | "Spectator";
    mode:
      | null
      | "SoloStandard"
      | "SoloOneSaber"
      | "SoloNoArrows"
      | "PartyStandard"
      | "PartyOneSaber"
      | "PartyNoArrows"
      | "MultiplayerStandard"
      | "MultiplayerOneSaber"
      | "MultiplayerNoArrows";
  };

  export type StatusObjectMod = {
    multiplier: number;
    obstacles: false | "FullHeightOnly" | "All";
    instaFail: boolean;
    noFail: boolean;
    batteryEnergy: boolean;
    batteryLives: null | number;
    disappearingArrows: boolean;
    noBombs: boolean;
    songSpeed: "Normal" | "Slower" | "Faster" | "SuperFast";
    songSpeedMultiplier: number;
    noArrows: boolean;
    ghostNotes: boolean;
    failOnSaberClash: boolean;
    strictAngles: boolean;
    fastNotes: boolean;
    smallNotes: boolean;
    proMode: boolean;
    zenMode: boolean;
  };

  export type StatusObjectPlayerSettings = {
    staticLights: boolean;
    leftHanded: boolean;
    playerHeight: number;
    sfxVolume: number;
    reduceDebris: boolean;
    noHUD: boolean;
    advancedHUD: boolean;
    autoRestart: boolean;
    saberTrailIntensity: number;
    environmentEffects: "AllEffects" | "StrobeFilter" | "NoEffects";
    hideNoteSpawningEffect: boolean;
  };

  export type StatusObjectBeatmap = {
    songName: string;
    songSubName: string;
    songAuthorName: string;
    levelAuthorName: string;
    songCover: undefined | string; // Base64 encoded PNG
    songHash: string;
    levelId: string;
    songBPM: number;
    noteJumpSpeed: number;
    songTimeOffset: number;
    start: null | number;
    paused: null | number;
    length: number;
    difficulty: "Easy" | "Normal" | "Hard" | "Expert" | "ExpertPlus";
    notesCount: number;
    bombsCount: number;
    obstaclesCount: number;
    maxScore: number;
    maxRank: "SSS" | "SS" | "S" | "A" | "B" | "C" | "D" | "E";
    environmentName: string;
  };

  export type StatusObjectPerformance = {
    rawScore: number;
    score: number;
    currentMaxScore: number;
    rank: "SSS" | "SS" | "S" | "A" | "B" | "C" | "D" | "E";
    passedNotes: number;
    hitNotes: number;
    missedNotes: number;
    passedBombs: number;
    hitBombs: number;
    combo: number;
    maxCombo: number;
    multiplier: number;
    multiplierProgress: number;
    batteryEnergy: null | number;
    softFailed: boolean;
  };

  export type StatusObject = {
    game: StatusObjectGame;
    beatmap: null | StatusObjectBeatmap;
    performance: null | StatusObjectPerformance;
    mod: StatusObjectMod;
    playerSettings: StatusObjectPlayerSettings;
  };

  export type TimeMessage = {
    time: number;
  };

  export type Message = TimeMessage & {
    event:
      | "hello"
      | "songStart"
      | "finished"
      | "softFailed"
      | "failed"
      | "menu"
      | "pause"
      | "resume"
      | "noteCut"
      | "noteFullyCut"
      | "noteMissed"
      | "bombCut"
      | "bombMissed"
      | "obstacleEnter"
      | "obstacleExit"
      | "scoreChanged"
      | "beatmapEvent";
    time: number;
  };

  export type _NoteCutMessage = {
    noteCut: NoteCutObject;
  };

  export type FullStatusMessage = {
    status: StatusObject;
  };

  export type PerformanceStatusMessage = {
    status: Pick<FullStatusMessage["status"], "performance">;
  };

  export type BeatmapStatusMessage = {
    status: Pick<FullStatusMessage["status"], "beatmap">;
  };

  // Sent when the client connects to the WebSocket server.
  export type HelloMessage = Message &
    FullStatusMessage & {
      event: "hello";
    };

  // Fired when the GameCore scene is activated. In case of multiplayer,
  // this is delayed until the countdown starts.
  // If the player is spectating at the beginning of the song, game.scene will
  // be set to Spectator and only beatmap events will be fired.
  // If the player fails the map but other players are still alive, the failed
  // event will be fired and the menu event will be delayed until after the map is over.
  export type SongStartMessage = Message &
    FullStatusMessage & {
      event: "songStart";
    };

  // Fired when the player finishes a beatmap.
  export type FinishedMessage = Message &
    PerformanceStatusMessage & {
      event: "finished";
    };

  // Fired when the player's energy counter reaches 0 but the player can
  // continue playing (for example if the No Fail modifier is on).
  // After this event is fired, the performance.softFailed
  // property of the Status object will be set to true until the
  // end of the map. Any properties that are affected by the modifier
  // multiplier will also be updated accordingly (such as mod.multiplier,
  // beatmap.maxRank, and performance.currentMaxScore, among others).
  // When the player completes the map after this event was fired,
  // the finished event will be used to signal that.
  export type SoftFailedMessage = Message & {
    event: "softFailed";
    status: Pick<
      FullStatusMessage["status"],
      "beatmap" | "performance" | "mod"
    >;
  };

  // Fired when the player fails a beatmap.
  export type FailedMessage = Message &
    PerformanceStatusMessage & {
      event: "failed";
    };

  // Fired when the Menu scene is activated. In case of multiplayer,
  // this happens whenever the room enters the lobby.
  export type MenuMessage = Message &
    FullStatusMessage & {
      event: "menu";
    };

  // Fired when the beatmap is paused.
  export type PauseMessage = Message &
    BeatmapStatusMessage & {
      event: "pause";
    };

  // Fired when the beatmap is resumed.
  export type ResumeMessage = Message &
    BeatmapStatusMessage & {
      event: "resume";
    };

  // Fired when a note is cut.
  export type NoteCutMessage = Message &
    PerformanceStatusMessage &
    _NoteCutMessage & {
      event: "noteCut";
    };

  // Fired when the AfterCutScoreBuffer finishes, ie. the game finishes
  // gathering data to calculated the cut exit score.
  // The field performance.lastNoteScore is updated right before this
  // event is fired. This even is not fired for bomb notes.
  export type NoteFullyCutMessage = Message &
    PerformanceStatusMessage &
    _NoteCutMessage & {
      event: "noteFullyCut";
    };

  // Fired when a note is missed.
  export type NoteMissedMessage = Message &
    PerformanceStatusMessage &
    _NoteCutMessage & {
      event: "noteMissed";
    };

  // Fired when a bomb is cut.
  export type BombCutMessage = Message &
    PerformanceStatusMessage &
    _NoteCutMessage & {
      event: "bombCut";
    };

  // Fired when a bomb is missed.
  export type BombMissedMessage = Message &
    PerformanceStatusMessage &
    _NoteCutMessage & {
      event: "bombMissed";
    };

  // Fired when the player enters an obstacle.
  export type ObstacleEnterMessage = Message &
    PerformanceStatusMessage & {
      event: "obstacleEnter";
    };

  // Fired when the player exits an obstacle.
  export type ObstacleExitMessage = Message &
    PerformanceStatusMessage & {
      event: "obstacleExit";
    };

  // Fired when the score changes.
  export type ScoreChangedMessage = Message &
    PerformanceStatusMessage & {
      event: "scoreChanged";
    };

  // Fired when a beatmap event is triggered. Beatmap events include
  // changing light colors, light rotation speed and moving the square rings.
  export type BeatmapEventMessage = Message & {
    event: "beatmapEvent";
  };

  export type FakeMessage = Message & {
    event: "fakeEvent";
  };

  export type UnknownMessage =
    | BeatmapEventMessage
    | ScoreChangedMessage
    | ObstacleExitMessage
    | ObstacleEnterMessage
    | BombMissedMessage
    | BombCutMessage
    | NoteMissedMessage
    | NoteCutMessage
    | NoteFullyCutMessage
    | ResumeMessage
    | PauseMessage
    | MenuMessage
    | FailedMessage
    | SoftFailedMessage
    | FinishedMessage
    | SongStartMessage
    | HelloMessage;

  export type Handler<T extends UnknownMessage> = (message: T) => void;

  export type HelloHandler = Handler<HelloMessage>;
  export type BeatmapEventHandler = Handler<BeatmapEventMessage>;
  export type BombCutHandler = Handler<BombCutMessage>;
  export type BombMissedHandler = Handler<BombMissedMessage>;
  export type FailedHandler = Handler<FailedMessage>;
  export type FinishedHandler = Handler<FinishedMessage>;
  export type MenuHandler = Handler<MenuMessage>;
  export type NoteCutHandler = Handler<NoteCutMessage>;
  export type NoteMissedHandler = Handler<NoteMissedMessage>;
  export type ObstacleEnterHandler = Handler<ObstacleEnterMessage>;
  export type ObstacleExitHandler = Handler<ObstacleExitMessage>;
  export type PauseHandler = Handler<PauseMessage>;
  export type ResumeHandler = Handler<ResumeMessage>;
  export type ScoreChangedHandler = Handler<ScoreChangedMessage>;
  export type SoftFailedHandler = Handler<SoftFailedMessage>;
  export type NoteFullyCutHandler = Handler<NoteFullyCutMessage>;
  export type SongStartHandler = Handler<SongStartMessage>;

  export type UseHTTPStatusWebsocketHandlers = {
    hello?: HelloHandler;
    beatmapEvent?: BeatmapEventHandler;
    bombCut?: BombCutHandler;
    bombMissed?: BombMissedHandler;
    failed?: FailedHandler;
    finished?: FinishedHandler;
    menu?: MenuHandler;
    noteCut?: NoteCutHandler;
    noteFullyCut?: NoteFullyCutHandler;
    noteMissed?: NoteMissedHandler;
    obstacleEnter?: ObstacleEnterHandler;
    obstacleExit?: ObstacleExitHandler;
    pause?: PauseHandler;
    resume?: ResumeHandler;
    scoreChanged?: ScoreChangedHandler;
    softFailed?: SoftFailedHandler;
    songStart?: SongStartHandler;
  };
}
