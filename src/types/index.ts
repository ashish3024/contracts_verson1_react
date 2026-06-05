export type ContractStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export interface Contract {
  id: string;
  title: string;
  description: string;
  status: ContractStatus;
  owner_name: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowHistory {
  id: string;
  contract_id: string;
  previous_status: ContractStatus | null;
  new_status: ContractStatus;
  changed_by: string;
  changed_at: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface ContractFilters {
  search?: string;
  status?: ContractStatus | '';
  page?: number;
  size?: number;
}

export interface ApiError {
  message: string;
  status: number;
}
