import {
  AlertTriangle,
  CalendarClock,
  CircleDot,
  Clock3,
  Link2,
  PencilLine,
  Trash2,
} from 'lucide-react';
import type { Task } from '@types';
import { APP_STRINGS, formatTaskDateTime } from '@utils';

type TaskItemProps = {
  depth: number;
  hasChildren: boolean;
  isSelected: boolean;
  onEdit: (taskId: string) => void;
  onRemove: (taskId: string) => void;
  task: Task;
};

function getContainerClasses(task: Task, isSelected: boolean): string {
  const baseClasses =
    'rounded-2xl border bg-white px-4 py-4 shadow-sm transition-colors';

  if (task.status === 'orphaned') {
    return `${baseClasses} border-amber-300 bg-amber-50/80`;
  }

  if (isSelected) {
    return `${baseClasses} border-brand-400 bg-brand-50/70`;
  }

  return `${baseClasses} border-slate-200`;
}

function getStatusLabel(task: Task): string {
  if (task.status === 'orphaned') {
    return APP_STRINGS.orphanedStatusLabel;
  }

  return APP_STRINGS.activeStatusLabel;
}

function getRelationshipLabel(task: Task): string {
  if (task.parentId) {
    return APP_STRINGS.childTaskLabel;
  }

  return APP_STRINGS.rootTaskLabel;
}

export function TaskItem({
  depth,
  hasChildren,
  isSelected,
  onEdit,
  onRemove,
  task,
}: TaskItemProps) {
  const handleEditClick = (): void => {
    onEdit(task.id);
  };

  const handleRemoveClick = (): void => {
    onRemove(task.id);
  };

  return (
    <article className={getContainerClasses(task, isSelected)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {depth > 0 ? (
              <Link2 className="h-4 w-4 text-slate-400" />
            ) : (
              <CircleDot className="h-4 w-4 text-brand-600" />
            )}
            <h3 className="truncate text-base font-semibold text-slate-900">
              {task.title}
            </h3>
            {task.status === 'orphaned' ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5" />
                {getStatusLabel(task)}
              </span>
            ) : null}
            {hasChildren ? (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {APP_STRINGS.childChainLabel}
              </span>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-slate-400" />
              {formatTaskDateTime(task.startAt)}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-slate-400" />
              {formatTaskDateTime(task.endAt)}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              {getRelationshipLabel(task)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label={APP_STRINGS.editActionLabel}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            type="button"
            onClick={handleEditClick}
          >
            <PencilLine className="h-4 w-4" />
          </button>
          <button
            aria-label={APP_STRINGS.removeActionLabel}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
            type="button"
            onClick={handleRemoveClick}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
