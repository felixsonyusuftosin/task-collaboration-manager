import type { TaskManagerActionName } from '@types';

export type TaskManagerActions = {
  selectedAction: TaskManagerActionName | null;
};

export function createTaskManagerActions(): TaskManagerActions {
  return {
    selectedAction: null,
  };
}
