import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AtendimentoService } from '../../services/atendimento';
import { AnimalService } from '../../services/animal';
import { VeterinarioService } from '../../services/veterinario';

@Component({
  selector: 'app-cadastrar-atendimento',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cadastrar-atendimento.html'
})
export class CadastrarAtendimento implements OnInit {
  
  atendimento = {
    animalId: null,
    veterinarioId: null,
    dataAtendimento: '',
    descricao: '',
    valor: 0.0,
    status: 'AGENDADO'
  };

  animais: any[] = [];
  veterinarios: any[] = [];

  mensagem = '';
  erro = false;

  constructor(
    private atendimentoService: AtendimentoService, 
    private animalService: AnimalService,
    private veterinarioService: VeterinarioService,
    private router: Router
  ) {}

  ngOnInit() {
    this.animalService.listarTodos().subscribe({
      next: (dados) => this.animais = dados,
      error: (err) => console.error(err)
    });
    this.veterinarioService.listarVeterinarios().subscribe({
      next: (dados) => this.veterinarios = dados,
      error: (err) => console.error(err)
    });
  }

  salvar() {
    if (!this.atendimento.animalId || !this.atendimento.veterinarioId || !this.atendimento.dataAtendimento) {
      this.erro = true;
      this.mensagem = 'Preencha os campos obrigatórios (Animal, Veterinário e Data)!';
      return;
    }

    this.atendimentoService.cadastrar(this.atendimento).subscribe({
      next: () => {
        alert('Atendimento registrado com sucesso!');
        this.router.navigate(['/painel']); 
      },
      error: (err) => {
        this.erro = true;
        this.mensagem = 'Erro ao cadastrar atendimento.';
        console.error(err);
      }
    });
  }
}
