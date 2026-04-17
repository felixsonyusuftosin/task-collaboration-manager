import type {
  AddTaskInput,
  HistoryEntry,
  SeedDemoInput,
  Task,
  TaskId,
  TaskRecord,
  TaskStoreState,
  UpdateTaskInput,
} from '@types';

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

function cloneTask(task: Task): Task {
  return {
    ...task,
  };
}

function cloneTaskRecord(tasks: TaskRecord): TaskRecord {
  const nextTasks: TaskRecord = {};

  Object.values(tasks).forEach((task) => {
    nextTasks[task.id] = cloneTask(task);
  });

  return nextTasks;
}

function buildChildrenByParentId(tasks: TaskRecord): Record<TaskId, TaskId[]> {
  const childrenByParentId: Record<TaskId, TaskId[]> = {};

  Object.values(tasks).forEach((task) => {
    if (!task.parentId) {
      return;
    }

    if (!childrenByParentId[task.parentId]) {
      childrenByParentId[task.parentId] = [];
    }

    childrenByParentId[task.parentId].push(task.id);
  });

  return childrenByParentId;
}

function formatDateTimePart(value: number): string {
  return String(value).padStart(2, '0');
}

function formatDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = formatDateTimePart(date.getMonth() + 1);
  const day = formatDateTimePart(date.getDate());
  const hours = formatDateTimePart(date.getHours());
  const minutes = formatDateTimePart(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function shiftDateTime(value: string, timeDeltaMs: number): string {
  return formatDateTime(new Date(new Date(value).getTime() + timeDeltaMs));
}

export function createHistoryEntry(tasks: TaskRecord): HistoryEntry {
  return {
    tasks: cloneTaskRecord(tasks),
    createdAt: new Date().toISOString(),
  };
}

export function appendHistoryEntry(
  state: TaskStoreState,
  entry: HistoryEntry,
): Pick<TaskStoreState, 'history' | 'historyIndex'> {
  const nextHistory = state.history.slice(0, state.historyIndex + 1);
  nextHistory.push(entry);

  return {
    history: nextHistory,
    historyIndex: nextHistory.length - 1,
  };
}

export function copyHistoryEntry(entry: HistoryEntry): HistoryEntry {
  return {
    createdAt: entry.createdAt,
    tasks: cloneTaskRecord(entry.tasks),
  };
}

export function getHistoryEntryAtIndex(
  history: HistoryEntry[],
  historyIndex: number,
): HistoryEntry | null {
  if (historyIndex < 0 || historyIndex >= history.length) {
    return null;
  }

  return history[historyIndex];
}

export function createTaskRecordFromList(tasks: Task[]): TaskRecord {
  const nextTasks: TaskRecord = {};

  tasks.forEach((task) => {
    nextTasks[task.id] = cloneTask(task);
  });

  return nextTasks;
}

export function addTaskToRecord(
  tasks: TaskRecord,
  input: AddTaskInput,
): TaskRecord {
  if (tasks[input.id]) {
    return tasks;
  }

  const nextTasks = cloneTaskRecord(tasks);
  nextTasks[input.id] = cloneTask(input);

  return nextTasks;
}

export function updateTaskInRecord(
  tasks: TaskRecord,
  input: UpdateTaskInput,
): TaskRecord {
  const existingTask = tasks[input.id];

  if (!existingTask) {
    return tasks;
  }

  const nextTask: Task = {
    ...existingTask,
    ...input.changes,
  };

  const hasTitleChanged = nextTask.title !== existingTask.title;
  const hasParentChanged = nextTask.parentId !== existingTask.parentId;
  const hasStatusChanged = nextTask.status !== existingTask.status;
  const hasStartChanged = nextTask.startAt !== existingTask.startAt;
  const hasEndChanged = nextTask.endAt !== existingTask.endAt;

  const hasTaskChanged =
    hasTitleChanged ||
    hasParentChanged ||
    hasStatusChanged ||
    hasStartChanged ||
    hasEndChanged;

  if (!hasTaskChanged) {
    return tasks;
  }

  const nextTasks = cloneTaskRecord(tasks);
  nextTasks[input.id] = nextTask;

  if (
    !input.changes.startAt ||
    input.changes.startAt === existingTask.startAt
  ) {
    return nextTasks;
  }

  const timeDeltaMs =
    new Date(input.changes.startAt).getTime() -
    new Date(existingTask.startAt).getTime();

  if (timeDeltaMs === 0) {
    return nextTasks;
  }

  const childrenByParentId = buildChildrenByParentId(nextTasks);
  const pendingTaskIds: TaskId[] = [...(childrenByParentId[input.id] ?? [])];

  while (pendingTaskIds.length > 0) {
    const currentTaskId = pendingTaskIds.shift();

    if (!currentTaskId) {
      continue;
    }

    const currentTask = nextTasks[currentTaskId];

    if (!currentTask) {
      continue;
    }

    nextTasks[currentTaskId] = {
      ...currentTask,
      startAt: shiftDateTime(currentTask.startAt, timeDeltaMs),
      endAt: shiftDateTime(currentTask.endAt, timeDeltaMs),
    };

    const childTaskIds = childrenByParentId[currentTaskId] ?? [];
    pendingTaskIds.push(...childTaskIds);
  }

  return nextTasks;
}

export function removeTaskFromRecord(
  tasks: TaskRecord,
  removedTaskId: TaskId,
): TaskRecord {
  const removedTask = tasks[removedTaskId];

  if (!removedTask) {
    return tasks;
  }

  const nextTasks = cloneTaskRecord(tasks);
  delete nextTasks[removedTaskId];

  Object.values(nextTasks).forEach((task) => {
    if (task.parentId !== removedTaskId) {
      return;
    }

    nextTasks[task.id] = {
      ...task,
      parentId: null,
      status: 'orphaned',
    };
  });

  return nextTasks;
}

export function createSeedState(input: SeedDemoInput): TaskStoreState {
  const tasks = createTaskRecordFromList(input.tasks);
  const entry = createHistoryEntry(tasks);

  return {
    tasks,
    history: [entry],
    historyIndex: 0,
  };
}

export function createTimeTravelState(
  state: TaskStoreState,
  historyIndex: number,
): Partial<TaskStoreState> {
  if (historyIndex === state.historyIndex) {
    return {};
  }

  const historyEntry = getHistoryEntryAtIndex(state.history, historyIndex);

  if (!historyEntry) {
    return {};
  }

  return {
    tasks: cloneTaskRecord(historyEntry.tasks),
    historyIndex,
  };
}
