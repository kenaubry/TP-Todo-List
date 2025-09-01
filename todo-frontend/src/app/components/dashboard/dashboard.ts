import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service'; // ✅ service admin

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class DashboardComponent implements OnInit {

  /* ===================== TÂCHES ===================== */
  tasks: any[] = [];
  newTask: any = { title: '', description: '', dueDate: '', project: null };
  filter: string = 'all';        // filtre actif (all, today, done, project)
  selectedTask: any = null;      // tâche sélectionnée (colonne de droite)

  // Ajout fluide (étape 1 = titre, étape 2 = détails)
  newTaskTitle: string = '';
  step: number = 1;

  /* ===================== UTILISATEURS (ADMIN) ===================== */
  users: any[] = [];               // liste des utilisateurs
  showUsers = false;               // mode affichage "utilisateurs"
  selectedUser: any = null;        // utilisateur sélectionné
  userTasks: any[] = [];           // tâches de l’utilisateur sélectionné
  selectedUserTask: any = null;    // tâche précise de cet utilisateur

  /* ===================== SIDEBAR ===================== */
  isSidebarOpen: boolean = true;   // état du menu

  /* ===================== CONSTRUCTEUR ===================== */
  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router
  ) {}

  /* ===================== INIT ===================== */
  ngOnInit(): void {
    this.loadTasks();

    // Si l’utilisateur est admin → on charge la liste des utilisateurs
    if (this.role === 'ADMIN') {
      this.adminService.getAllUsers().subscribe(data => this.users = data);
    }
  }

  /* ===================== SIDEBAR ===================== */
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  /* ===================== ADMIN : GESTION UTILISATEURS ===================== */
  toggleUsers() {
    this.showUsers = !this.showUsers;
    if (this.showUsers) {
      this.adminService.getAllUsers().subscribe(data => this.users = data);
    }
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.selectedUserTask = null; // reset sélection tâche
    this.adminService.getUserTasks(user.username).subscribe(tasks => this.userTasks = tasks);
  }

  selectUserTask(task: any) {
    this.selectedUserTask = task;
  }

  /* ===================== TÂCHES : CRUD ===================== */
  updateTask() {
    if (!this.selectedTask) return;
    this.taskService.updateTask(this.selectedTask.id, this.selectedTask).subscribe(() => {
      this.loadTasks();
    });
  }

  completeTask(id: number) {
    this.taskService.completeTask(id).subscribe(() => this.loadTasks());
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe(() => {
      this.selectedTask = null;
      this.loadTasks();
    });
  }

  /* ===================== AUTH ===================== */
  get role(): string | null {
    return this.authService.getRole();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /* ===================== LISTE DES TÂCHES ===================== */
  loadTasks() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.loadProjects(); // on recharge les projets depuis les tâches
    });
  }

  get filteredTasks() {
    const today = new Date().toISOString().split('T')[0];
    switch (this.filter) {
      case 'today':
        return this.tasks.filter(t => t.dueDate?.startsWith(today));
      case 'project':
        return this.tasks.filter(t => t.project === this.filterProject);
      case 'done':
        return this.tasks.filter(t => t.completed);
      case 'all':
      default:
        return this.tasks;
    }
  }

  // Compteurs (pour les badges)
  get totalTasks(): number { return this.tasks.length; }
  get todayTasks(): number {
    const today = new Date().toISOString().split('T')[0];
    return this.tasks.filter(t => t.dueDate?.startsWith(today)).length;
  }
  get doneTasks(): number {
    return this.tasks.filter(t => t.completed).length;
  }

  // Sélectionner une tâche
  selectTask(task: any) {
    this.selectedTask = task;
  }

  /* ===================== AJOUT DE TÂCHE (workflow fluide) ===================== */
  addTaskStep1() {
    if (this.newTaskTitle.trim()) {
      this.newTask.title = this.newTaskTitle.trim();
      this.step = 2;
    }
  }

  confirmAddTask() {
    if (!this.newTask.dueDate) {
      this.newTask.dueDate = new Date().toISOString().split('T')[0]; // date par défaut
    }
    if (this.filter === 'project' && this.filterProject) {
      this.newTask.project = this.filterProject; // associe au projet courant
    }

    this.taskService.createTask(this.newTask).subscribe(() => {
      // reset
      this.newTask = { title: '', description: '', dueDate: '', project: null };
      this.newTaskTitle = '';
      this.step = 1;
      this.loadTasks();
    });
  }

  /* ===================== GESTION UTILISATEURS (ADMIN) ===================== */
  newUser = { username: '', password: '', role: 'USER' };
  showAddUser = false;

  get totalUsers(): number {
    return this.users.length;
  }

  addUser() {
    if (!this.newUser.username.trim() || !this.newUser.password.trim()) return;
    this.adminService.createUser(this.newUser).subscribe(() => {
      this.newUser = { username: '', password: '', role: 'USER' };
      this.showAddUser = false;
      this.adminService.getAllUsers().subscribe(data => this.users = data); // reload
    });
  }

  /* ===================== PROJETS ===================== */
  projects: string[] = [];
  newProject: string = '';
  filterProject: string | null = null;

  loadProjects() {
    this.projects = [...new Set(this.tasks.map(t => t.project).filter(Boolean))];
  }

  filterByProject(p: string) {
    this.filterProject = p;
    this.showUsers = false;
    this.filter = 'project';
  }

  countTasksByProject(p: string): number {
    return this.tasks.filter(t => t.project === p).length;
  }

  addProject() {
    if (this.newProject.trim() && !this.projects.includes(this.newProject.trim())) {
      this.projects.push(this.newProject.trim());
      this.newProject = '';
    }
  }

  getProjectColor(project: string): string {
    const colors = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#6A4C93", "#1A535C"];
    let hash = 0;
    for (let i = 0; i < project.length; i++) {
      hash = project.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  /* ===================== ASSIGNATION DES UTILISATEURS ===================== */
  showAssignDropdown: boolean = false;
  userSearch: string = '';

  assignUser(username: string) {
    if (!username) return;
    this.taskService.assignUser(this.selectedTask.id, username).subscribe(task => {
      this.selectedTask = task; // refresh
    });
  }

  assignUserToTask(taskId: number, username: string) {
    this.taskService.assignUser(taskId, username).subscribe(updatedTask => {
      this.selectedTask = updatedTask; // refresh la tâche en détail
      this.loadTasks();                // recharge la liste
      this.showAssignDropdown = false;
    });
  }

  get filteredUsers() {
    if (!this.userSearch.trim()) return [];
    return this.users.filter(u =>
      u.username.toLowerCase().includes(this.userSearch.toLowerCase())
    );
  }

  removeUserFromTask(taskId: number, username: string) {
    this.taskService.removeUser(taskId, username).subscribe(task => {
      this.selectedTask = task; // refresh
    });
  }
}
