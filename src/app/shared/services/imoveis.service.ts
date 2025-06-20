import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImoveisService {
  private apiUrl = 'http://localhost:5272/api/imoveis'; 

  constructor(private http: HttpClient) {}

  getTiposImoveis(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tipos`);
  }

  getMediaValorVendaPorBairro(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/media-valor-venda-bairro`);
  }

  getMediaLocacaoMensal(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/media-locacao-mensal`);
  }

  getFinalidades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/finalidades`);
  }

  getMediaAreaPorTipo(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/media-area-por-tipo`);
  }

  getImoveisPorQuartos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/imoveis-por-quartos`);
  }

  getMediaPrecoM2PorBairro(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/media-preco-m2-por-bairro`);
  }
} 