"use client";

import { useMemo } from "react";

import styles from "./HelloWordDisplay.module.css";
import { getGreeting, type GreetingState } from "../lib/mock/show-hello-word-page";

function resolveGreetingState(rawState: string | null): GreetingState {
  if (rawState === "loading" || rawState === "empty" || rawState === "error") {
    return rawState;
  }

  return "default";
}

export default function HelloWordDisplay({ state = "default" }: { state?: string }) {
  const viewState = useMemo(() => resolveGreetingState(state), [state]);
  const greeting = getGreeting(viewState);

  return (
    <main aria-label="Hello Word display" className={styles.shell}>
      <h1 className={styles.title}>{greeting}</h1>
    </main>
  );
}
