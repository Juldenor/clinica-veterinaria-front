import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // Importação corrigida!
import { CommonModule } from '@angular/common'; // Necessário para o *ngIf
import { FormsModule } from '@angular/forms'; // Necessário para o [(ngModel)]
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true, // Garante que o Angular 17+ vai aceitar os imports abaixo
  imports: [CommonModule, FormsModule, RouterModule], // Colocamos os módulos aqui!
  templateUrl: './login.html', // (Ou './login.component.html' dependendo do nome do seu arquivo)
  styleUrl: './login.css',
})
export class LoginComponent {
  email = '';
  senha = '';
  mensagemErro = '';

  constructor(private authService: Auth, private router: Router) {}

  fazerLogin() {
    this.authService.login(this.email, this.senha).subscribe({
      next: (resposta) => {
        // 1. Salva a "chave" no navegador
        localStorage.setItem('token_clinica', resposta.token);
        
        // 2. Tira o usuário da tela de login e joga pro Painel!
        this.router.navigate(['/painel']); 
      },
      error: (erro) => {
        this.mensagemErro = 'E-mail ou senha incorretos.';
      }
    });
  }
}