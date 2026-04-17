type TaskItemProps = {
  label: string;
  value: string;
};

export function TaskItem({ label, value }: TaskItemProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
        {label}
      </p>
      <p className="mt-3 text-base font-medium text-slate-900">{value}</p>
    </article>
  );
}
