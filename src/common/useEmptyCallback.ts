import React from "react";

export function useEmptyCallback() {
  return React.useCallback(() => undefined, []);
}
