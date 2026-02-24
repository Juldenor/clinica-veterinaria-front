import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Traz o ngStyle e ngIf
import { FormsModule } from '@angular/forms'; // Traz o ngModel
import { RouterModule } from '@angular/router'; // Traz o routerLink para voltar pro login
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-esqueci-senha',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // <-- O SEGREDO ESTÁ AQUI!
  templateUrl: './esqueci-senha.html', // (Ou .component.html, dependendo de como está seu arquivo)
  styleUrl: './esqueci-senha.css' // (Ou .component.css)
})
export class EsqueciSenha {
  email = '';
  mensagem = '';
  erro = false;

  constructor(private authService: Auth) {}

  recuperar() {
    this.mensagem = 'Enviando...';
    this.authService.esqueciSenha(this.email).subscribe({
      next: (resposta) => {
        this.erro = false;
        this.mensagem = resposta;
      },
      error: (err) => {
        this.erro = true;
        this.mensagem = 'Erro ao enviar. Verifique o e-mail digitado.';
      }
    });
  }
}