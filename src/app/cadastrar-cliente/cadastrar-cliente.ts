import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClienteService } from '../services/cliente';

@Component({
  selector: 'app-cadastrar-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cadastrar-cliente.html'
})
export class CadastrarCliente { 
  
  cliente = {
    nome: '',
    cpf: '',
    telefone: '',
    endereco: ''
  };

  mensagem = '';
  erro = false;

  constructor(
    private clienteService: ClienteService, 
    private router: Router
  ) {}

  salvar() {
    // Validação básica para não enviar vazio
    if (!this.cliente.nome || !this.cliente.cpf) {
      this.erro = true;
      this.mensagem = 'Nome e CPF são obrigatórios!';
      return;
    }

    this.clienteService.cadastrar(this.cliente).subscribe({
      next: () => {
        alert('Cliente cadastrado com sucesso!');
        this.router.navigate(['/painel']); // Volta pro painel
      },
      error: (err) => {
        this.erro = true;
        // Pega a mensagem de erro que vem do Spring Boot (ex: CPF duplicado)
        this.mensagem = err.error?.erro || 'Erro ao cadastrar cliente.';
        console.error(err);
      }
    });
  }
}