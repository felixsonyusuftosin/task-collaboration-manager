import { create } from 'zustand';
import type { TaskStoreState } from '@types';
import {
  createTaskStoreActions,
  type TaskStoreActions,
} from '@store/taskManager.actions';
import { createInitialTaskStoreState } from '@store/taskManager.utils';

export type TaskStore = TaskStoreState & TaskStoreActions;

export const useTaskManagerStore = create<TaskStore>()(() => ({
  ...createInitialTaskStoreState(),
  ...createTaskStoreActions(),
}));
