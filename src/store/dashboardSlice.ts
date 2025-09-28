import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../services/api';
import { DashboardState, LeadStatus } from '../types/crm';

const initialState: DashboardState = {
  leadsByStatus: {
    New: 0,
    Contacted: 0,
    Converted: 0,
    Lost: 0,
  },
  totalValue: 0,
  isLoading: false,
  error: null,
};

// Async thunk
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getDashboardStats();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch dashboard stats');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leadsByStatus = action.payload.leadsByStatus;
        state.totalValue = action.payload.totalValue;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
