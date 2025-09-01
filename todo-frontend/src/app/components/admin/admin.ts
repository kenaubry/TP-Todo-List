import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = null;
  tasks: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (users) => (this.users = users),
      error: (err) => console.error('Erreur chargement utilisateurs', err),
    });
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.adminService.getUserTasks(user.username).subscribe({
      next: (tasks) => (this.tasks = tasks),
      error: (err) => console.error('Erreur chargement tâches', err),
    });
  }
}
