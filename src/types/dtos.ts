/**
 * Secondary field for a task
 */
export interface SecondaryFieldDTO {
  taskID?: number;
  fieldName?: string | null;
  value?: string | null;
}

/**
 * DTO for creating or updating a task
 */
export interface TaskCreateDto {
  subProjectID?: number;
  verifierKeyID?: string | null;
  jobID?: string | null;
  estimatedClosingDate?: string | null; // ISO 8601 date-time format
  secondaryFields?: SecondaryFieldDTO[] | null;
}

/**
 * Response for getting a task by ID
 */
export interface TaskResponse {
  id: number;
  subProjectID: number;
  verifierKeyID?: string | null;
  jobID?: string | null;
  estimatedClosingDate?: string | null;
  secondaryFields?: SecondaryFieldDTO[] | null;
  createdAt?: string;
  updatedAt?: string;
}
