import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const APP_API_URL = import.meta.env.VITE_BASE_URL;


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


interface TaskState {
  datas: Task[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}


const initialState: TaskState = {
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

//! Async thunk to fetch all tasks
export const getAllTask = createAsyncThunk<
  Task[],
  void,
  { rejectValue: string }
>("api/fetcTasks", async (_, thunkAPI) => {
  try {
    const response = await axios.get<{ tasks: Task[] }>(
      `${APP_API_URL}/api/tasks/get-all-tasks`,
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
export const updateTask = createAsyncThunk<
  Task,
  UpdateUserPayload,
  { rejectValue: string }
>("api/updateTask", async ({ id, formData }, thunkAPI) => {
  try {
    const response = await axios.put<{ task: Task }>(
      `${APP_API_URL}/api/tasks/update-task/${id}`,
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
      .addCase(getAllTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllTask.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.status = "succeeded";
        state.datas = action.payload;
      })
      .addCase(
        getAllTask.rejected,
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
      .addCase(updateTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.status = "succeeded";
        const updatedTask = action.payload;

        const index = state.datas.findIndex(
          (task) => task._id === updatedTask._id
        );
        if (index !== -1) {
          state.datas[index] = updatedTask;
        }
      })
      .addCase(
        updateTask.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "Failed to update make";
        }
      );
  },
});

export default taskSlice.reducer;
