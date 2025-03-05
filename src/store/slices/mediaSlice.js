import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mediaFiles: [],
  loading: false,
  error: null,
};

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setMediaFiles: (state, action) => {
      state.mediaFiles = action.payload;
    },
    addMediaFile: (state, action) => {
      state.mediaFiles.push(action.payload);
    },
    updateMediaFile: (state, action) => {
      const index = state.mediaFiles.findIndex(file => file.id === action.payload.id);
      if (index !== -1) {
        state.mediaFiles[index] = action.payload;
      }
    },
    deleteMediaFile: (state, action) => {
      state.mediaFiles = state.mediaFiles.filter(file => file.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setMediaFiles,
  addMediaFile,
  updateMediaFile,
  deleteMediaFile,
  setLoading,
  setError,
} = mediaSlice.actions;

export default mediaSlice.reducer;