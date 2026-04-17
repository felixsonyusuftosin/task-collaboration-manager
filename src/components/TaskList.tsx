import { GitBranch, ListTree } from 'lucide-react';
import type { TaskId, TaskRecord } from '@types';
import { APP_STRINGS, buildTaskTree, type TaskTreeNode } from '@utils';
import { TaskItem } from './TaskItem';

type TaskListProps = {
  onEditTask: (taskId: TaskId) => void;
  onRemoveTask: (taskId: TaskId) => void;
  selectedTaskId: TaskId | null;
  tasks: TaskRecord;
};

type TaskTreeBranchProps = {
  depth: number;
  node: TaskTreeNode;
  onEditTask: (taskId: TaskId) => void;
  onRemoveTask: (taskId: TaskId) => void;
  selectedTaskId: TaskId | null;
};

function TaskTreeBranch({
  depth,
  node,
  onEditTask,
  onRemoveTask,
  selectedTaskId,
}: TaskTreeBranchProps) {
  const { children, task } = node;

  return (
    <div className="space-y-3">
      <TaskItem
        depth={depth}
        hasChildren={children.length > 0}
        isSelected={selectedTaskId === task.id}
        task={task}
        onEdit={onEditTask}
        onRemove={onRemoveTask}
      />
      {children.length > 0 ? (
        <div className="ml-4 border-l border-slate-200 pl-5">
          <div className="space-y-3">
            {children.map((childNode) => (
              <TaskTreeBranch
                key={childNode.task.id}
                depth={depth + 1}
                node={childNode}
                onEditTask={onEditTask}
                onRemoveTask={onRemoveTask}
                selectedTaskId={selectedTaskId}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function TaskList({
  onEditTask,
  onRemoveTask,
  selectedTaskId,
  tasks,
}: TaskListProps) {
  const taskTree = buildTaskTree(tasks);

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-panel">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            <ListTree className="h-3.5 w-3.5" />
            {APP_STRINGS.taskListTitle}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">
              {APP_STRINGS.taskListTitle}
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              {APP_STRINGS.taskListDescription}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
          <GitBranch className="h-3.5 w-3.5" />
          {taskTree.length} {APP_STRINGS.rootCountSuffix}
        </div>
      </div>

      <div className="mt-6">
        {taskTree.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-sm text-slate-500">
            {APP_STRINGS.emptyStateLabel}
          </div>
        ) : (
          <div className="space-y-4">
            {taskTree.map((node) => (
              <TaskTreeBranch
                key={node.task.id}
                depth={0}
                node={node}
                onEditTask={onEditTask}
                onRemoveTask={onRemoveTask}
                selectedTaskId={selectedTaskId}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
