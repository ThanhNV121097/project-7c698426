export type GreetingState = "default" | "loading" | "empty" | "error";

export type GreetingResponse =
  | { status: "ok"; text: string }
  | { status: "error"; error: { code: string; message: string } };

const responses: Record<GreetingState, GreetingResponse> = {
  default: { status: "ok", text: "Hello Word" },
  loading: { status: "error", error: { code: "loading", message: "Loading greeting" } },
  empty: { status: "error", error: { code: "not_found", message: "Greeting not found" } },
  error: { status: "error", error: { code: "internal_error", message: "Unable to load greeting" } },
};

export function getGreeting(state: GreetingState): string {
  const response = responses[state];
  return response.status === "ok" ? response.text : response.error.message;
}
