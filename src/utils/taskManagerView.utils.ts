import { format } from 'date-fns';
import type { Task, TaskId, TaskRecord } from '@types';
import { APP_STRINGS } from '@utils';

export type TaskTreeNode = {
  task: Task;
  children: TaskTreeNode[];
};

function createDateTimeString(
  year: number,
  month: number,
  day: number,
  hours: number,
  minutes: number,
): string {
  return format(
    new Date(year, month, day, hours, minutes),
    "yyyy-MM-dd'T'HH:mm",
  );
}

export function parseDateTime(value: string): Date {
  return new Date(value);
}

export function formatTaskDateTime(value: string): string {
  return format(parseDateTime(value), 'MMM d, yyyy h:mm aa');
}

export function formatHistoryLabel(createdAt: string): string {
  return format(new Date(createdAt), 'MMM d, yyyy h:mm:ss aa');
}

export function createTaskId(): TaskId {
  return crypto.randomUUID();
}

function sortTasks(left: Task, right: Task): number {
  if (left.status !== right.status) {
    return left.status === 'active' ? -1 : 1;
  }

  if (left.startAt !== right.startAt) {
    return left.startAt.localeCompare(right.startAt);
  }

  return left.title.localeCompare(right.title);
}

function buildChildrenByParentId(tasks: TaskRecord): Record<TaskId, Task[]> {
  const childrenByParentId: Record<TaskId, Task[]> = {};

  Object.values(tasks).forEach((task) => {
    if (!task.parentId || !tasks[task.parentId]) {
      return;
    }

    if (!childrenByParentId[task.parentId]) {
      childrenByParentId[task.parentId] = [];
    }

    childrenByParentId[task.parentId].push(task);
  });

  Object.keys(childrenByParentId).forEach((parentId) => {
    childrenByParentId[parentId].sort(sortTasks);
  });

  return childrenByParentId;
}

function createTreeNode(
  task: Task,
  childrenByParentId: Record<TaskId, Task[]>,
): TaskTreeNode {
  const children = (childrenByParentId[task.id] ?? []).map((childTask) =>
    createTreeNode(childTask, childrenByParentId),
  );

  return {
    task,
    children,
  };
}

export function buildTaskTree(tasks: TaskRecord): TaskTreeNode[] {
  const childrenByParentId = buildChildrenByParentId(tasks);
  const rootTasks = Object.values(tasks)
    .filter((task) => !task.parentId || !tasks[task.parentId])
    .sort(sortTasks);

  return rootTasks.map((task) => createTreeNode(task, childrenByParentId));
}

export function collectDescendantIds(
  tasks: TaskRecord,
  parentTaskId: TaskId,
): Set<TaskId> {
  const descendantIds = new Set<TaskId>();
  const pendingTaskIds: TaskId[] = [parentTaskId];

  while (pendingTaskIds.length > 0) {
    const currentTaskId = pendingTaskIds.shift();

    if (!currentTaskId) {
      continue;
    }

    Object.values(tasks).forEach((task) => {
      if (task.parentId !== currentTaskId || descendantIds.has(task.id)) {
        return;
      }

      descendantIds.add(task.id);
      pendingTaskIds.push(task.id);
    });
  }

  return descendantIds;
}

export function createParentOptions(
  tasks: TaskRecord,
  selectedTaskId: TaskId | null,
): Task[] {
  const blockedTaskIds = selectedTaskId
    ? collectDescendantIds(tasks, selectedTaskId)
    : new Set<TaskId>();

  if (selectedTaskId) {
    blockedTaskIds.add(selectedTaskId);
  }

  return Object.values(tasks)
    .filter((task) => !blockedTaskIds.has(task.id))
    .sort(sortTasks);
}

export function createDemoTasks(): Task[] {
  return [
    {
      id: 'task-launch-preparation',
      title: APP_STRINGS.demoParentTaskTitle,
      parentId: null,
      status: 'active',
      startAt: createDateTimeString(2026, 3, 17, 9, 0),
      endAt: createDateTimeString(2026, 3, 17, 11, 0),
    },
    {
      id: 'task-draft-brief',
      title: APP_STRINGS.demoChildTaskTitle,
      parentId: 'task-launch-preparation',
      status: 'active',
      startAt: createDateTimeString(2026, 3, 17, 11, 30),
      endAt: createDateTimeString(2026, 3, 17, 12, 30),
    },
    {
      id: 'task-review-notes',
      title: APP_STRINGS.demoGrandchildTaskTitle,
      parentId: 'task-draft-brief',
      status: 'active',
      startAt: createDateTimeString(2026, 3, 17, 13, 0),
      endAt: createDateTimeString(2026, 3, 17, 14, 0),
    },
    {
      id: 'task-release-planning',
      title: APP_STRINGS.demoSecondRootTaskTitle,
      parentId: null,
      status: 'active',
      startAt: createDateTimeString(2026, 3, 18, 10, 0),
      endAt: createDateTimeString(2026, 3, 18, 11, 30),
    },
  ];
}
