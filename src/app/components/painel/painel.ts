import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AnimalService } from '../../services/animal';
import { ClienteService } from '../../services/cliente'; // <-- Importando os clientes

@Component({
  selector: 'app-painel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './painel.html',
  styleUrl: './painel.css'
})
export class Painel implements OnInit {
  animais: any[] = [];
  clientes: any[] = [];
  
  // Interruptores para mostrar/esconder as listas
  mostrarAnimais = false;
  mostrarClientes = false;
  
  animalSelecionado: any = null;

  constructor(
    private router: Router, 
    private animalService: AnimalService,
    private clienteService: ClienteService // <-- Injetado aqui!
  ) {}

  ngOnInit() {
    // 1. Busca todos os animais
    this.animalService.listarTodos().subscribe({
      next: (dados) => this.animais = dados,
      error: (err) => console.error('Erro ao carregar animais', err)
    });

    // 2. Busca todos os clientes
    this.clienteService.listarClientes().subscribe({
      next: (dados) => this.clientes = dados,
      error: (err) => console.error('Erro ao carregar clientes', err)
    });
  }

  sair() {
    localStorage.removeItem('token_clinica');
    this.router.navigate(['/login']);
  }

  irParaCadastro() {
    this.router.navigate(['/cadastrar-animal']);
  }

  // Funções do clique nos cartões
  abrirListaAnimais() {
    this.mostrarAnimais = !this.mostrarAnimais; // Liga/desliga
    this.mostrarClientes = false; // Esconde a outra lista
  }

  abrirListaClientes() {
    this.mostrarClientes = !this.mostrarClientes; // Liga/desliga
    this.mostrarAnimais = false; // Esconde a outra lista
  }

  verDetalhes(animal: any) {
    this.animalSelecionado = animal;
  }

  fecharDetalhes() {
    this.animalSelecionado = null;
  }
}