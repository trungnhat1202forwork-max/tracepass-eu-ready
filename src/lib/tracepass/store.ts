import { useSyncExternalStore } from "react";

export type AppState = {
  aiProcessed: boolean;
  issuesResolved: boolean;
  dppPublished: boolean;
  uploadedLab: boolean;
};

let state: AppState = {
  aiProcessed: false,
  issuesResolved: false,
  dppPublished: false,
  uploadedLab: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function setAppState(patch: Partial<AppState>) {
  state = { ...state, ...patch };
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return state;
}

export function useAppState() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
