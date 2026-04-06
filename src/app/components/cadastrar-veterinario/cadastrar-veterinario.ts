import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { VeterinarioService } from '../../services/veterinario';

@Component({
  selector: 'app-cadastrar-veterinario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cadastrar-veterinario.html'
})
export class CadastrarVeterinario { 
  
  veterinario = {
    nome: '',
    email: '',
    senha: '',
    crmv: ''
  };

  mensagem = '';
  erro = false;

  constructor(
    private veterinarioService: VeterinarioService, 
    private router: Router
  ) {}

  salvar() {
    if (!this.veterinario.nome || !this.veterinario.crmv) {
      this.erro = true;
      this.mensagem = 'Nome e CRMV são obrigatórios!';
      return;
    }

    this.veterinarioService.cadastrar(this.veterinario).subscribe({
      next: () => {
        alert('Veterinário cadastrado com sucesso!');
        this.router.navigate(['/painel']); 
      },
      error: (err) => {
        this.erro = true;
        this.mensagem = err.error?.erro || 'Erro ao cadastrar veterinário.';
        console.error(err);
      }
    });
  }
}
