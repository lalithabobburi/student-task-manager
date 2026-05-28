import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task, TaskStats } from '../../models/task.model';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TaskFormComponent],
  templateUrl: './task-dashboard.component.html',
  styleUrls: ['./task-dashboard.component.css']
})
export class TaskDashboardComponent implements OnInit {

  stats: TaskStats = { total: 0, pending: 0, inProgress: 0, completed: 0, overdue: 0, dueToday: 0 };
  dueTodayTasks: Task[] = [];
  recentTasks: Task[] = [];
  showForm = false;
  loading = true;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.taskService.getStats().subscribe({
      next: (s) => { this.stats = s; this.loading = false; },
      error: () => { this.loading = false; }
    });

    this.taskService.getDueToday().subscribe({ next: (t) => this.dueTodayTasks = t });

    this.taskService.getAll().subscribe({
      next: (tasks) => {
        this.recentTasks = tasks
          .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
          .slice(0, 5);
      }
    });
  }

  onTaskSaved(): void {
    this.showForm = false;
    this.loadData();
  }
}
