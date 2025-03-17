import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

export const fetchInventory = createAsyncThunk(
  'inventory/fetchAll',
  async () => {
    const response = await axios.get('/api/inventory');
    return response.data;
  }
);

export const addInventoryItem = createAsyncThunk(
  'inventory/addItem',
  async (itemData) => {
    const response = await axios.post('/api/inventory/add', itemData);
    return response.data;
  }
);

export const updateInventoryItem = createAsyncThunk(
  'inventory/updateItem',
  async ({ id, data }) => {
    const response = await axios.put(`/api/inventory/${id}`, data);
    return response.data;
  }
);

export const deleteInventoryItem = createAsyncThunk(
  'inventory/deleteItem',
  async (id) => {
    await axios.delete(`/api/inventory/${id}`);
    return id;
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    items: [],
    loading: false,
    error: null,
    filters: {
      category: 'all',
      sortBy: 'quantity'
    }
  },
  reducers: {
    setFilter: (state, action) => {
      state.filters.category = action.payload;
    },
    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addInventoryItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
        toast.success('Item added successfully');
      })
      .addCase(updateInventoryItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        toast.success('Item updated successfully');
      })
      .addCase(deleteInventoryItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
        toast.success('Item deleted successfully');
      });
  }
});

export const { setFilter, setSortBy } = inventorySlice.actions;

export default inventorySlice.reducer;
