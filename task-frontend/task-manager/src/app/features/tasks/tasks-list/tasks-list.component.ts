import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TaskService } from '../../../core/services/task.service';
import { TaskResponse, TaskStatus } from '../../../shared/models/task.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { I18nService } from '../../../shared/i18n/i18n.service';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, DatePipe,
    MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule,
    MatSelectModule, MatFormFieldModule, MatInputModule,
    MatDatepickerModule, MatNativeDateModule, MatChipsModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatDialogModule, MatTooltipModule,
    TranslatePipe
  ],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss'
})
export class TasksListComponent implements OnInit {
  private taskService = inject(TaskService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private i18n = inject(I18nService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = ['title', 'status', 'finishDate', 'createdAt', 'actions'];
  dataSource: TaskResponse[] = [];
  loading = false;
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  statusOptions = Object.values(TaskStatus);
  filterStatus: TaskStatus | '' = '';
  filterDate: Date | null = null;

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    let finishDateStr: string | undefined;
    if (this.filterDate) {
      const d = this.filterDate;
      finishDateStr = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0, 19);
    }
    this.taskService.list({
      status: this.filterStatus || undefined,
      finishDate: finishDateStr,
      page: this.pageIndex,
      size: this.pageSize
    }).subscribe({
      next: res => {
        this.dataSource = res.data;
        this.totalElements = res.meta.totalElements;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open(this.i18n.t('tasks.load.error'), this.i18n.t('common.close'), { duration: 4000 });
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTasks();
  }

  onFilter(): void {
    this.pageIndex = 0;
    this.loadTasks();
  }

  clearFilters(): void {
    this.filterStatus = '';
    this.filterDate = null;
    this.pageIndex = 0;
    this.loadTasks();
  }

  goToNew(): void {
    this.router.navigate(['/tasks/new']);
  }

  goToEdit(id: number): void {
    this.router.navigate(['/tasks', id, 'edit']);
  }

  confirmDelete(task: TaskResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: this.i18n.t('tasks.delete.dialogTitle'),
        message: this.i18n.t('tasks.delete.dialogMessage', { title: task.title })
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.delete(task.id).subscribe({
          next: () => {
            this.snackBar.open(this.i18n.t('tasks.delete.success'), this.i18n.t('common.close'), { duration: 3000 });
            this.loadTasks();
          },
          error: () => {
            this.snackBar.open(this.i18n.t('tasks.delete.error'), this.i18n.t('common.close'), { duration: 4000 });
          }
        });
      }
    });
  }

  getStatusLabel(status: TaskStatus): string {
    return this.i18n.t(`task.status.${status}`);
  }

  getStatusColor(status: TaskStatus): string {
    const colors: Record<TaskStatus, string> = {
      [TaskStatus.OPEN]: 'accent',
      [TaskStatus.PREVENT]: 'primary',
      [TaskStatus.IN_PROGRESS]: 'warn',
      [TaskStatus.CLOSED]: ''
    };
    return colors[status] || '';
  }
}
