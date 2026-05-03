# DevPulse — IT Task Tracker

A client-side project management dashboard for developers to track technical tasks, bug fixes, and feature requests. Built with React, TypeScript, and Tailwind CSS v4.

## Live Demo

> Deployed at: ``

## Description

DevPulse is a "Jira-lite" task board designed for developers working on sprints. It uses a priority-first workflow where Critical bugs surface immediately, and progress is tracked with a daily Productivity Streak. All data is persisted via `localStorage` — zero backend, zero latency.

The app uses a VS Code-inspired dark theme and a GitHub-style light theme to feel native to the developer workflow.

## App Flows

### Creating a Task
1. Navigate to the **Tasks** page (or press `N` anywhere)
2. Click **New Task**
3. Fill in the title, optional description, **Type** (Bug / Feature / DevOps / Research / Design), **Priority** (Critical → Low), and **Status**
4. Submit — the task appears immediately, sorted by priority

### Managing Task Status
- On the **Dashboard**: click the circle on any sprint row to toggle Done
- On the **Tasks** page: click the circle icon on any TaskCard
- Completed tasks show a strikethrough and are dimmed
- Clicking again reopens the task (resets `completedAt`)

### Watching Tasks
- Click the **eye icon** on a TaskCard to watch/unwatch it
- Watched open tasks appear in the **Watching** panel on the Dashboard
- Filter by Watched using the status filter on the Tasks page

### Filtering & Searching
- Search bar: finds tasks by title or description (250ms debounce)
- **Status tabs**: All / Todo / In Progress / Done / Watched
- **Type pills**: All / Bug / Feature / DevOps / Research / Design
- **Priority pills**: All / Critical / High / Medium / Low
- All filters can be combined

### Editing / Deleting
- Click the pencil icon to edit a task (type, priority, status, title, description)
- Click the trash icon to delete (with confirmation dialog)
- Double-click any sprint row on the Dashboard to edit

### Viewing Analytics
- Navigate to the **Stats** page
- Summary cards: total tasks, completed, done today, streak, completion rate, active
- **Weekly Velocity** bar chart: tasks completed per day for the last 7 days
- **By Type** and **Open by Priority** breakdown charts
- Full task table

### Productivity Streak
- Counts consecutive days with at least one task completed
- Streak stays alive if you completed something today **or** yesterday
- Displayed as `Xd` on the Dashboard and Stats page

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 (utility + CSS custom properties) |
| Icons | Lucide React |
| Date logic | date-fns |
| State | `useReducer` + `useContext` |
| Persistence | `localStorage` (tasks + theme) |
| Deployment | GitHub Pages via `gh-pages` |

## State Architecture

- `StoreProvider` wraps the entire app, exposing `tasks` and `filter` via context
- `useLocalStorage<T>` hook syncs state to localStorage on every change
- `filter` is intentionally **not** persisted — resets on page load
- Velocity, streak, and completion stats are **derived at render time** from `tasks[]`

## Running Locally

```bash
npm install
npm run dev
```

## Deploying

```bash
npm run deploy
```

## Project Structure

```
src/
├── types.ts                    # Task, FilterState, TaskType, Priority, TaskStatus
├── context/
│   └── StoreContext.tsx        # Global state, theme, toasts
├── hooks/
│   └── useLocalStorage.ts      # Persistent state hook
├── lib/
│   ├── taskMeta.ts             # Type/priority colors and labels
│   └── velocity.ts             # Streak and velocity calculations
├── components/
│   ├── Header.tsx              # Nav tabs + theme toggle + data export
│   ├── DataPanel.tsx           # Export/Import JSON
│   ├── shared/                 # Badge, Button, Modal, ProgressRing, Toast, EmptyState
│   └── tasks/                  # TaskCard, TaskForm, AddTaskModal, EditTaskModal
└── pages/
    ├── DashboardPage.tsx        # Sprint overview + watched + critical issues
    ├── TasksPage.tsx            # Full CRUD + multi-filter + search
    └── StatsPage.tsx            # Velocity chart + type/priority breakdown + table
```

## Features

- Create / edit / delete tasks with type, priority, and status
- Mark tasks as Done / reopen with a single click
- Watch tasks to monitor them from the Dashboard
- Filter by type, priority, status, and free-text search
- VS Code-inspired dark theme / GitHub-style light theme (persisted)
- Productivity Streak: consecutive days with at least one task completed
- Weekly Velocity bar chart (last 7 days)
- Critical issue panel on Dashboard (auto-surfaces Critical open tasks)
- Keyboard shortcut `N` to add a new task
- Toast notifications for all mutations
- Accessible modals with Escape to close
- Export / Import JSON for data backup
- Fully client-side, no server required

## Deployed on

https://github.com/sabinapopescu/tum-web-lab6/deployments/github-pages