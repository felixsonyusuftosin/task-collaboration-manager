import { CalendarRange, History, ListChecks } from 'lucide-react';
import { APP_STRINGS } from '@utils';

type TaskToolbarProps = {
  historyIndex: number;
  onClearSelection: () => void;
  selectedTaskLabel: string;
  snapshotCount: number;
  taskCount: number;
};

export function TaskToolbar({
  historyIndex,
  onClearSelection,
  selectedTaskLabel,
  snapshotCount,
  taskCount,
}: TaskToolbarProps) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-5 shadow-panel">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
            <CalendarRange className="h-3.5 w-3.5" />
            {APP_STRINGS.toolbarBadge}
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-slate-950">
              {APP_STRINGS.applicationTitle}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              {APP_STRINGS.applicationSubtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
                <ListChecks className="h-3.5 w-3.5" />
                {APP_STRINGS.toolbarTaskCount}
              </div>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {taskCount}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
                <History className="h-3.5 w-3.5" />
                {APP_STRINGS.toolbarSnapshotCount}
              </div>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {snapshotCount}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium text-slate-500">
                {APP_STRINGS.toolbarCurrentStep}
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {historyIndex < 0 ? 0 : historyIndex + 1}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
              {selectedTaskLabel}
            </span>
            <button
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              type="button"
              onClick={onClearSelection}
            >
              {APP_STRINGS.toolbarResetSelection}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
