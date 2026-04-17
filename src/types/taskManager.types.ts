export type TaskId = string;

export type TaskStatus = 'active' | 'orphaned';

export type Task = {
  id: TaskId;
  title: string;
  parentId: TaskId | null;
  status: TaskStatus;
  startAt: string;
  endAt: string;
};

export type TaskRecord = Record<TaskId, Task>;

export type HistoryEntry = {
  tasks: TaskRecord;
  createdAt: string;
};

export type TaskStoreState = {
  tasks: TaskRecord;
  history: HistoryEntry[];
  historyIndex: number;
};

export type AddTaskInput = Task;

export type UpdateTaskChanges = {
  title?: string;
  parentId?: TaskId | null;
  status?: TaskStatus;
  startAt?: string;
  endAt?: string;
};

export type UpdateTaskInput = {
  id: TaskId;
  changes: UpdateTaskChanges;
};

export type RemoveTaskInput = {
  id: TaskId;
};

export type SeedDemoInput = {
  tasks: Task[];
};
