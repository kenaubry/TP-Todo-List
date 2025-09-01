import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // ✅ service disponible partout dans l’app
})
export class AdminService {

  /* ===================== CONFIG ===================== */
  private apiUrl = 'http://localhost:8080/api/admin'; // URL du backend pour la partie admin

  /* ===================== CONSTRUCTEUR ===================== */
  constructor(private http: HttpClient) {}

  /* ===================== MÉTHODES API ===================== */

  // 🔹 Récupérer la liste de tous les utilisateurs (ADMIN uniquement)
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  // 🔹 Récupérer toutes les tâches d’un utilisateur donné
  getUserTasks(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/${username}/tasks`);
  }

  // 🔹 Créer un nouvel utilisateur (username, password, rôle)
  createUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user);
  }
}
