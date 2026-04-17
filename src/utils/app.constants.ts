export const APP_STRINGS = {
  applicationTitle: 'Task Timeline Manager',
  applicationSubtitle:
    'Shell-first interview scaffold for task planning architecture.',
  currentStateTitle: 'State Shell',
  historyTitle: 'History Shell',
  notesTitle: 'Architecture Notes',
  emptyStateLabel: 'No implementation has been added yet.',
  architectureNotes: [
    'tasks will hold the current live state.',
    'history will hold full immutable snapshots.',
    'historyIndex will point to the active snapshot for time travel.',
    'Temporal cascade logic will be added only when requested.',
  ],
} as const;
