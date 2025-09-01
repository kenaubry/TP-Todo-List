import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root' // ✅ disponible globalement
})
export class TaskService {

  /* ===================== CONFIG ===================== */
  private apiUrl = 'http://localhost:8080/api/tasks'; // endpoint backend des tâches

  /* ===================== CONSTRUCTEUR ===================== */
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /* ===================== UTILS ===================== */

  // 🔹 Ajoute le token JWT aux headers
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /* ===================== MÉTHODES CRUD TÂCHES ===================== */

  // 🔹 Récupérer toutes les tâches de l’utilisateur connecté
  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // 🔹 Créer une nouvelle tâche
  createTask(task: any): Observable<any> {
    return this.http.post(this.apiUrl, task, { headers: this.getAuthHeaders() });
  }

  // 🔹 Mettre à jour une tâche
  updateTask(id: number, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, task, { headers: this.getAuthHeaders() });
  }

  // 🔹 Marquer une tâche comme complétée
  completeTask(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/complete`, {}, { headers: this.getAuthHeaders() });
  }

  // 🔹 Supprimer une tâche
  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  /* ===================== GESTION DES MEMBRES ===================== */

  // 🔹 Assigner un utilisateur à une tâche
  assignUser(taskId: number, username: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${taskId}/assign`,
      { username },
      { headers: this.getAuthHeaders() }
    );
  }

  // 🔹 Retirer un utilisateur d’une tâche
  removeUser(taskId: number, username: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${taskId}/remove`,
      { username },
      { headers: this.getAuthHeaders() }
    );
  }
}
