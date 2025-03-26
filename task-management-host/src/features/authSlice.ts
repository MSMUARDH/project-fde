


import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios"; // or any other HTTP client


const APP_API_URL = import.meta.env.VITE_BASE_URL;

// Define your types
interface User {
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Define the async thunk for login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
          const response = await axios.post(
            `${APP_API_URL}/api/users/login`,
            credentials
      );
      
      localStorage.setItem("token", response.data.token);

      return response.data; // Assuming the API returns the user object
    } catch (error) {
        if (axios.isAxiosError(error)) {
          return rejectWithValue(error.response?.data || "An error occurred");
        } else {
          return rejectWithValue("An unexpected error occurred");
        }
    }
  }
);

// Create the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { logout } = authSlice.actions;
export default authSlice.reducer;


