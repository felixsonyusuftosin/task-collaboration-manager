import type { TaskStoreState } from '@types';

export function createInitialTaskStoreState(): TaskStoreState {
  return {
    tasks: {},
    history: [],
    historyIndex: -1,
  };
}

export function hasHistory(state: TaskStoreState): boolean {
  return state.historyIndex >= 0 && state.history.length > 0;
}

export function getTaskCount(state: TaskStoreState): number {
  return Object.keys(state.tasks).length;
}

export function getSnapshotCount(state: TaskStoreState): number {
  return state.history.length;
}
