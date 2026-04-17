import { useEffect, useState } from 'react';
import type { Task, TaskId } from '@types';
import {
  HistorySliderDock,
  TaskFormPanel,
  TaskList,
  TaskToolbar,
} from '@components';
import { useTaskManagerStore } from '@store';
import { APP_STRINGS, createDemoTasks } from '@utils';

function getSelectedTaskLabel(
  selectedTaskId: TaskId | null,
  tasks: Record<TaskId, Task>,
): string {
  if (!selectedTaskId) {
    return APP_STRINGS.noTaskSelectedLabel;
  }

  const selectedTask = tasks[selectedTaskId];

  if (!selectedTask) {
    return APP_STRINGS.noTaskSelectedLabel;
  }

  return `${APP_STRINGS.editingTaskPrefix}: ${selectedTask.title}`;
}

export function TaskManagerView() {
  const tasks = useTaskManagerStore((state) => state.tasks);
  const history = useTaskManagerStore((state) => state.history);
  const historyIndex = useTaskManagerStore((state) => state.historyIndex);
  const addTask = useTaskManagerStore((state) => state.addTask);
  const removeTask = useTaskManagerStore((state) => state.removeTask);
  const seedDemo = useTaskManagerStore((state) => state.seedDemo);
  const timeTravelTo = useTaskManagerStore((state) => state.timeTravelTo);
  const updateTask = useTaskManagerStore((state) => state.updateTask);

  const [selectedTaskId, setSelectedTaskId] = useState<TaskId | null>(null);

  useEffect(() => {
    if (history.length > 0) {
      return;
    }

    seedDemo({
      tasks: createDemoTasks(),
    });
  }, [history.length, seedDemo]);

  useEffect(() => {
    if (!selectedTaskId || tasks[selectedTaskId]) {
      return;
    }

    setSelectedTaskId(null);
  }, [selectedTaskId, tasks]);

  const handleCreateTask = (task: Task): void => {
    addTask(task);
  };

  const handleUpdateTask = (taskId: TaskId, changes: Partial<Task>): void => {
    updateTask({
      id: taskId,
      changes,
    });
  };

  const handleRemoveTask = (taskId: TaskId): void => {
    removeTask({
      id: taskId,
    });

    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
  };

  const handleEditTask = (taskId: TaskId): void => {
    setSelectedTaskId(taskId);
  };

  const handleClearSelection = (): void => {
    setSelectedTaskId(null);
  };

  const handleCommitHistoryIndex = (nextHistoryIndex: number): void => {
    timeTravelTo(nextHistoryIndex);
  };

  const taskCount = Object.keys(tasks).length;
  const snapshotCount = history.length;
  const selectedTaskLabel = getSelectedTaskLabel(selectedTaskId, tasks);

  return (
    <main className="min-h-screen px-4 py-6 pb-40 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <TaskToolbar
          historyIndex={historyIndex}
          selectedTaskLabel={selectedTaskLabel}
          snapshotCount={snapshotCount}
          taskCount={taskCount}
          onClearSelection={handleClearSelection}
        />

        <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <TaskFormPanel
            selectedTaskId={selectedTaskId}
            tasks={tasks}
            onCancelEdit={handleClearSelection}
            onCreateTask={handleCreateTask}
            onUpdateTask={handleUpdateTask}
          />

          <TaskList
            selectedTaskId={selectedTaskId}
            tasks={tasks}
            onEditTask={handleEditTask}
            onRemoveTask={handleRemoveTask}
          />
        </section>
      </div>

      <HistorySliderDock
        history={history}
        historyIndex={historyIndex}
        onCommitHistoryIndex={handleCommitHistoryIndex}
      />
    </main>
  );
}
