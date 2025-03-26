import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const APP_API_URL = import.meta.env.VITE_BASE_URL;

// Define the type for a single make
interface Task {
  _id: number;
  taskName: string;
  description: string;
  startDate: string;
  endDate: string;
  assignedTo: string;
  isEnabled: boolean;
  isCompleted: boolean;
  completionDate: string;
}

// Define the state type
interface TaskState {
  datas: Task[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Initial state
const initialState: TaskState = {
  datas: [],
  status: "idle",
  error: null,
};

// Define the type for the form data
interface FormData {
  // Define the structure of the form data here
  id: string; // Ensure `id` is required
  firstName: string;
  lastName: string;
  email: string;
}

// Define the type for the update payload
interface UpdateUserPayload {
  id: string | undefined;
  formData: FormData;
}

//! Async thunk to fetch all tasks
export const getAllUserTask = createAsyncThunk<
  Task[],
  void,
  { rejectValue: string }
>("api/fetchUserTasks", async (_, thunkAPI) => {
  try {
    const response = await axios.get<{ tasks: Task[] }>(
      `${APP_API_URL}/api/tasks/get-user-task`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add the JWT token to the header
        },
      }
    );
    return response.data.tasks;
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

//! Async thunk to add a task
export const addTask = createAsyncThunk<
  Task,
  FormData,
  { rejectValue: string }
>("api/addTask", async (formData, thunkAPI) => {
  try {
    const response = await axios.post<{ tasks: Task }>(
      `${APP_API_URL}/api/tasks/create-task`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data.tasks;
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

//! Async thunk to delete a task
export const deleteTask = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("api/deletetask", async (taskId, thunkAPI) => {
  try {
    const response = await axios.delete<{ task: { _id: string } }>(
      `${APP_API_URL}/api/tasks/delete-task/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data.task._id;
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

//! Async thunk to update a task
export const updateUserTask = createAsyncThunk<
  Task,
  UpdateUserPayload,
  { rejectValue: string }
>("api/updateUserTask", async ({ id, formData }, thunkAPI) => {
  try {
    const response = await axios.put<{ task: Task }>(
      `${APP_API_URL}/api/tasks/update-task-completeion/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data.task;
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Create the slice
const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUserTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getAllUserTask.fulfilled,
        (state, action: PayloadAction<Task[]>) => {
          state.status = "succeeded";
          state.datas = action.payload;
        }
      )
      .addCase(
        getAllUserTask.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "Failed to fetch makes";
        }
      )
      .addCase(addTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.status = "succeeded";
        state.datas.push(action.payload);
      })
      .addCase(
        addTask.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "Failed to add user";
        }
      )
      .addCase(deleteTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deleteTask.fulfilled,
        (state, action: PayloadAction<string | number>) => {
          state.status = "succeeded";
          state.datas = state.datas.filter(
            (user) => user._id !== action.payload
          );
        }
      )
      .addCase(
        deleteTask.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "Failed to delete user";
        }
      )
      .addCase(updateUserTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        updateUserTask.fulfilled,
        (state, action: PayloadAction<Task>) => {
          state.status = "succeeded";
          const updatedUserTask = action.payload;

          console.log("updatedTask", updatedUserTask);

          const index = state.datas.findIndex(
            (task) => task._id === updatedUserTask._id
          );
          if (index !== -1) {
            state.datas[index] = updatedUserTask;
          }
        }
      )
      .addCase(
        updateUserTask.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "Failed to update make";
        }
      );
  },
});

export default taskSlice.reducer;
