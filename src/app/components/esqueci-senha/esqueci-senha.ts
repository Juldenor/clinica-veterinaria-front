import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-esqueci-senha',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './esqueci-senha.html',
  styleUrls: ['./esqueci-senha.css'] 
})
export class EsqueciSenha {

  email = '';
  mensagem = '';
  erro = false;
  carregando = false; 

  constructor(private authService: Auth) {}

  recuperar() {
    if (!this.email) {
      this.erro = true;
      this.mensagem = 'Digite um e-mail válido.';
      return;
    }
  
    this.carregando = true;
    this.erro = false;
    this.mensagem = '';
  
    this.authService.esqueciSenha(this.email).subscribe({
      next: (resposta: any) => {
        this.carregando = false;
  
        if (resposta && resposta.sucesso === true) {
          this.erro = false;
          this.mensagem = 'E-mail enviado com sucesso!';
        } else {
          this.erro = true;
          this.mensagem = resposta?.mensagem || 'Erro ao processar solicitação.';
        }
      },
      error: (err) => {
        this.carregando = false;
  
        // O Spring Boot está retornando 400 (Bad Request) quando dá erro no Service
        if (err.status === 400 || err.status === 404) {
          this.erro = true;
          // Tenta pegar a mensagem enviada pelo back-end, senão usa a padrão
          this.mensagem = err.error?.mensagem || 'E-mail não encontrado no sistema.';
        } else {
          this.erro = true;
          this.mensagem = 'Erro ao enviar solicitação. Tente novamente mais tarde.';
        }
      }
    });
  }
}