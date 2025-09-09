// redux/slices/themeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: localStorage.getItem("theme") || "light", // persist default
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme);
      document.documentElement.className = state.theme; // Tailwind dark mode
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("theme", state.theme);
      document.documentElement.className = state.theme;
    },
  },
});

const themeReducer = themeSlice.reducer;
const themeActions = themeSlice.actions;

export { themeReducer, themeActions };
