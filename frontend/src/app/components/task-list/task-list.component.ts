import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task, TaskStatus, TaskPriority } from '../../models/task.model';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskFormComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  tasks: Task[] = [];
  filtered: Task[] = [];
  loading = true;
  error = '';

  // Editing / Creating
  showForm = false;
  editingTask: Task | null = null;

  // Delete confirm
  deletingId: number | null = null;

  // Filters
  searchKeyword = '';
  filterStatus: string = '';
  filterPriority: string = '';

  statusOptions: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE'];
  priorityOptions: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getAll().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load tasks. Make sure the backend is running.';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filtered = this.tasks.filter(t => {
      const matchSearch = !this.searchKeyword ||
        t.title.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        t.subject.toLowerCase().includes(this.searchKeyword.toLowerCase());
      const matchStatus   = !this.filterStatus   || t.status   === this.filterStatus;
      const matchPriority = !this.filterPriority || t.priority === this.filterPriority;
      return matchSearch && matchStatus && matchPriority;
    });
  }

  openCreate(): void {
    this.editingTask = null;
    this.showForm = true;
  }

  openEdit(task: Task): void {
    this.editingTask = { ...task };
    this.showForm = true;
  }

  confirmDelete(id: number): void {
    this.deletingId = id;
  }

  deleteTask(): void {
    if (this.deletingId === null) return;
    this.taskService.delete(this.deletingId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== this.deletingId);
        this.applyFilters();
        this.deletingId = null;
      }
    });
  }

  onTaskSaved(): void {
    this.showForm = false;
    this.editingTask = null;
    this.loadTasks();
  }

  clearFilters(): void {
    this.searchKeyword = '';
    this.filterStatus = '';
    this.filterPriority = '';
    this.applyFilters();
  }
}
