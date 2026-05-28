import { Routes } from '@angular/router';
import { TaskDashboardComponent } from './components/task-dashboard/task-dashboard.component';
import { TaskListComponent } from './components/task-list/task-list.component';

export const routes: Routes = [
  { path: '',        component: TaskDashboardComponent },
  { path: 'tasks',   component: TaskListComponent },
  { path: '**',      redirectTo: '' }
];
