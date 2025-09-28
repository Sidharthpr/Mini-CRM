export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  customerId: string;
  title: string;
  description: string;
  status: LeadStatus;
  value: number;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Converted' | 'Lost';

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Admin' | 'User';
}

export interface CustomerState {
  customers: Customer[];
  currentCustomer: Customer | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  searchQuery: string;
}

export interface LeadState {
  leads: Lead[];
  currentLead: Lead | null;
  isLoading: boolean;
  error: string | null;
  filterStatus: LeadStatus | 'All';
}

export interface DashboardState {
  leadsByStatus: Record<LeadStatus, number>;
  totalValue: number;
  isLoading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  customers: CustomerState;
  leads: LeadState;
  dashboard: DashboardState;
}
