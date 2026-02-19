import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TaskService } from './task.service';
import { TaskStatus } from '../../shared/models/task.model';
import { environment } from '../../../environments/environment';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/tasks`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('list should call GET with query params for status, finishDate, page, size', () => {
    const mockResponse = {
      data: [],
      meta: { page: 0, size: 10, totalElements: 0, totalPages: 0 }
    };

    service.list({
      status: TaskStatus.OPEN,
      finishDate: '2026-02-18T00:00:00',
      page: 0,
      size: 10
    }).subscribe(res => {
      expect(res.data).toEqual([]);
    });

    const req = httpMock.expectOne(r =>
      r.url === apiUrl &&
      r.params.get('status') === 'OPEN' &&
      r.params.get('finishDate') === '2026-02-18T00:00:00' &&
      r.params.get('page') === '0' &&
      r.params.get('size') === '10'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('list without params should call GET without query params', () => {
    const mockResponse = {
      data: [],
      meta: { page: 0, size: 10, totalElements: 0, totalPages: 0 }
    };

    service.list().subscribe();

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getById should call GET /api/tasks/:id', () => {
    service.getById(5).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/5`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('create should call POST /api/tasks', () => {
    const task = { title: 'Test', description: 'Desc' };
    service.create(task).subscribe();
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(task);
    req.flush({});
  });

  it('update should call PUT /api/tasks/:id', () => {
    const task = { title: 'Updated', description: 'Desc' };
    service.update(3, task).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/3`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(task);
    req.flush({});
  });

  it('delete should call DELETE /api/tasks/:id', () => {
    service.delete(7).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/7`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
