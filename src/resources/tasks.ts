import { HttpClient } from '../lib/httpClient';

export class TasksResource {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get project secondary fields by project ID
   */
  async getProjectSecondaryFields(projectId: number): Promise<unknown> {
    return this.httpClient.get(`/api/tasks/project-secondary-fields/${projectId}`);
  }

  /**
   * Get tasks by subproject ID
   */
  async getBySubProject(subProjectId: number): Promise<unknown> {
    return this.httpClient.get(`/api/tasks/by-subproject/${subProjectId}`);
  }

  /**
   * Get task by ID
   */
  async getById(id: number): Promise<unknown> {
    return this.httpClient.get(`/api/tasks/${id}`);
  }

  /**
   * Update or create a task
   */
  async update(payload: unknown): Promise<unknown> {
    return this.httpClient.put('/api/tasks', payload);
  }
}
