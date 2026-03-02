import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { EsqueciSenha } from './components/esqueci-senha/esqueci-senha';
import { Registrar } from './components/registrar/registrar';
import { Painel } from './components/painel/painel';
import { CadastrarAnimal } from './components/cadastrar-animal/cadastrar-animal';
import { CadastrarCliente } from './cadastrar-cliente/cadastrar-cliente';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, 
  { path: 'login', component: LoginComponent },
  { path: 'esqueci-senha', component: EsqueciSenha },
  { path: 'registrar', component: Registrar },
  { path: 'painel', component: Painel },
  { path: 'cadastrar-animal', component: CadastrarAnimal },
  { path: 'cadastrar-cliente', component: CadastrarCliente }
];