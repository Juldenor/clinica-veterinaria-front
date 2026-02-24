import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth'; // (Ajuste o caminho se precisar)

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registrar.html', 
  styleUrl: './registrar.css' 
})
export class Registrar {
  email = '';
  senha = '';
  mensagem = '';
  erro = false;

  constructor(private authService: Auth, private router: Router) {}

  criarConta() {
    this.authService.registrar(this.email, this.senha).subscribe({
      next: () => {
        alert('Conta criada com sucesso! Você já pode fazer login.');
        this.router.navigate(['/login']); // Joga o usuário pra tela de login
      },
      error: (err) => {
        this.erro = true;
        this.mensagem = 'Erro ao criar conta. Este e-mail já pode estar em uso.';
      }
    });
  }
}