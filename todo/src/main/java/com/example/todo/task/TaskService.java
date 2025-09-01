package com.example.todo.task;

import com.example.todo.auth.User;
import com.example.todo.auth.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class TaskService {

    private final TaskRepository repository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    // ✅ Création avec owner auto
    public Task createTask(Task task, String username) {
        User owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        task.setOwner(owner);
        task.getAssignedUsers().add(owner); // auto assignation
        return repository.save(task);
    }

    // ✅ Récupérer uniquement les tâches de l’utilisateur
    public List<Task> getTasksByUser(String username) {
            List<Task> owned = repository.findByOwnerUsername(username);
            List<Task> assigned = repository.findByAssignedUsername(username);

            // éviter les doublons si jamais l’utilisateur est à la fois owner ET assigné
            Set<Task> all = new HashSet<>();
            all.addAll(owned);
            all.addAll(assigned);

            return new ArrayList<>(all);
    }

    public Task update(Task task) {
        return repository.save(task);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Task markAsCompleted(Long id) {
        Task task = repository.findById(id).orElseThrow();
        task.setCompleted(true);
        return repository.save(task);
    }

    public Task assignUser(Long taskId, String username) {
        Task task = repository.findById(taskId).orElseThrow();
        User user = userRepository.findByUsername(username).orElseThrow();
        task.getAssignedUsers().add(user);
        return repository.save(task);
    }

    public Task removeUser(Long taskId, String username) {
    Task task = repository.findById(taskId).orElseThrow();
    User user = userRepository.findByUsername(username).orElseThrow();

    task.getAssignedUsers().remove(user); // ✅ suppression
    return repository.save(task);
}

}
