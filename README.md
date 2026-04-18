# Task Timeline Manager

Live app: https://fabulous-kelpie-984751.netlify.app/

A small React + TypeScript + Zustand app for managing tasks with parent-child relationships and replaying full snapshot history.

## What It Does

This app lets you:

- create tasks with a title, start time, end time, and optional parent
- build parent-child task trees
- edit existing tasks
- remove tasks
- keep removed parents' children visible as orphaned root tasks
- replay task history with undo, redo, and a snapshot slider
- time travel through committed snapshots

## Core Model

The store keeps three core state values:

- `tasks`: the current live task record
- `history`: full immutable snapshots of task state
- `historyIndex`: the pointer to the active snapshot

This app uses snapshot history, not patch-based undo.

## Dependency Rules

When a parent task is removed:

- direct children stay visible
- each child loses its `parentId`
- each child becomes `orphaned`

When a parent task start time changes:

- the same time delta is cascaded through all descendants
- each descendant keeps its original duration

## Time Travel Behavior

History replay works in two ways:

- `Undo` and `Redo` move through committed snapshots
- the bottom history dock lets you preview a step while dragging and commits time travel when you release

Each mutating action creates a new snapshot.

## Current UX

The current layout is:

- top toolbar
- left task form panel
- main task list
- bottom fixed history dock

The app auto-seeds demo data on first load when history is empty so the timeline and dependency behavior are immediately visible.

## Limitations

This is an interview-style frontend app, not a production system.

Current limitations:

- no backend
- no persistence across reloads
- no authentication or multi-user sync
- no automated tests
- edit flow is simple and intentionally lightweight
- history is stored as full snapshots, which is easier to reason about but less memory-efficient than patch-based history for large datasets

## Tech Stack

- React
- TypeScript
- Zustand
- Tailwind CSS
- Vite
- `react-datepicker`
- `date-fns`
- `lucide-react`

## Project Structure

The project is intentionally small and split by concern:

```text
src/
├── components/
├── store/
├── types/
├── utils/
├── views/
├── index.css
└── main.tsx
```

High-level roles:

- `components/`: UI building blocks
- `store/`: Zustand store and task/history actions
- `types/`: shared TypeScript types
- `utils/`: pure helpers and view/store support utilities
- `views/`: page-level composition

## How To Run

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## Useful Scripts

TypeScript compile check:

```bash
npx tsc -b
```

Lint the project:

```bash
npm run lint
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Format the code:

```bash
npm run format
```

Check formatting:

```bash
npm run format:check
```

## Notes For Review

This codebase prioritizes:

- readability over clever abstractions
- explicit data flow
- well-known data structures
- snapshot-based history for easier reasoning
- small, reviewable modules

If you are reviewing behavior, the main places to look are:

- `src/store/taskManager.actions.ts`
- `src/store/taskManager.utils.ts`
- `src/views/TaskManagerView.tsx`

## What I'd Build Next

- structural sharing or patch-based history to bound memory growth
- IndexedDB persistence so history survives reloads
- multi-user collaboration via CRDT, since the immutable snapshot model maps cleanly to Yjs
- branching history so redo is not lost after a mutation
