package com.example.todo.task;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByOwnerUsername(String username);

    @Query("SELECT t FROM Task t JOIN t.assignedUsers u WHERE u.username = :username")
    List<Task> findByAssignedUsername(@Param("username") String username);
}

