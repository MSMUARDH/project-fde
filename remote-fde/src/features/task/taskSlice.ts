import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const APP_API_URL = import.meta.env.VITE_BASE_URL;


interface Task {
  _id: string;
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


interface TaskFormData {
  taskName: string;
  description: string;
  startDate: string;
  endDate: string;
  assignedTo: string;
}


interface UpdateUserPayload {
  id: string | undefined;
  formData: TaskFormData;
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

    console.log("response.data.tasks getAllTask ", response.data.tasks);
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
  TaskFormData,
  { rejectValue: string }
>("api/addTask", async (formData, thunkAPI) => {
  try {
    const response = await axios.post<{ task: Task }>(
      `${APP_API_URL}/api/tasks/create-task`,
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

//! Async thunk to delete a task
export const deleteTask = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("api/deleteTask", async (taskId, thunkAPI) => {
  try {
    const response = await axios.delete(
      `${APP_API_URL}/api/tasks/delete-task/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("response deleted", response.data.task._id);
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
        console.log("response.data.tasks fulfilled ", action.payload);
      })
      .addCase(
        getAllTask.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "Failed to fetch taskes";
          console.log("response.data.tasks rejected ", action.payload);
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
          state.error = action.payload || "Failed to add task";
        }
      )
      .addCase(deleteTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "succeeded";
        state.datas = state.datas.filter((task) => task._id !== action.payload);
        console.log("delete action.payload ", action.payload);
        console.log("state.datas after delete", state.datas);
      })
      .addCase(
        deleteTask.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "Failed to delete user";
          console.log("rejected action.payload ", action.payload);
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
