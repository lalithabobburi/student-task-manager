package com.taskmanager.controller;

import com.taskmanager.model.Task;
import com.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:4200")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // GET /api/tasks - Get all tasks
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    // GET /api/tasks/{id} - Get task by ID
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/tasks - Create a new task
    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) {
        Task created = taskService.createTask(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // PUT /api/tasks/{id} - Update a task
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id,
                                           @Valid @RequestBody Task task) {
        return taskService.updateTask(id, task)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/tasks/{id} - Delete a task
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        if (taskService.deleteTask(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // GET /api/tasks/status/{status} - Filter by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Task>> getByStatus(@PathVariable Task.TaskStatus status) {
        return ResponseEntity.ok(taskService.getTasksByStatus(status));
    }

    // GET /api/tasks/priority/{priority} - Filter by priority
    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<Task>> getByPriority(@PathVariable Task.TaskPriority priority) {
        return ResponseEntity.ok(taskService.getTasksByPriority(priority));
    }

    // GET /api/tasks/subject/{subject} - Filter by subject
    @GetMapping("/subject/{subject}")
    public ResponseEntity<List<Task>> getBySubject(@PathVariable String subject) {
        return ResponseEntity.ok(taskService.getTasksBySubject(subject));
    }

    // GET /api/tasks/search?keyword=... - Search tasks
    @GetMapping("/search")
    public ResponseEntity<List<Task>> searchTasks(@RequestParam String keyword) {
        return ResponseEntity.ok(taskService.searchTasks(keyword));
    }

    // GET /api/tasks/due-today - Tasks due today
    @GetMapping("/due-today")
    public ResponseEntity<List<Task>> getDueToday() {
        return ResponseEntity.ok(taskService.getTasksDueToday());
    }

    // GET /api/tasks/stats - Dashboard statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(taskService.getDashboardStats());
    }
}
