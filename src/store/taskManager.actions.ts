import type {
  AddTaskInput,
  HistoryEntry,
  RemoveTaskInput,
  SeedDemoInput,
  UpdateTaskInput,
} from '@types';

export type TaskStoreActions = {
  pushHistory: (entry: HistoryEntry) => void;
  addTask: (input: AddTaskInput) => void;
  updateTask: (input: UpdateTaskInput) => void;
  removeTask: (input: RemoveTaskInput) => void;
  seedDemo: (input: SeedDemoInput) => void;
};

export function createTaskStoreActions(): TaskStoreActions {
  return {
    pushHistory() {},
    addTask() {},
    updateTask() {},
    removeTask() {},
    seedDemo() {},
  };
}
