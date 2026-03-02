import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AnimalService } from '../../services/animal';
import { ClienteService } from '../../services/cliente';

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
  
  mostrarAnimais = false;
  mostrarClientes = false;
  
  animalSelecionado: any = null;

  constructor(
    private router: Router, 
    private animalService: AnimalService,
    private clienteService: ClienteService 
  ) {}

  ngOnInit() {
    this.animalService.listarTodos().subscribe({
      next: (dados) => this.animais = dados,
      error: (err) => console.error('Erro ao carregar animais', err)
    });

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

  // Função nova para ir para a tela de clientes
  irParaCadastroCliente() {
    this.router.navigate(['/cadastrar-cliente']);
  }

  abrirListaAnimais() {
    this.mostrarAnimais = !this.mostrarAnimais; 
    this.mostrarClientes = false; 
  }

  abrirListaClientes() {
    this.mostrarClientes = !this.mostrarClientes; 
    this.mostrarAnimais = false; 
  }

  verDetalhes(animal: any) {
    this.animalSelecionado = animal;
  }

  fecharDetalhes() {
    this.animalSelecionado = null;
  }
}