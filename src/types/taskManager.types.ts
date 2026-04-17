export type TaskId = string;

export type TaskStatus = 'active' | 'orphaned';

export type Task = {
  id: TaskId;
  title: string;
  startDateTime: string;
  endDateTime: string;
  parentId: TaskId | null;
  status: TaskStatus;
};

export type TaskRecord = Record<TaskId, Task>;

export type TaskHistorySnapshot = {
  tasks: TaskRecord;
  createdAt: string;
};

export type TaskManagerState = {
  tasks: TaskRecord;
  history: TaskHistorySnapshot[];
  historyIndex: number;
};

export type TaskManagerActionName =
  | 'createTask'
  | 'updateTaskTitle'
  | 'updateTaskSchedule'
  | 'removeTask'
  | 'undo'
  | 'redo';
