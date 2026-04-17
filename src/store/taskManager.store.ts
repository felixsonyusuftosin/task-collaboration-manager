import { create } from 'zustand';
import type { TaskManagerState } from '@types';
import {
  createTaskManagerActions,
  type TaskManagerActions,
} from '@store/taskManager.actions';
import { createInitialHistoryState } from '@store/taskManager.utils';

export type TaskManagerStore = TaskManagerState & TaskManagerActions;

export const useTaskManagerStore = create<TaskManagerStore>()(() => ({
  ...createInitialHistoryState(),
  ...createTaskManagerActions(),
}));
