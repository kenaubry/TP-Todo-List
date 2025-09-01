package com.example.todo.admin;

import com.example.todo.auth.User;
import com.example.todo.auth.UserRepository;
import com.example.todo.task.Task;
import com.example.todo.task.TaskRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final BCryptPasswordEncoder passwordEncoder;


    public AdminController(UserRepository userRepository, TaskRepository taskRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
        this.passwordEncoder = passwordEncoder;
    }
    // 👥 Récupérer tous les utilisateurs (ADMIN uniquement)
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 📋 Récupérer toutes les tâches d'un utilisateur (ADMIN uniquement)
    @GetMapping("/users/{username}/tasks")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Task> getUserTasks(@PathVariable String username) {
        return taskRepository.findByOwnerUsername(username);
    }

    // 👥 Créer un utilisateur (ADMIN uniquement)
    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public User createUser(@RequestBody User user) {
        // encode le mot de passe avant de sauvegarder
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        return userRepository.save(user);
    }

}
