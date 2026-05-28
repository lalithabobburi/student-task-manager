package com.taskmanager.service;

import com.taskmanager.model.Task;
import com.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    // ─── CRUD ────────────────────────────────────────────────────────────────

    public List<Task> getAllTasks() {
        List<Task> tasks = taskRepository.findAll();
        markOverdueTasks(tasks);
        return tasks;
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Task createTask(Task task) {
        if (task.getDeadline().isBefore(LocalDate.now())) {
            task.setStatus(Task.TaskStatus.OVERDUE);
        }
        return taskRepository.save(task);
    }

    public Optional<Task> updateTask(Long id, Task updatedTask) {
        return taskRepository.findById(id).map(existing -> {
            existing.setTitle(updatedTask.getTitle());
            existing.setDescription(updatedTask.getDescription());
            existing.setSubject(updatedTask.getSubject());
            existing.setDeadline(updatedTask.getDeadline());
            existing.setStatus(updatedTask.getStatus());
            existing.setPriority(updatedTask.getPriority());
            return taskRepository.save(existing);
        });
    }

    public boolean deleteTask(Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // ─── Filters ─────────────────────────────────────────────────────────────

    public List<Task> getTasksByStatus(Task.TaskStatus status) {
        return taskRepository.findByStatus(status);
    }

    public List<Task> getTasksByPriority(Task.TaskPriority priority) {
        return taskRepository.findByPriority(priority);
    }

    public List<Task> getTasksBySubject(String subject) {
        return taskRepository.findBySubjectIgnoreCase(subject);
    }

    public List<Task> searchTasks(String keyword) {
        return taskRepository.searchByTitle(keyword);
    }

    public List<Task> getTasksDueToday() {
        return taskRepository.findByDeadline(LocalDate.now());
    }

    // ─── Dashboard Stats ─────────────────────────────────────────────────────

    public Map<String, Long> getDashboardStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", taskRepository.count());
        stats.put("pending", taskRepository.countByStatus(Task.TaskStatus.PENDING));
        stats.put("inProgress", taskRepository.countByStatus(Task.TaskStatus.IN_PROGRESS));
        stats.put("completed", taskRepository.countByStatus(Task.TaskStatus.COMPLETED));
        stats.put("overdue", taskRepository.countByStatus(Task.TaskStatus.OVERDUE));
        stats.put("dueToday", (long) taskRepository.findByDeadline(LocalDate.now()).size());
        return stats;
    }

    // ─── Helper ──────────────────────────────────────────────────────────────

    private void markOverdueTasks(List<Task> tasks) {
        LocalDate today = LocalDate.now();
        tasks.forEach(task -> {
            if (task.getDeadline().isBefore(today)
                    && task.getStatus() != Task.TaskStatus.COMPLETED
                    && task.getStatus() != Task.TaskStatus.OVERDUE) {
                task.setStatus(Task.TaskStatus.OVERDUE);
                taskRepository.save(task);
            }
        });
    }
}
