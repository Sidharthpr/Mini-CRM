import AsyncStorage from '@react-native-async-storage/async-storage';
import { Customer, Lead, User, ApiResponse, PaginatedResponse, LeadStatus } from '../types/crm';

const API_BASE_URL = 'https://api.minicrm.com'; // Mock API URL

// Mock data for development
const mockCustomers: Customer[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0123',
    company: 'Acme Corp',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@techcorp.com',
    phone: '+1-555-0124',
    company: 'TechCorp Inc',
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
  },
  {
    id: '3',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@startup.io',
    phone: '+1-555-0125',
    company: 'StartupIO',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z',
  },
];

const mockLeads: Lead[] = [
  {
    id: '1',
    customerId: '1',
    title: 'Website Redesign Project',
    description: 'Complete website redesign for better user experience',
    status: 'New',
    value: 15000,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    customerId: '1',
    title: 'Mobile App Development',
    description: 'Native mobile app for iOS and Android',
    status: 'Contacted',
    value: 25000,
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
  },
  {
    id: '3',
    customerId: '2',
    title: 'E-commerce Platform',
    description: 'Custom e-commerce solution with payment integration',
    status: 'Converted',
    value: 35000,
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z',
  },
  {
    id: '4',
    customerId: '3',
    title: 'Data Analytics Dashboard',
    description: 'Real-time analytics dashboard for business insights',
    status: 'Lost',
    value: 12000,
    createdAt: '2024-01-18T11:45:00Z',
    updatedAt: '2024-01-18T11:45:00Z',
  },
];

