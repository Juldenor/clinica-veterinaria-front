import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private apiUrl = 'http://localhost:8080/animais';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token_clinica');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  cadastrar(animal: any): Observable<any> {
    return this.http.post(this.apiUrl, animal, { headers: this.getHeaders() });
  }

  // NOVO MÉTODO: Traz a lista completa de animais do banco!
  listarTodos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }
}