import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TaskService } from '../../../core/services/task.service';
import { TaskRequest, TaskStatus } from '../../../shared/models/task.model';
import { I18nService } from '../../../shared/i18n/i18n.service';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatDatepickerModule, MatNativeDateModule,
    MatSnackBarModule, MatProgressSpinnerModule,
    TranslatePipe
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private i18n = inject(I18nService);

  isEdit = false;
  taskId: number | null = null;
  loading = false;
  saving = false;
  minFinishDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  statusOptions = Object.values(TaskStatus);

  form = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    status: [TaskStatus.OPEN as TaskStatus],
    finishDate: [null as Date | null ]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.taskId = Number(idParam);
      this.loadTask();
    }
  }

  private loadTask(): void {
    this.loading = true;
    this.taskService.getById(this.taskId!).subscribe({
      next: task => {
        this.form.patchValue({
          title: task.title,
          description: task.description,
          status: task.status,
          finishDate: task.finishDate ? new Date(task.finishDate) : null
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open(this.i18n.t('task.load.error'), this.i18n.t('common.close'), { duration: 4000 });
        this.router.navigate(['/tasks']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const raw = this.form.getRawValue();
    const request: TaskRequest = {
      title: raw.title!,
      description: raw.description!,
      status: raw.status ?? undefined,
      finishDate: raw.finishDate ? this.formatDate(raw.finishDate) : undefined
    };

    const obs = this.isEdit
      ? this.taskService.update(this.taskId!, request)
      : this.taskService.create(request);

    obs.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdit ? this.i18n.t('task.save.updated') : this.i18n.t('task.save.created'),
          this.i18n.t('common.close'), { duration: 3000 }
        );
        this.router.navigate(['/tasks']);
      },
      error: () => {
        this.saving = false;
        this.snackBar.open(this.i18n.t('task.save.error'), this.i18n.t('common.close'), { duration: 4000 });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }

  getStatusLabel(status: TaskStatus): string {
    return this.i18n.t(`task.status.${status}`);
  }

  private formatDate(date: Date): string {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return d.toISOString().slice(0, 19);
  }
}