class ApiService {
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  private async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  }

  private async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = await this.getToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      // For demo purposes, we'll simulate API calls with mock data
      return await this.simulateApiCall<T>(endpoint, config);
    } catch (error) {
      throw new Error(`API request failed: ${error}`);
    }
  }

  private async simulateApiCall<T>(endpoint: string, config: RequestInit): Promise<ApiResponse<T>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock API responses based on endpoint
    if (endpoint.includes('/auth/login')) {
      const mockUser: User = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: 'Admin',
      };
      await this.setToken('mock-jwt-token');
      return {
        data: { user: mockUser, token: 'mock-jwt-token' } as T,
        message: 'Login successful',
        success: true,
      };
    }

    if (endpoint.includes('/auth/register')) {
      const mockUser: User = {
        id: '2',
        firstName: 'New',
        lastName: 'User',
        email: 'newuser@example.com',
        role: 'User',
      };
      await this.setToken('mock-jwt-token-new');
      return {
        data: { user: mockUser, token: 'mock-jwt-token-new' } as T,
        message: 'Registration successful',
        success: true,
      };
    }

    if (endpoint.includes('/customers')) {
      const page = parseInt(new URLSearchParams(endpoint.split('?')[1] || '').get('page') || '1');
      const limit = parseInt(new URLSearchParams(endpoint.split('?')[1] || '').get('limit') || '10');
      const search = new URLSearchParams(endpoint.split('?')[1] || '').get('search') || '';

      let filteredCustomers = mockCustomers;
      if (search) {
        filteredCustomers = mockCustomers.filter(
          customer =>
            customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
            customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            customer.email.toLowerCase().includes(search.toLowerCase()) ||
            customer.company.toLowerCase().includes(search.toLowerCase())
        );
      }

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

      const response: PaginatedResponse<Customer> = {
        data: paginatedCustomers,
        total: filteredCustomers.length,
        page,
        limit,
        totalPages: Math.ceil(filteredCustomers.length / limit),
      };

      return {
        data: response as T,
        message: 'Customers fetched successfully',
        success: true,
      };
    }

    if (endpoint.includes('/leads')) {
      const customerId = new URLSearchParams(endpoint.split('?')[1] || '').get('customerId');
      const status = new URLSearchParams(endpoint.split('?')[1] || '').get('status') as LeadStatus | null;

      let filteredLeads = mockLeads;
      if (customerId) {
        filteredLeads = mockLeads.filter(lead => lead.customerId === customerId);
      }
      if (status && status !== 'All') {
        filteredLeads = filteredLeads.filter(lead => lead.status === status);
      }

      return {
        data: filteredLeads as T,
        message: 'Leads fetched successfully',
        success: true,
      };
    }

    if (endpoint.includes('/dashboard/stats')) {
      const leadsByStatus = mockLeads.reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      }, {} as Record<LeadStatus, number>);

      const totalValue = mockLeads.reduce((sum, lead) => sum + lead.value, 0);

      return {
        data: { leadsByStatus, totalValue } as T,
        message: 'Dashboard stats fetched successfully',
        success: true,
      };
    }

    return {
      data: {} as T,
      message: 'Success',
      success: true,
    };
  }

  // Auth methods
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<void> {
    await this.removeToken();
  }

  // Customer methods
  async getCustomers(page: number = 1, limit: number = 10, search: string = ''): Promise<ApiResponse<PaginatedResponse<Customer>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });
    return this.makeRequest(`/customers?${params.toString()}`);
  }

  async getCustomer(id: string): Promise<ApiResponse<Customer>> {
    const customer = mockCustomers.find(c => c.id === id);
    if (!customer) {
      throw new Error('Customer not found');
    }
    return {
      data: customer,
      message: 'Customer fetched successfully',
      success: true,
    };
  }

  async createCustomer(customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Customer>> {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockCustomers.push(newCustomer);
    return {
      data: newCustomer,
      message: 'Customer created successfully',
      success: true,
    };
  }

  async updateCustomer(id: string, customerData: Partial<Customer>): Promise<ApiResponse<Customer>> {
    const index = mockCustomers.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }
    mockCustomers[index] = {
      ...mockCustomers[index],
      ...customerData,
      updatedAt: new Date().toISOString(),
    };
    return {
      data: mockCustomers[index],
      message: 'Customer updated successfully',
      success: true,
    };
  }

  async deleteCustomer(id: string): Promise<ApiResponse<void>> {
    const index = mockCustomers.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }
    mockCustomers.splice(index, 1);
    return {
      data: undefined as any,
      message: 'Customer deleted successfully',
      success: true,
    };
  }

  // Lead methods
  async getLeads(customerId?: string, status?: LeadStatus): Promise<ApiResponse<Lead[]>> {
    const params = new URLSearchParams();
    if (customerId) params.append('customerId', customerId);
    if (status) params.append('status', status);
    return this.makeRequest(`/leads?${params.toString()}`);
  }

  async getLead(id: string): Promise<ApiResponse<Lead>> {
    const lead = mockLeads.find(l => l.id === id);
    if (!lead) {
      throw new Error('Lead not found');
    }
    return {
      data: lead,
      message: 'Lead fetched successfully',
      success: true,
    };
  }

  async createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Lead>> {
    const newLead: Lead = {
      ...leadData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockLeads.push(newLead);
    return {
      data: newLead,
      message: 'Lead created successfully',
      success: true,
    };
  }

  async updateLead(id: string, leadData: Partial<Lead>): Promise<ApiResponse<Lead>> {
    const index = mockLeads.findIndex(l => l.id === id);
    if (index === -1) {
      throw new Error('Lead not found');
    }
    mockLeads[index] = {
      ...mockLeads[index],
      ...leadData,
      updatedAt: new Date().toISOString(),
    };
    return {
      data: mockLeads[index],
      message: 'Lead updated successfully',
      success: true,
    };
  }

  async deleteLead(id: string): Promise<ApiResponse<void>> {
    const index = mockLeads.findIndex(l => l.id === id);
    if (index === -1) {
      throw new Error('Lead not found');
    }
    mockLeads.splice(index, 1);
    return {
      data: undefined as any,
      message: 'Lead deleted successfully',
      success: true,
    };
  }

  // Dashboard methods
  async getDashboardStats(): Promise<ApiResponse<{ leadsByStatus: Record<LeadStatus, number>; totalValue: number }>> {
    return this.makeRequest('/dashboard/stats');
  }
}

export const apiService = new ApiService();
