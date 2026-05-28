import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskStats, TaskStatus, TaskPriority } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {

  private readonly API = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) {}

  // ─── CRUD ─────────────────────────────────────────────────────────────────

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.API);
  }

  getById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.API}/${id}`);
  }

  create(task: Task): Observable<Task> {
    return this.http.post<Task>(this.API, task);
  }

  update(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.API}/${id}`, task);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  // ─── Filters ──────────────────────────────────────────────────────────────

  getByStatus(status: TaskStatus): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.API}/status/${status}`);
  }

  getByPriority(priority: TaskPriority): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.API}/priority/${priority}`);
  }

  getBySubject(subject: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.API}/subject/${subject}`);
  }

  search(keyword: string): Observable<Task[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<Task[]>(`${this.API}/search`, { params });
  }

  getDueToday(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.API}/due-today`);
  }

  // ─── Stats ────────────────────────────────────────────────────────────────

  getStats(): Observable<TaskStats> {
    return this.http.get<TaskStats>(`${this.API}/stats`);
  }
}
