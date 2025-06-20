import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ImoveisService } from '../../services/imoveis.service';
import Chart from 'chart.js/auto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  tiposImoveis: any[] = [];
  mediaValorVendaBairro: any[] = [];
  mediaLocacaoMensal: any[] = [];
  finalidades: any[] = [];
  mediaAreaPorTipo: any[] = [];
  imoveisPorQuartos: any[] = [];
  mediaPrecoM2PorBairro: any[] = [];

  charts: { [key: string]: Chart } = {};

  @ViewChild('tiposChart', { static: true }) tiposChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('valorVendaChart', { static: true }) valorVendaChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('locacaoMensalChart', { static: true }) locacaoMensalChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('finalidadesChart', { static: true }) finalidadesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('areaTipoChart', { static: true }) areaTipoChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('quartosChart', { static: true }) quartosChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('precoM2Chart', { static: true }) precoM2ChartRef!: ElementRef<HTMLCanvasElement>;

  constructor(private imoveisService: ImoveisService) {}

  // Getters para os cards de resumo
  get totalImoveis(): number {
    return this.tiposImoveis.reduce((sum, item) => sum + item.quantidade, 0);
  }

  get valorMedioGeral(): string {
    if (this.mediaValorVendaBairro.length === 0) return 'R$ 0';
    const media = this.mediaValorVendaBairro.reduce((sum, item) => sum + item.mediaValor, 0) / this.mediaValorVendaBairro.length;
    return 'R$ ' + media.toLocaleString('pt-BR');
  }

  get tiposDiferentes(): number {
    return this.tiposImoveis.length;
  }

  get bairrosAtendidos(): number {
    return this.mediaValorVendaBairro.length;
  }

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    // Carregar dados de tipos de imóveis
    this.imoveisService.getTiposImoveis().subscribe((data) => {
      this.tiposImoveis = data;
      this.createTiposChart();
    });

    // Carregar dados de valor médio por bairro
    this.imoveisService.getMediaValorVendaPorBairro().subscribe((data) => {
      this.mediaValorVendaBairro = data;
      this.createValorVendaChart();
    });

    // Carregar dados de evolução mensal
    this.imoveisService.getMediaLocacaoMensal().subscribe((data) => {
      this.mediaLocacaoMensal = data;
      this.createLocacaoMensalChart();
    });

    // Carregar dados de finalidades
    this.imoveisService.getFinalidades().subscribe((data) => {
      this.finalidades = data;
      this.createFinalidadesChart();
    });

    // Carregar dados de área média por tipo
    this.imoveisService.getMediaAreaPorTipo().subscribe((data) => {
      this.mediaAreaPorTipo = data;
      this.createAreaTipoChart();
    });

    // Carregar dados de imóveis por quartos
    this.imoveisService.getImoveisPorQuartos().subscribe((data) => {
      this.imoveisPorQuartos = data;
      this.createQuartosChart();
    });

    // Carregar dados de preço por m² por bairro
    this.imoveisService.getMediaPrecoM2PorBairro().subscribe((data) => {
      this.mediaPrecoM2PorBairro = data;
      this.createPrecoM2Chart();
    });
  }

  createTiposChart(): void {
    if (this.charts['tipos']) {
      this.charts['tipos'].destroy();
    }
    this.charts['tipos'] = new Chart(this.tiposChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.tiposImoveis.map((item: any) => item.tipo),
        datasets: [{
          label: 'Quantidade de imóveis',
          data: this.tiposImoveis.map((item: any) => item.quantidade),
          backgroundColor: '#ef4444',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Quantidade de Imóveis por Tipo',
            color: '#fff'
          },
          legend: {
            display: true,
            labels: { color: '#fff' }
          }
        },
        scales: {
          x: { ticks: { color: '#fff' } },
          y: { ticks: { color: '#fff' } }
        }
      }
    });
  }

  createValorVendaChart(): void {
    if (this.charts['valorVenda']) {
      this.charts['valorVenda'].destroy();
    }
    this.charts['valorVenda'] = new Chart(this.valorVendaChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.mediaValorVendaBairro.map((item: any) => item.bairro),
        datasets: [{
          label: 'Valor Médio (R$)',
          data: this.mediaValorVendaBairro.map((item: any) => item.mediaValor),
          backgroundColor: '#3b82f6',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Valor Médio por Bairro',
            color: '#fff'
          },
          legend: {
            display: true,
            labels: { color: '#fff' }
          }
        },
        scales: {
          x: { ticks: { color: '#fff' } },
          y: { 
            ticks: { 
              color: '#fff',
              callback: function(value) {
                return 'R$ ' + value.toLocaleString('pt-BR');
              }
            } 
          }
        }
      }
    });
  }

  createLocacaoMensalChart(): void {
    if (this.charts['locacaoMensal']) {
      this.charts['locacaoMensal'].destroy();
    }
    
    const labels = this.mediaLocacaoMensal.map((item: any) => {
      const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return `${meses[item.mes - 1]}/${item.ano}`;
    });

    this.charts['locacaoMensal'] = new Chart(this.locacaoMensalChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Valor Médio de Locação (R$)',
          data: this.mediaLocacaoMensal.map((item: any) => item.mediaLocacao),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Evolução Mensal do Preço Médio de Locação',
            color: '#fff'
          },
          legend: {
            display: true,
            labels: { color: '#fff' }
          }
        },
        scales: {
          x: { ticks: { color: '#fff' } },
          y: { 
            ticks: { 
              color: '#fff',
              callback: function(value) {
                return 'R$ ' + value.toLocaleString('pt-BR');
              }
            } 
          }
        }
      }
    });
  }

  createFinalidadesChart(): void {
    if (this.charts['finalidades']) {
      this.charts['finalidades'].destroy();
    }
    this.charts['finalidades'] = new Chart(this.finalidadesChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.finalidades.map((item: any) => item.finalidade),
        datasets: [{
          data: this.finalidades.map((item: any) => item.quantidade),
          backgroundColor: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Distribuição de Imóveis por Finalidade',
            color: '#fff'
          },
          legend: {
            display: true,
            labels: { color: '#fff' }
          }
        }
      }
    });
  }

  createAreaTipoChart(): void {
    if (this.charts['areaTipo']) {
      this.charts['areaTipo'].destroy();
    }
    this.charts['areaTipo'] = new Chart(this.areaTipoChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.mediaAreaPorTipo.map((item: any) => item.tipo),
        datasets: [{
          label: 'Área Média (m²)',
          data: this.mediaAreaPorTipo.map((item: any) => item.mediaArea),
          backgroundColor: '#f59e0b',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Área Média por Tipo de Imóvel',
            color: '#fff'
          },
          legend: {
            display: true,
            labels: { color: '#fff' }
          }
        },
        scales: {
          x: { ticks: { color: '#fff' } },
          y: { 
            ticks: { 
              color: '#fff',
              callback: function(value: any) {
                return Number(value).toFixed(0) + ' m²';
              }
            } 
          }
        }
      }
    });
  }

  createQuartosChart(): void {
    if (this.charts['quartos']) {
      this.charts['quartos'].destroy();
    }
    this.charts['quartos'] = new Chart(this.quartosChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.imoveisPorQuartos.map((item: any) => `${item.quartos} quarto(s)`),
        datasets: [{
          label: 'Quantidade de Imóveis',
          data: this.imoveisPorQuartos.map((item: any) => item.quantidade),
          backgroundColor: '#8b5cf6',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Distribuição de Imóveis por Número de Quartos',
            color: '#fff'
          },
          legend: {
            display: true,
            labels: { color: '#fff' }
          }
        },
        scales: {
          x: { ticks: { color: '#fff' } },
          y: { ticks: { color: '#fff' } }
        }
      }
    });
  }

  createPrecoM2Chart(): void {
    if (this.charts['precoM2']) {
      this.charts['precoM2'].destroy();
    }
    this.charts['precoM2'] = new Chart(this.precoM2ChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.mediaPrecoM2PorBairro.map((item: any) => item.bairro),
        datasets: [{
          label: 'Preço Médio por m² (R$)',
          data: this.mediaPrecoM2PorBairro.map((item: any) => item.mediaPrecoM2),
          backgroundColor: '#ec4899',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Preço Médio por m² por Bairro',
            color: '#fff'
          },
          legend: {
            display: true,
            labels: { color: '#fff' }
          }
        },
        scales: {
          x: { ticks: { color: '#fff' } },
          y: { 
            ticks: { 
              color: '#fff',
              callback: function(value) {
                return 'R$ ' + value.toLocaleString('pt-BR');
              }
            } 
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    Object.values(this.charts).forEach(chart => {
      if (chart) {
        chart.destroy();
      }
    });
  }
}
