package com.taskmanager.repository;

import com.taskmanager.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Find tasks by status
    List<Task> findByStatus(Task.TaskStatus status);

    // Find tasks by priority
    List<Task> findByPriority(Task.TaskPriority priority);

    // Find tasks by subject
    List<Task> findBySubjectIgnoreCase(String subject);

    // Find tasks due before a date (for overdue detection)
    List<Task> findByDeadlineBefore(LocalDate date);

    // Find tasks due today
    List<Task> findByDeadline(LocalDate date);

    // Search tasks by title keyword
    @Query("SELECT t FROM Task t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Task> searchByTitle(String keyword);

    // Count tasks by status
    long countByStatus(Task.TaskStatus status);
}
