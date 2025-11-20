import { HttpClient } from '../lib/httpClient';
import { SecondaryFieldDTO, TaskCreateDto, TaskResponse } from '../types/dtos';

export class TasksResource {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get project secondary fields by project ID
   * @param projectId - The ID of the project
   * @returns Array of secondary field definitions for the project
   */
  async getProjectSecondaryFields(projectId: number): Promise<SecondaryFieldDTO[]> {
    return this.httpClient.get<SecondaryFieldDTO[]>(
      `/api/tasks/project-secondary-fields/${projectId}`,
    );
  }

  /**
   * Get tasks by subproject ID
   * @param subProjectId - The ID of the subproject
   * @returns Array of tasks belonging to the subproject
   */
  async getBySubProject(subProjectId: number): Promise<TaskResponse[]> {
    return this.httpClient.get<TaskResponse[]>(`/api/tasks/by-subproject/${subProjectId}`);
  }

  /**
   * Get task by ID
   * @param id - The ID of the task
   * @returns The task details
   */
  async getById(id: number): Promise<TaskResponse> {
    return this.httpClient.get<TaskResponse>(`/api/tasks/${id}`);
  }

  /**
   * Update or create a task
   * @param payload - The task data to create or update
   * @returns The created or updated task
   */
  async update(payload: TaskCreateDto): Promise<TaskResponse> {
    return this.httpClient.put<TaskResponse>('/api/tasks', payload);
  }
}
