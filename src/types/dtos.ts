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
 * Response for getting a task by ID or list of tasks
 */
export interface TaskResponse {
  taskID: number;
  taskCode: string;
  jobID: string;
  verifierKeyID: string;
  endCustomerID: number;
  managerAreaID: number;
  creationDate: string;
  startDate: string;
  estimatedClosingDate: string;
  endDate: string | null;
  forecastRevenueAmount: number;
  forecastCostAmount: number;
  taskStatusID: number;
  endCustomerName: string;
  legalEntityName: string;
  managerAreaName: string;
  taskStatusName: string;
  endCustomer: null | unknown;
  managerArea: null | unknown;
  taskStatus: null | unknown;
  userID: number;
  subProjectID: number;
  subProjectName: string | null;
  projectID: number;
  projectName: string | null;
  customerName: string;
  projectTypeID: number;
  projectType: string;
  jobTypeID: number;
  jobType: string;
  taskProjectCodesStatusID: number;
  taskProjectCodesStatus: null | unknown;
  approveDateProjectCodes: string;
  vendorID: number;
  vendorName: string;
  supervisorName: string;
  designerName: string;
  costCenter: null | unknown;
  customerID: number;
  taskCustomerCostCenterID: number;
  amount: number | null;
  internalCost: number | null;
  vendorCost: number | null;
  profit: number | null;
  margin: number | null;
}
