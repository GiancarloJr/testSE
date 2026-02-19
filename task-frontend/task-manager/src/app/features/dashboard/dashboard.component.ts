import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration, ChartData} from 'chart.js';
import {DashboardService} from '../../core/services/dashboard.service';
import {RoleService} from '../../core/services/role.service';
import {DashboardResponse} from '../../shared/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, MatButtonToggleModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatIconModule,
    BaseChartDirective
  ],
  templateUrl: './dashboard.component.html' ,
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private roleService = inject(RoleService);
  private snackBar = inject(MatSnackBar);

  isAdmin = false;
  viewMode: 'global' | 'mine' = 'global';
  loading = false;

  data: DashboardResponse = {total: 0, open: 0, prevent: 0, inProgress: 0, closed: 0};

  cards: { key: string; label: string; value: number }[] = [];

  chartData: ChartData<'bar'> = {
    labels: ['ABERTO', 'IMPEDIDO', 'EM ANDAMENTO', 'FECHADO'],
    datasets: [{data: [0, 0, 0, 0], label: 'Tasks'}]
  };

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    resizeDelay: 100,
    plugins: {legend: {display: false}},
    scales: {
      y: {beginAtZero: true, ticks: {stepSize: 1}}
    }
  };

  ngOnInit(): void {
    this.isAdmin = this.roleService.isAdmin();
    if (!this.isAdmin) {
      this.viewMode = 'mine';
    }
    this.buildCards();
    this.fetchData();
  }

  onViewModeChange(mode: 'global' | 'mine'): void {
    this.viewMode = mode;
    this.fetchData();
  }

  private buildCards(): void {
    this.cards = [
      {key: 'total', label: 'Total', value: this.data.total},
      {key: 'open', label: 'Aberto', value: this.data.open},
      {key: 'prevent', label: 'Impedido', value: this.data.prevent},
      {key: 'inProgress', label: 'Em Andamento', value: this.data.inProgress},
      {key: 'closed', label: 'Fechado', value: this.data.closed}
    ];
  }

  private fetchData(): void {
    this.loading = true;
    const obs = this.viewMode === 'global'
      ? this.dashboardService.getGlobalSummary()
      : this.dashboardService.getMySummary();

    obs.subscribe({
      next: (res) => {
        this.data = res;
        this.buildCards();
        this.chartData = {
          labels: ['ABERTO', 'IMPEDIDO', 'EM ANDAMENTO', 'FECHADO'],
          datasets: this.configDatasets(res)
        };
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar dashboard.', 'Fechar', {duration: 4000});
        this.data = {total: 0, open: 0, prevent: 0, inProgress: 0, closed: 0};
        this.buildCards();
        this.chartData = {
          labels: ['ABERTO', 'IMPEDIDO', 'EM ANDAMENTO', 'FECHADO'],
          datasets: [{data: [0, 0, 0, 0], label: 'Tasks'}]
        };
        this.loading = false;
      }
    });
  }

  private configDatasets(res: DashboardResponse): any[] {
    return [{
      data: [res.open, res.prevent, res.inProgress, res.closed], label: 'Tasks',
      backgroundColor: [
        'rgba(33, 150, 243, 0.35)',
        'rgba(255, 152, 0, 0.35)',
        'rgba(156, 39, 176, 0.35)',
        'rgba(76, 175, 80, 0.35)'
      ],
      borderColor: [
        'rgba(33, 150, 243, 1)',
        'rgba(255, 152, 0, 1)',
        'rgba(156, 39, 176, 1)',
        'rgba(76, 175, 80, 1)'
      ],
      borderWidth: 1,
      borderRadius: 8,
      maxBarThickness: 70
    }]
  }
}
