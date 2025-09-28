import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../services/api';
import { Lead, LeadState, LeadStatus } from '../types/crm';

const initialState: LeadState = {
  leads: [],
  currentLead: null,
  isLoading: false,
  error: null,
  filterStatus: 'All',
};

// Async thunks
export const fetchLeads = createAsyncThunk(
  'leads/fetchLeads',
  async ({ customerId, status }: { customerId?: string; status?: LeadStatus } = {}, { rejectWithValue }) => {
    try {
      const response = await apiService.getLeads(customerId, status);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch leads');
    }
  }
);

export const fetchLeadById = createAsyncThunk(
  'leads/fetchLeadById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getLead(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch lead');
    }
  }
);

export const createLead = createAsyncThunk(
  'leads/createLead',
  async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await apiService.createLead(leadData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create lead');
    }
  }
);

export const updateLead = createAsyncThunk(
  'leads/updateLead',
  async ({ id, leadData }: { id: string; leadData: Partial<Lead> }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateLead(id, leadData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update lead');
    }
  }
);

export const deleteLead = createAsyncThunk(
  'leads/deleteLead',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiService.deleteLead(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete lead');
    }
  }
);

const leadSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setFilterStatus: (state, action: PayloadAction<LeadStatus | 'All'>) => {
      state.filterStatus = action.payload;
    },
    clearCurrentLead: (state) => {
      state.currentLead = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch leads
      .addCase(fetchLeads.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leads = action.payload;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch lead by ID
      .addCase(fetchLeadById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeadById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLead = action.payload;
      })
      .addCase(fetchLeadById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create lead
      .addCase(createLead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leads.unshift(action.payload);
      })
      .addCase(createLead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update lead
      .addCase(updateLead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.leads.findIndex(lead => lead.id === action.payload.id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
        if (state.currentLead?.id === action.payload.id) {
          state.currentLead = action.payload;
        }
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete lead
      .addCase(deleteLead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leads = state.leads.filter(lead => lead.id !== action.payload);
        if (state.currentLead?.id === action.payload) {
          state.currentLead = null;
        }
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilterStatus, clearCurrentLead, clearError } = leadSlice.actions;
export default leadSlice.reducer;
