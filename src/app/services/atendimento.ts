import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AtendimentoService {
  private apiUrl = 'http://localhost:8080/atendimentos';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token_clinica');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  listarAtendimentos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  listarPorAnimal(animalId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/animal/${animalId}`, { headers: this.getHeaders() });
  }

  cadastrar(atendimento: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, atendimento, { headers: this.getHeaders() });
  }

  atualizarStatus(id: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/status`, { status }, { headers: this.getHeaders() });
  }
}
