import { createSlice } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';

const initialState = {
  user: null,
  token: null,
  role: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      supabase.auth.signOut();
    },
    updateRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const { login, logout, updateRole } = authSlice.actions;
export default authSlice.reducer;