import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  login(email: string, senha: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, senha });
  }

  registrar(email: string, senha: string): Observable<any> {
    const role = 'ADMIN'; 
    return this.http.post(`${this.apiUrl}/registrar`, { email, senha, role });
  }
  
  esqueciSenha(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/esqueci-senha`, { email }, { responseType: 'text' });
  }
}
