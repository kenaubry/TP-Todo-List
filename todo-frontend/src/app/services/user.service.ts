import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // ✅ service dispo globalement
})
export class UserService {

  /* ===================== CONFIG ===================== */
  private apiUrl = 'http://localhost:8080/api/auth/users'; // endpoint backend pour les utilisateurs

  /* ===================== CONSTRUCTEUR ===================== */
  constructor(private http: HttpClient) {}

  /* ===================== MÉTHODES ===================== */

  // 🔹 Récupérer tous les utilisateurs
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
