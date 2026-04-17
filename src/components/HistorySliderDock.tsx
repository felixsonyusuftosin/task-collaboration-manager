import { useEffect, useState, type ChangeEvent } from 'react';
import { GripHorizontal, History } from 'lucide-react';
import type { HistoryEntry } from '@types';
import { APP_STRINGS, formatHistoryLabel } from '@utils';

type HistorySliderDockProps = {
  history: HistoryEntry[];
  historyIndex: number;
  onCommitHistoryIndex: (historyIndex: number) => void;
};

function getSafeHistoryIndex(
  history: HistoryEntry[],
  historyIndex: number,
): number {
  if (history.length === 0) {
    return 0;
  }

  if (historyIndex < 0) {
    return 0;
  }

  if (historyIndex >= history.length) {
    return history.length - 1;
  }

  return historyIndex;
}

function getSnapshotLabel(
  history: HistoryEntry[],
  historyIndex: number,
): string {
  if (history.length === 0) {
    return APP_STRINGS.historyEmptyLabel;
  }

  return formatHistoryLabel(history[historyIndex].createdAt);
}

export function HistorySliderDock({
  history,
  historyIndex,
  onCommitHistoryIndex,
}: HistorySliderDockProps) {
  const safeHistoryIndex = getSafeHistoryIndex(history, historyIndex);
  const [draftHistoryIndex, setDraftHistoryIndex] = useState(safeHistoryIndex);

  useEffect(() => {
    setDraftHistoryIndex(safeHistoryIndex);
  }, [safeHistoryIndex]);

  const handleDraftChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setDraftHistoryIndex(Number(event.target.value));
  };

  const handleCommit = (): void => {
    onCommitHistoryIndex(draftHistoryIndex);
  };

  return (
    <section className="fixed bottom-4 left-1/2 z-20 w-[min(1120px,calc(100vw-2rem))] -translate-x-1/2 rounded-[28px] border border-slate-200 bg-white/95 px-5 py-4 shadow-panel backdrop-blur sm:px-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
              <History className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {APP_STRINGS.historyDockTitle}
              </p>
              <p className="text-xs text-slate-500">
                {APP_STRINGS.historySnapshotLabel}:{' '}
                {getSnapshotLabel(history, draftHistoryIndex)}
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
            <GripHorizontal className="h-3.5 w-3.5" />
            {APP_STRINGS.historyStepLabel}{' '}
            {history.length === 0 ? 0 : draftHistoryIndex + 1} /{' '}
            {history.length}
          </div>
        </div>

        <div>
          <input
            className="h-2.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand-700"
            disabled={history.length <= 1}
            max={Math.max(history.length - 1, 0)}
            min={0}
            step={1}
            type="range"
            value={draftHistoryIndex}
            onChange={handleDraftChange}
            onKeyUp={handleCommit}
            onMouseUp={handleCommit}
            onTouchEnd={handleCommit}
          />
          <div className="mt-3 flex items-center gap-1">
            {history.map((entry, index) => (
              <div
                key={`${entry.createdAt}-${index}`}
                className={`h-2 flex-1 rounded-full ${
                  index <= draftHistoryIndex ? 'bg-brand-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
