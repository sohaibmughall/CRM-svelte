import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  pages: [],
  categories: [],
  loading: false,
  error: null,
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    addPost: (state, action) => {
      state.posts.push(action.payload);
    },
    updatePost: (state, action) => {
      const index = state.posts.findIndex(post => post.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },
    setPages: (state, action) => {
      state.pages = action.payload;
    },
    addPage: (state, action) => {
      state.pages.push(action.payload);
    },
    updatePage: (state, action) => {
      const index = state.pages.findIndex(page => page.id === action.payload.id);
      if (index !== -1) {
        state.pages[index] = action.payload;
      }
    },
    deletePage: (state, action) => {
      state.pages = state.pages.filter(page => page.id !== action.payload);
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action) => {
      const index = state.categories.findIndex(category => category.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter(category => category.id !== action.payload);
    },
  },
});

export const {
  setPosts,
  addPost,
  updatePost,
  deletePost,
  setPages,
  addPage,
  updatePage,
  deletePage,
  setCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} = contentSlice.actions;

export default contentSlice.reducer;