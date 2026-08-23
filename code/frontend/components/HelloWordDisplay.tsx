"use client";

import { useEffect, useState } from "react";

import styles from "./HelloWordDisplay.module.css";

type GreetingState =
  | { status: "loading" }
  | { status: "ok"; text: string }
  | { status: "error"; error: { code: string; message: string } };

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export default function HelloWordDisplay() {
  const [state, setState] = useState<GreetingState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    async function loadGreeting() {
      try {
        const response = await fetch(`${apiBase}/v1/greeting`, {
          signal: controller.signal,
        });

        if (response.ok) {
          const data: { text: string } = await response.json();
          setState({ status: "ok", text: data.text });
          return;
        }

        const data: { error?: { code?: string; message?: string } } = await response.json().catch(() => ({}));
        setState({
          status: "error",
          error: {
            code: data.error?.code ?? "internal_error",
            message: data.error?.message ?? "Unable to load greeting",
          },
        });
      } catch {
        if (!controller.signal.aborted) {
          setState({
            status: "error",
            error: { code: "internal_error", message: "Unable to load greeting" },
          });
        }
      }
    }

    void loadGreeting();

    return () => controller.abort();
  }, []);

  return (
    <main aria-label="Hello Word display" className={styles.shell}>
      <h1 className={styles.title}>
        {state.status === "ok" ? state.text : state.status === "error" ? state.error.message : "Loading greeting"}
      </h1>
    </main>
  );
}
