import { History, ListTree, TimerReset } from 'lucide-react';
import { TaskItem } from '@components';
import { useTaskManagerStore } from '@store';
import { APP_STRINGS } from '@utils';

export function TaskManagerView() {
  const taskCount = useTaskManagerStore(
    (state) => Object.keys(state.tasks).length,
  );
  const snapshotCount = useTaskManagerStore((state) => state.history.length);
  const historyIndex = useTaskManagerStore((state) => state.historyIndex);

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white/85 p-8 shadow-panel backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-700">
                Interview Scaffold
              </p>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">
                  {APP_STRINGS.applicationTitle}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  {APP_STRINGS.applicationSubtitle}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-brand-50 p-4">
                <ListTree className="h-5 w-5 text-brand-700" />
                <p className="mt-3 text-sm font-medium text-slate-900">
                  Parent-child tasks
                </p>
              </div>
              <div className="rounded-2xl bg-brand-50 p-4">
                <TimerReset className="h-5 w-5 text-brand-700" />
                <p className="mt-3 text-sm font-medium text-slate-900">
                  Temporal shifts
                </p>
              </div>
              <div className="rounded-2xl bg-brand-50 p-4">
                <History className="h-5 w-5 text-brand-700" />
                <p className="mt-3 text-sm font-medium text-slate-900">
                  Snapshot history
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                {APP_STRINGS.currentStateTitle}
              </h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                Shell only
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <TaskItem label="Task Count" value={String(taskCount)} />
              <TaskItem label="Selected Action" value="Not implemented" />
            </div>

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-6 text-sm text-slate-500">
              {APP_STRINGS.emptyStateLabel}
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-panel">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">
                  {APP_STRINGS.historyTitle}
                </h2>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                  Index {historyIndex < 0 ? 'None' : historyIndex}
                </span>
              </div>

              <div className="mt-5 grid gap-4">
                <TaskItem
                  label="Snapshot Count"
                  value={String(snapshotCount)}
                />
                <TaskItem label="Undo / Redo" value="Not implemented" />
              </div>
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-panel">
              <h2 className="text-xl font-semibold text-slate-900">
                {APP_STRINGS.notesTitle}
              </h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                {APP_STRINGS.architectureNotes.map((note) => (
                  <li key={note} className="rounded-2xl bg-slate-50 px-4 py-3">
                    {note}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
