import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root' // ✅ service dispo partout dans l’app
})
export class AuthService {

  /* ===================== CONFIG ===================== */
  private apiUrl = 'http://localhost:8080/api/auth'; // URL du backend (authentification)
  private jwtHelper = new JwtHelperService();        // utilitaire pour décoder le token JWT

  /* ===================== CONSTRUCTEUR ===================== */
  constructor(private http: HttpClient) {}

  /* ===================== MÉTHODES API ===================== */

  // 🔹 Inscription d’un nouvel utilisateur
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  // 🔹 Connexion (retourne un token JWT en texte brut)
  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user, { responseType: 'text' });
  }

  /* ===================== GESTION DU TOKEN ===================== */

  // 🔹 Sauvegarder le token JWT dans le localStorage
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  // 🔹 Récupérer le token depuis le localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // 🔹 Supprimer le token (déconnexion)
  logout() {
    localStorage.removeItem('token');
  }

  // 🔹 Extraire le rôle depuis le JWT décodé
  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded?.role || null;
  }
}
