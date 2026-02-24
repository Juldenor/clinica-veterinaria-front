import { Component, OnInit } from '@angular/core'; // <-- Adicionei o OnInit aqui
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AnimalService } from '../../services/animal';
import { ClienteService } from '../../services/cliente'; // <-- Importe o novo serviço

@Component({
  selector: 'app-cadastrar-animal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cadastrar-animal.html',
  styleUrl: './cadastrar-animal.css'
})
export class CadastrarAnimal implements OnInit { 
  
  animal = {
    nome: '',
    idade: 0,
    sexo: '',
    raca: '',
    cor: '',
    pelagem: '',
    clienteId: null
  };

  clientes: any[] = []; 
  mensagem = '';
  erro = false;

  constructor(
    private animalService: AnimalService, 
    private clienteService: ClienteService, 
    private router: Router
  ) {}

  ngOnInit() {
    this.clienteService.listarClientes().subscribe({
      next: (dados) => {
        this.clientes = dados; 
      },
      error: (err) => {
        console.error('Erro ao buscar a lista de clientes', err);
      }
    });
  }

  salvar() {
    this.animalService.cadastrar(this.animal).subscribe({
      next: () => {
        alert('Animal cadastrado com sucesso!');
        this.router.navigate(['/painel']);
      },
      error: (err) => {
        this.erro = true;
        this.mensagem = 'Erro ao cadastrar. Verifique os dados!';
        console.error(err);
      }
    });
  }
}