import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const APP_API_URL = import.meta.env.VITE_BASE_URL;


interface User {
  _id: number;
  firstName: string;

}


interface UserState {
  datas: User[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}


const initialState: UserState = {
  datas: [],
  status: "idle",
  error: null,
};


interface FormData {
  id: string; 
  firstName: string;
  lastName: string;
  email: string;
}


interface UpdateUserPayload {
  id: string | undefined;
  formData: FormData;
}


export const getAlluser = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("api/fetchUser", async (_, thunkAPI) => {
  try {
    const response = await axios.get<{ users: User[] }>(
      `${APP_API_URL}/api/users/get-all-users`
    );
        // console.log("response.data.users", response.data.users);
    return response.data.users;


  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

//! Async thunk to add a make
export const addUser = createAsyncThunk<User, FormData, { rejectValue: string }>(
  "api/adduser",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post<{ users: User }>(
        `${APP_API_URL}/api/users/create-user`,
        formData
      );
      return response.data.users;
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//! Async thunk to delete a user
export const deleteUser = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("api/deleteUser", async (userId, thunkAPI) => {
  try {
    const response = await axios.delete<{ users: { _id: string } }>(
      `${APP_API_URL}/api/users/delete-user/${userId}`
    );
    console.log("deleted user", response.data.users);
    return response.data.users._id;
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

//! Async thunk to update a user
export const updateUser = createAsyncThunk<
  User,
  UpdateUserPayload,
  { rejectValue: string }
  >("api/updateUser", async({ id, formData }, thunkAPI) => {
  try {
    console.log("IUDDDDDDD", id);
    console.log("value", formData);
    
    const response = await axios.put<{ user: User }>(
      `${APP_API_URL}/api/users/update-user/${id}`,
      formData,
    );
    console.log("Updated data", response.data);
    return response.data.user;
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Create the slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAlluser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAlluser.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = "succeeded";
        state.datas = action.payload;
      })
      .addCase(
        getAlluser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "Failed to fetch makes";
        }
      )
      .addCase(addUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded";
        state.datas.push(action.payload);
      })
      .addCase(
        addUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "Failed to add user";
        })
      .addCase(deleteUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string | number>) => {
        state.status = "succeeded";
        state.datas = state.datas.filter((user) => user._id !== action.payload);
        console.log("action.payload", action.payload);
      })
      .addCase(
        deleteUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "Failed to delete user";
        }
      )
      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded";
        const updatedUser = action.payload;
        const index = state.datas.findIndex(
          (user) => user._id === updatedUser._id
        );
        if (index !== -1) {
          state.datas[index] = updatedUser;
        }
      })
      .addCase(
        updateUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "Failed to update make";
        }
      );
  },
});

export default userSlice.reducer;
