import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AnimalService } from '../../services/animal';
import { ClienteService } from '../../services/cliente';
import { VeterinarioService } from '../../services/veterinario';
import { AtendimentoService } from '../../services/atendimento';

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
  veterinarios: any[] = [];
  atendimentos: any[] = [];
  
  mostrarAnimais = false;
  mostrarClientes = false;
  mostrarVeterinarios = false;
  mostrarAtendimentos = false;
  
  animalSelecionado: any = null;

  constructor(
    private router: Router, 
    private animalService: AnimalService,
    private clienteService: ClienteService,
    private veterinarioService: VeterinarioService,
    private atendimentoService: AtendimentoService
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

    this.veterinarioService.listarVeterinarios().subscribe({
      next: (dados) => this.veterinarios = dados,
      error: (err) => console.error('Erro ao carregar veterinários', err)
    });

    this.atendimentoService.listarAtendimentos().subscribe({
      next: (dados) => this.atendimentos = dados,
      error: (err) => console.error('Erro ao carregar atendimentos', err)
    });
  }

  sair() {
    localStorage.removeItem('token_clinica');
    this.router.navigate(['/login']);
  }

  irParaCadastro() {
    this.router.navigate(['/cadastrar-animal']);
  }

  irParaCadastroCliente() {
    this.router.navigate(['/cadastrar-cliente']);
  }

  irParaCadastroVeterinario() {
    this.router.navigate(['/cadastrar-veterinario']);
  }

  irParaCadastroAtendimento() {
    this.router.navigate(['/cadastrar-atendimento']);
  }

  esconderTodos() {
    this.mostrarAnimais = false;
    this.mostrarClientes = false;
    this.mostrarVeterinarios = false;
    this.mostrarAtendimentos = false;
  }

  abrirListaAnimais() {
    const atual = this.mostrarAnimais;
    this.esconderTodos();
    this.mostrarAnimais = !atual; 
  }

  abrirListaClientes() {
    const atual = this.mostrarClientes;
    this.esconderTodos();
    this.mostrarClientes = !atual; 
  }

  abrirListaVeterinarios() {
    const atual = this.mostrarVeterinarios;
    this.esconderTodos();
    this.mostrarVeterinarios = !atual;
  }

  abrirListaAtendimentos() {
    const atual = this.mostrarAtendimentos;
    this.esconderTodos();
    this.mostrarAtendimentos = !atual;
  }

  verDetalhes(animal: any) {
    this.animalSelecionado = animal;
  }

  fecharDetalhes() {
    this.animalSelecionado = null;
  }
}