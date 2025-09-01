package com.example.todo.auth;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200") // autoriser Angular local
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    // Inscription d'un nouvel utilisateur
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.save(user);
    }

    // Connexion d'un utilisateur (renvoie un JWT)
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        User existing = userService.findByUsername(user.getUsername());
        if (existing != null && userService.checkPassword(user.getPassword(), existing.getPassword())) {
            return jwtUtil.generateToken(existing.getUsername(), existing.getRole());
        }
        throw new RuntimeException("Identifiants invalides");
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userService.findAll();
    }
}
