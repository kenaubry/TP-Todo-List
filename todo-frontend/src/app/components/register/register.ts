import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  standalone: true,                               // ✅ composant standalone
  styleUrls: ['./register.css'],                  // ✅ CSS local
  imports: [CommonModule, FormsModule, RouterModule], // ✅ directives Angular
})
export class RegisterComponent {

  /* ===================== FORMULAIRES ===================== */
  username: string = '';   // champ identifiant
  password: string = '';   // champ mot de passe
  message: string = '';    // message de confirmation ou d’erreur

  /* ===================== CONSTRUCTEUR ===================== */
  constructor(
    private authService: AuthService,  // service d’authentification
    private router: Router             // navigation après inscription
  ) {}

  /* ===================== MÉTHODES ===================== */
  // Inscription d’un nouvel utilisateur
  register() {
    this.authService.register({ username: this.username, password: this.password })
      .subscribe({
        // ✅ si succès → afficher message puis rediriger vers login
        next: () => {
          this.message = 'Compte créé avec succès !';
          setTimeout(() => this.router.navigate(['/login']), 1000);
        },
        // ❌ si erreur → afficher message d’erreur
        error: () => {
          this.message = 'Erreur lors de l’inscription';
        }
      });
  }
}
