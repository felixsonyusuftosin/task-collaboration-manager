import type {
  AddTaskInput,
  HistoryEntry,
  RemoveTaskInput,
  SeedDemoInput,
  TaskStoreState,
  UpdateTaskInput,
} from '@types';
import {
  addTaskToRecord,
  appendHistoryEntry,
  copyHistoryEntry,
  createHistoryEntry,
  createSeedState,
  createTimeTravelState,
  removeTaskFromRecord,
  updateTaskInRecord,
} from '@store/taskManager.utils';

export type TaskStoreActions = {
  pushHistory: (entry: HistoryEntry) => void;
  addTask: (input: AddTaskInput) => void;
  // When a parent start time changes, updateTask must cascade the same
  // time delta across all descendants while preserving each task duration.
  updateTask: (input: UpdateTaskInput) => void;
  removeTask: (input: RemoveTaskInput) => void;
  seedDemo: (input: SeedDemoInput) => void;
  timeTravelTo: (historyIndex: number) => void;
};

type TaskStoreSlice = TaskStoreState & TaskStoreActions;

type SetTaskStore = (
  updater: (state: TaskStoreSlice) => Partial<TaskStoreSlice>,
) => void;

type GetTaskStore = () => TaskStoreSlice;

function createHistoryStatePatch(
  state: TaskStoreSlice,
  tasks: TaskStoreState['tasks'],
): Partial<TaskStoreSlice> {
  if (tasks === state.tasks) {
    return {};
  }

  const entry = createHistoryEntry(tasks);
  const historyState = appendHistoryEntry(state, entry);

  return {
    tasks,
    ...historyState,
  };
}

export function createTaskStoreActions(
  set: SetTaskStore,
  get: GetTaskStore,
): TaskStoreActions {
  return {
    pushHistory(entry) {
      set((state) => appendHistoryEntry(state, copyHistoryEntry(entry)));
    },

    addTask(input) {
      set((state) => {
        const nextTasks = addTaskToRecord(state.tasks, input);
        return createHistoryStatePatch(state, nextTasks);
      });
    },

    updateTask(input) {
      set((state) => {
        const nextTasks = updateTaskInRecord(state.tasks, input);
        return createHistoryStatePatch(state, nextTasks);
      });
    },

    removeTask(input) {
      set((state) => {
        const nextTasks = removeTaskFromRecord(state.tasks, input.id);
        return createHistoryStatePatch(state, nextTasks);
      });
    },

    seedDemo(input) {
      const nextState = createSeedState(input);
      const currentState = get();

      set(() => ({
        ...currentState,
        ...nextState,
      }));
    },

    timeTravelTo(historyIndex) {
      set((state) => createTimeTravelState(state, historyIndex));
    },
  };
}
