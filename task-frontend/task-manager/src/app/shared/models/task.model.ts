export enum TaskStatus {
  OPEN = 'OPEN',
  PREVENT = 'PREVENT',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED'
}

export interface TaskRequest {
  title: string;
  description: string;
  status?: TaskStatus;
  finishDate?: string;
}

export interface TaskResponse {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  finishDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PageMeta {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PageResponse<T> {
  data: T[];
  meta: PageMeta;
}
