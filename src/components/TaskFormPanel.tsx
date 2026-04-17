import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import DatePicker from 'react-datepicker';
import type { Task, TaskId, TaskRecord } from '@types';
import {
  APP_STRINGS,
  createParentOptions,
  createTaskId,
  parseDateTime,
} from '@utils';

type TaskFormPanelProps = {
  onCancelEdit: () => void;
  onCreateTask: (task: Task) => void;
  onUpdateTask: (taskId: TaskId, task: Partial<Task>) => void;
  selectedTaskId: TaskId | null;
  tasks: TaskRecord;
};

type TaskFormState = {
  title: string;
  startAt: Date | null;
  endAt: Date | null;
  parentId: string;
};

function createEmptyTaskFormState(): TaskFormState {
  return {
    title: '',
    startAt: null,
    endAt: null,
    parentId: '',
  };
}

function createTaskFormState(task: Task | null): TaskFormState {
  if (!task) {
    return createEmptyTaskFormState();
  }

  return {
    title: task.title,
    startAt: parseDateTime(task.startAt),
    endAt: parseDateTime(task.endAt),
    parentId: task.parentId ?? '',
  };
}

function formatDateTimeForStore(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  const hours = String(value.getHours()).padStart(2, '0');
  const minutes = String(value.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function getNormalizedParentId(parentId: string): TaskId | null {
  if (!parentId) {
    return null;
  }

  return parentId;
}

function getNormalizedStatus(
  task: Task | null,
  parentId: TaskId | null,
): Task['status'] {
  if (parentId) {
    return 'active';
  }

  if (task?.status === 'orphaned') {
    return 'orphaned';
  }

  return 'active';
}

function getSubmitLabel(selectedTaskId: TaskId | null): string {
  if (selectedTaskId) {
    return APP_STRINGS.formSubmitUpdate;
  }

  return APP_STRINGS.formSubmitCreate;
}

function getPanelTitle(selectedTaskId: TaskId | null): string {
  if (selectedTaskId) {
    return APP_STRINGS.formUpdateTitle;
  }

  return APP_STRINGS.formCreateTitle;
}

export function TaskFormPanel({
  onCancelEdit,
  onCreateTask,
  onUpdateTask,
  selectedTaskId,
  tasks,
}: TaskFormPanelProps) {
  const selectedTask = selectedTaskId ? (tasks[selectedTaskId] ?? null) : null;
  const [formState, setFormState] = useState<TaskFormState>(() =>
    createTaskFormState(selectedTask),
  );

  useEffect(() => {
    setFormState(createTaskFormState(selectedTask));
  }, [selectedTask]);

  const parentOptions = createParentOptions(tasks, selectedTaskId);
  const hasInvalidRange =
    !!formState.startAt &&
    !!formState.endAt &&
    formState.endAt.getTime() <= formState.startAt.getTime();

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;

    setFormState((currentState) => ({
      ...currentState,
      title: value,
    }));
  };

  const handleStartAtChange = (value: Date | null): void => {
    setFormState((currentState) => ({
      ...currentState,
      startAt: value,
    }));
  };

  const handleEndAtChange = (value: Date | null): void => {
    setFormState((currentState) => ({
      ...currentState,
      endAt: value,
    }));
  };

  const handleParentChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.target;

    setFormState((currentState) => ({
      ...currentState,
      parentId: value,
    }));
  };

  const handleCancelClick = (): void => {
    setFormState(createTaskFormState(null));
    onCancelEdit();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!formState.title.trim() || !formState.startAt || !formState.endAt) {
      return;
    }

    if (formState.endAt.getTime() <= formState.startAt.getTime()) {
      return;
    }

    const normalizedParentId = getNormalizedParentId(formState.parentId);
    const taskPayload: Task = {
      id: selectedTask?.id ?? createTaskId(),
      title: formState.title.trim(),
      parentId: normalizedParentId,
      status: getNormalizedStatus(selectedTask, normalizedParentId),
      startAt: formatDateTimeForStore(formState.startAt),
      endAt: formatDateTimeForStore(formState.endAt),
    };

    if (selectedTask) {
      onUpdateTask(selectedTask.id, {
        title: taskPayload.title,
        parentId: taskPayload.parentId,
        status: taskPayload.status,
        startAt: taskPayload.startAt,
        endAt: taskPayload.endAt,
      });
      return;
    }

    onCreateTask(taskPayload);
    setFormState(createEmptyTaskFormState());
  };

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-panel">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
          {APP_STRINGS.formTitle}
        </p>
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">
            {getPanelTitle(selectedTaskId)}
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {APP_STRINGS.formDescription}
          </p>
        </div>
      </div>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">
            {APP_STRINGS.formTitleLabel}
          </span>
          <input
            required
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:bg-white"
            type="text"
            value={formState.title}
            onChange={handleTitleChange}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">
            {APP_STRINGS.formStartLabel}
          </span>
          <DatePicker
            required
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:bg-white"
            dateFormat="MMM d, yyyy h:mm aa"
            placeholderText={APP_STRINGS.formStartLabel}
            selected={formState.startAt}
            showTimeSelect
            timeIntervals={15}
            onChange={handleStartAtChange}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">
            {APP_STRINGS.formEndLabel}
          </span>
          <DatePicker
            required
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:bg-white"
            dateFormat="MMM d, yyyy h:mm aa"
            placeholderText={APP_STRINGS.formEndLabel}
            selected={formState.endAt}
            showTimeSelect
            timeIntervals={15}
            onChange={handleEndAtChange}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">
            {APP_STRINGS.formParentLabel}
          </span>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-400 focus:bg-white"
            value={formState.parentId}
            onChange={handleParentChange}
          >
            <option value="">{APP_STRINGS.formParentPlaceholder}</option>
            {parentOptions.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>
        </label>

        {hasInvalidRange ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {APP_STRINGS.formInvalidRange}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex items-center justify-center rounded-2xl bg-brand-700 px-4 py-3 text-sm font-medium text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={hasInvalidRange}
            type="submit"
          >
            {getSubmitLabel(selectedTaskId)}
          </button>
          {selectedTaskId ? (
            <button
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              type="button"
              onClick={handleCancelClick}
            >
              {APP_STRINGS.formCancelEdit}
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
