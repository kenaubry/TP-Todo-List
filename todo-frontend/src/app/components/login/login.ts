import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,                         // ✅ composant standalone (Angular moderne)
  imports: [CommonModule, FormsModule, RouterModule], // ✅ directives nécessaires
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  
  /* ===================== FORMULAIRES ===================== */
  username: string = '';   // champ identifiant
  password: string = '';   // champ mot de passe
  error: string = '';      // message d’erreur affiché en cas d’échec

  /* ===================== CONSTRUCTEUR ===================== */
  constructor(
    private authService: AuthService,   // service d’authentification
    private router: Router              // navigation après login
  ) {}

  /* ===================== MÉTHODES ===================== */
  // Connexion de l’utilisateur
  login() {
    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        // ✅ si login ok → on sauvegarde le token et on redirige vers dashboard
        next: (token) => {
          this.authService.saveToken(token);
          this.router.navigate(['/dashboard']);
        },
        // ❌ si erreur → on affiche un message
        error: () => {
          this.error = 'Identifiants invalides';
        }
      });
  }
}
