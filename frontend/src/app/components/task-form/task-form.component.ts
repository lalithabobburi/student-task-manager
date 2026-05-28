import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskStatus, TaskPriority } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {

  @Input() task: Task | null = null;
  @Output() saved     = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form: Task = this.blank();
  submitting = false;
  errorMsg = '';

  statusOptions: TaskStatus[]   = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE'];
  priorityOptions: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    if (this.task) {
      this.form = { ...this.task };
    }
  }

  get isEdit(): boolean {
    return !!this.task?.id;
  }

  submit(): void {
    if (!this.form.title || !this.form.subject || !this.form.deadline) {
      this.errorMsg = 'Please fill in all required fields.';
      return;
    }
    this.submitting = true;
    this.errorMsg = '';

    const obs = this.isEdit
      ? this.taskService.update(this.task!.id!, this.form)
      : this.taskService.create(this.form);

    obs.subscribe({
      next: () => { this.submitting = false; this.saved.emit(); },
      error: () => { this.submitting = false; this.errorMsg = 'Failed to save task. Try again.'; }
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }

  private blank(): Task {
    return {
      title: '',
      description: '',
      subject: '',
      deadline: new Date().toISOString().slice(0, 10),
      status: 'PENDING',
      priority: 'MEDIUM'
    };
  }
}
