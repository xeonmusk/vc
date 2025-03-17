import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchFarmStats = createAsyncThunk(
  'farm/fetchStats',
  async () => {
    const response = await axios.get('/api/farm/stats');
    return response.data;
  }
);

const farmSlice = createSlice({
  name: 'farm',
  initialState: {
    tasks: [],
    inventory: [],
    orders: [],
    stats: {
      productionData: {},
      inventoryTrends: {},
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFarmStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFarmStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchFarmStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default farmSlice.reducer;
