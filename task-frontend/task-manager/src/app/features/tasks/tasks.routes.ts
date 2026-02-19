import { Routes } from '@angular/router';

export const TASKS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./tasks-list/tasks-list.component').then(m => m.TasksListComponent) },
  { path: 'new', loadComponent: () => import('./task-form/task-form.component').then(m => m.TaskFormComponent) },
  { path: ':id/edit', loadComponent: () => import('./task-form/task-form.component').then(m => m.TaskFormComponent) }
];
