import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of } from 'rxjs';
import { TaskFormComponent } from './task-form.component';
import { TaskService } from '../../../core/services/task.service';
import { TaskStatus } from '../../../shared/models/task.model';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;

  function setup(paramId: string | null = null) {
    taskServiceSpy = jasmine.createSpyObj('TaskService', ['create', 'update', 'getById']);
    taskServiceSpy.create.and.returnValue(of({
      id: 1, title: 'T', description: 'D', status: TaskStatus.OPEN,
      finishDate: null, createdAt: '', updatedAt: ''
    }));
    taskServiceSpy.update.and.returnValue(of({
      id: 1, title: 'T', description: 'D', status: TaskStatus.OPEN,
      finishDate: null, createdAt: '', updatedAt: ''
    }));
    taskServiceSpy.getById.and.returnValue(of({
      id: 1, title: 'Existing', description: 'Desc', status: TaskStatus.IN_PROGRESS,
      finishDate: null, createdAt: '2026-01-01T00:00:00', updatedAt: '2026-01-01T00:00:00'
    }));

    TestBed.configureTestingModule({
      imports: [TaskFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideAnimationsAsync(),
        { provide: TaskService, useValue: taskServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => key === 'id' ? paramId : null
              }
            }
          }
        }
      ]
    });

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create the component', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    setup();
    expect(component.form.valid).toBeFalse();
  });

  it('form should be valid when title and description are filled', () => {
    setup();
    component.form.patchValue({ title: 'Test', description: 'Desc' });
    expect(component.form.valid).toBeTrue();
  });

  it('should require title', () => {
    setup();
    const titleControl = component.form.get('title');
    titleControl?.setValue('');
    expect(titleControl?.hasError('required')).toBeTrue();
  });

  it('should require description', () => {
    setup();
    const descControl = component.form.get('description');
    descControl?.setValue('');
    expect(descControl?.hasError('required')).toBeTrue();
  });

  it('should call create when submitting in create mode', () => {
    setup();
    component.form.patchValue({ title: 'New Task', description: 'Description' });
    component.onSubmit();
    expect(taskServiceSpy.create).toHaveBeenCalled();
    expect(taskServiceSpy.update).not.toHaveBeenCalled();
  });

  it('should call update when submitting in edit mode', () => {
    setup('1');
    component.form.patchValue({ title: 'Updated', description: 'Desc' });
    component.onSubmit();
    expect(taskServiceSpy.update).toHaveBeenCalledWith(1, jasmine.any(Object));
    expect(taskServiceSpy.create).not.toHaveBeenCalled();
  });

  it('should load task data in edit mode', () => {
    setup('1');
    expect(taskServiceSpy.getById).toHaveBeenCalledWith(1);
    expect(component.form.get('title')?.value).toBe('Existing');
    expect(component.form.get('description')?.value).toBe('Desc');
    expect(component.form.get('status')?.value).toBe(TaskStatus.IN_PROGRESS);
  });

  it('should not call service when form is invalid', () => {
    setup();
    component.onSubmit();
    expect(taskServiceSpy.create).not.toHaveBeenCalled();
    expect(taskServiceSpy.update).not.toHaveBeenCalled();
  });
});
