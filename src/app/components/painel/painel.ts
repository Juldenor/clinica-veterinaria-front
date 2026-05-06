import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AtendimentoService } from '../../services/atendimento';

@Component({
  selector: 'app-painel',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './painel.html',
  styleUrl: './painel.css'
})
export class Painel implements OnInit {
  animais: any[] = [];
  clientes: any[] = [];
  veterinarios: any[] = [];
  atendimentos: any[] = [];
  statusAtendimentos = ['AGENDADO', 'CONCLUIDO', 'CANCELADO'];
  mensagemStatus = '';
  erroStatus = false;
  erroPainel = '';

  mostrarAnimais = false;
  mostrarClientes = false;
  mostrarVeterinarios = false;
  mostrarAtendimentos = false;

  animalSelecionado: any = null;
  historicoAnimal: any[] = [];
  carregandoHistorico = false;
  erroHistorico = '';

  constructor(
    private router: Router,
    private atendimentoService: AtendimentoService,
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

    this.carregarDadosPainel();
  }

  async carregarDadosPainel() {
    this.erroPainel = '';

    const [animais, clientes, veterinarios, atendimentos] = await Promise.allSettled([
      this.buscarComToken<any[]>('http://localhost:8080/animais'),
      this.buscarComToken<any[]>('http://localhost:8080/clientes'),
      this.buscarComToken<any[]>('http://localhost:8080/veterinarios'),
      this.buscarComToken<any[]>('http://localhost:8080/atendimentos')
    ]);

    this.aplicarResultado(animais, (dados) => this.animais = dados, 'Nao foi possivel carregar os animais.');
    this.aplicarResultado(clientes, (dados) => this.clientes = dados, 'Nao foi possivel carregar os clientes.');
    this.aplicarResultado(veterinarios, (dados) => this.veterinarios = dados, 'Nao foi possivel carregar os veterinarios.');
    this.aplicarResultado(atendimentos, (dados) => this.atendimentos = dados, 'Nao foi possivel carregar os atendimentos.');
    this.cdr.detectChanges();
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

  atualizarStatusAtendimento(atendimento: any, novoStatus: string) {
    const statusAnterior = atendimento.status;
    atendimento.status = novoStatus;
    this.mensagemStatus = '';

    this.atendimentoService.atualizarStatus(atendimento.id, novoStatus).subscribe({
      next: (atendimentoAtualizado) => {
        Object.assign(atendimento, atendimentoAtualizado);
        this.erroStatus = false;
        this.mensagemStatus = 'Status do atendimento atualizado com sucesso.';
        this.cdr.detectChanges();
      },
      error: (err) => {
        atendimento.status = statusAnterior;
        this.erroStatus = true;
        this.mensagemStatus = 'Nao foi possivel atualizar o status do atendimento.';
        console.error('Erro ao atualizar status do atendimento', err);
        this.cdr.detectChanges();
      }
    });
  }

  verDetalhes(animal: any) {
    this.animalSelecionado = animal;
    this.erroHistorico = '';
    this.historicoAnimal = this.historicoLocalDoAnimal(animal);

    if (this.historicoAnimal.length > 0) {
      this.carregandoHistorico = false;
    } else {
      this.carregandoHistorico = true;
    }

    this.cdr.detectChanges();
    this.carregarHistoricoAnimal(animal.id);
  }

  async carregarHistoricoAnimal(animalId: number) {
    try {
      const historico = await this.buscarComToken<any[]>(`http://localhost:8080/atendimentos/animal/${animalId}`);
      this.historicoAnimal = historico;
      this.carregandoHistorico = false;
      this.cdr.detectChanges();
    } catch (err) {
      this.carregandoHistorico = false;

      if (this.historicoAnimal.length === 0) {
        this.erroHistorico = this.mensagemErroAmigavel(err, 'Nao foi possivel carregar o historico clinico.');
      }

      console.error('Erro ao carregar historico do animal', err);
      this.cdr.detectChanges();
    }
  }

  totalInvestidoAnimal(): number {
    return this.historicoAnimal.reduce((total, atendimento) => total + (atendimento.valor || 0), 0);
  }

  consultasConcluidasAnimal(): number {
    return this.historicoAnimal.filter((atendimento) => atendimento.status === 'CONCLUIDO').length;
  }

  fecharDetalhes() {
    this.animalSelecionado = null;
    this.historicoAnimal = [];
    this.erroHistorico = '';
    this.carregandoHistorico = false;
  }

  private historicoLocalDoAnimal(animal: any): any[] {
    return this.atendimentos
      .filter((atendimento) => atendimento.animalId === animal.id || (!atendimento.animalId && atendimento.animalNome === animal.nome))
      .sort((a, b) => String(b.dataAtendimento || '').localeCompare(String(a.dataAtendimento || '')));
  }

  private aplicarResultado(
    resultado: PromiseSettledResult<any[]>,
    aplicar: (dados: any[]) => void,
    mensagemErro: string
  ) {
    if (resultado.status === 'fulfilled') {
      aplicar(resultado.value);
      return;
    }

    this.tratarErroCarregamento(resultado.reason, mensagemErro);
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

  private tratarErroCarregamento(err: any, mensagem: string) {
    console.error(mensagem, err);

    if (err?.status === 401 || err?.status === 403) {
      this.erroPainel = 'Sessao expirada. Faca login novamente.';
      localStorage.removeItem('token_clinica');
      setTimeout(() => this.router.navigate(['/login']), 1200);
      return;
    }

    this.erroPainel = this.mensagemErroAmigavel(err, mensagem);
  }

  private mensagemErroAmigavel(err: any, mensagemPadrao: string): string {
    if (err?.name === 'AbortError') {
      return 'A API demorou para responder. Tente novamente em alguns segundos.';
    }

    if (err?.status === 401 || err?.status === 403) {
      return 'Sessao expirada. Faca login novamente.';
    }

    return mensagemPadrao;
  }
}
