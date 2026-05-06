import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AtendimentoService } from '../../services/atendimento';

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
  carregandoAnimais = false;
  carregandoVeterinarios = false;
  erroAnimais = '';
  erroVeterinarios = '';

  mensagem = '';
  erro = false;

  constructor(
    private atendimentoService: AtendimentoService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!localStorage.getItem('token_clinica')) {
      this.router.navigate(['/login']);
      return;
    }

    this.carregarOpcoes();
  }

  async carregarOpcoes() {
    this.carregandoAnimais = true;
    this.carregandoVeterinarios = true;
    this.erroAnimais = '';
    this.erroVeterinarios = '';

    const [animais, veterinarios] = await Promise.allSettled([
      this.buscarComToken<any[]>('http://localhost:8080/animais'),
      this.buscarComToken<any[]>('http://localhost:8080/veterinarios')
    ]);

    if (animais.status === 'fulfilled') {
      this.animais = animais.value;
    } else {
      this.erroAnimais = 'Nao foi possivel carregar os animais cadastrados.';
      this.tratarErroCarregamento(animais.reason);
    }

    if (veterinarios.status === 'fulfilled') {
      this.veterinarios = veterinarios.value;
    } else {
      this.erroVeterinarios = 'Nao foi possivel carregar os veterinarios cadastrados.';
      this.tratarErroCarregamento(veterinarios.reason);
    }

    this.carregandoAnimais = false;
    this.carregandoVeterinarios = false;
    this.cdr.detectChanges();
  }

  salvar() {
    if (!this.atendimento.animalId || !this.atendimento.veterinarioId || !this.atendimento.dataAtendimento) {
      this.erro = true;
      this.mensagem = 'Preencha os campos obrigatorios (Animal, Veterinario e Data)!';
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

  private async buscarComToken<T>(url: string): Promise<T> {
    const token = localStorage.getItem('token_clinica');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        signal: controller.signal
      });

      if (response.status === 401 || response.status === 403) {
        throw { status: response.status };
      }

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`);
      }

      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  }

  private tratarErroCarregamento(err: any) {
    console.error('Erro ao carregar dados do agendamento', err);
    this.erro = true;

    if (err?.status === 401 || err?.status === 403) {
      this.mensagem = 'Sessao expirada. Faca login novamente.';
      localStorage.removeItem('token_clinica');
      setTimeout(() => this.router.navigate(['/login']), 1200);
      return;
    }

    this.mensagem = 'Nao foi possivel carregar os dados para agendar a consulta.';
  }
}
