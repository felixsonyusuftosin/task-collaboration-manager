import type { TaskManagerState } from '@types';

export function createInitialHistoryState(): TaskManagerState {
  return {
    tasks: {},
    history: [],
    historyIndex: -1,
  };
}

export function hasHistory(state: TaskManagerState): boolean {
  return state.historyIndex >= 0 && state.history.length > 0;
}

export function getTaskCount(state: TaskManagerState): number {
  return Object.keys(state.tasks).length;
}

export function getSnapshotCount(state: TaskManagerState): number {
  return state.history.length;
}
