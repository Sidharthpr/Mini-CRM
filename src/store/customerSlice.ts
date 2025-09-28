import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../services/api';
import { Customer, CustomerState } from '../types/crm';

const initialState: CustomerState = {
  customers: [],
  currentCustomer: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  searchQuery: '',
};

// Async thunks
export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async ({ page = 1, limit = 10, search = '' }: { page?: number; limit?: number; search?: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.getCustomers(page, limit, search);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch customers');
    }
  }
);

export const fetchCustomerById = createAsyncThunk(
  'customers/fetchCustomerById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getCustomer(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch customer');
    }
  }
);

export const createCustomer = createAsyncThunk(
  'customers/createCustomer',
  async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await apiService.createCustomer(customerData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create customer');
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async ({ id, customerData }: { id: string; customerData: Partial<Customer> }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateCustomer(id, customerData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update customer');
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiService.deleteCustomer(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete customer');
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearCurrentCustomer: (state) => {
      state.currentCustomer = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch customers
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch customer by ID
      .addCase(fetchCustomerById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCustomer = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create customer
      .addCase(createCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update customer
      .addCase(updateCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.customers.findIndex(customer => customer.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
        if (state.currentCustomer?.id === action.payload.id) {
          state.currentCustomer = action.payload;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete customer
      .addCase(deleteCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = state.customers.filter(customer => customer.id !== action.payload);
        state.pagination.total -= 1;
        if (state.currentCustomer?.id === action.payload) {
          state.currentCustomer = null;
        }
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchQuery, clearCurrentCustomer, clearError, setPage } = customerSlice.actions;
export default customerSlice.reducer;
