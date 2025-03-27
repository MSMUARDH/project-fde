import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import AddNewTaskPage from "./AddNewTaskPage";
import { addTask, getAllTask } from "../../../features/task/taskSlice";
import { getAlluser } from "../../../features/user/userSlice";
import { ToastContainer } from "react-toastify";

jest.mock("../../../features/task/taskSlice", () => ({
  addTask: jest.fn(),
  getAllTask: jest.fn(),
}));

jest.mock("../../../features/user/userSlice", () => ({
  getAlluser: jest.fn(),
}));

const mockStore = configureStore([]);

describe("AddNewTaskPage", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: { datas: [{ _id: "1", firstName: "John Doe" }] },
      task: { status: "idle" },
    });
    store.dispatch = jest.fn();
  });

  it("renders the form correctly", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ToastContainer />
          <AddNewTaskPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Add New Task/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Task Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Duration/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Assign User/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
  });

  it("dispatches addTask action on form submission", async () => {
    addTask.mockResolvedValue({ payload: { success: true } });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ToastContainer />
          <AddNewTaskPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/Task Name/i), {
      target: { value: "Test Task" },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "Test Description" },
    });
    fireEvent.mouseDown(screen.getByLabelText(/Assign User/i));
    fireEvent.click(screen.getByText("John Doe"));
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => expect(addTask).toHaveBeenCalled());
  });

  it("shows success toast message on successful task creation", async () => {
    addTask.mockResolvedValue({ payload: { success: true } });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ToastContainer />
          <AddNewTaskPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
    await waitFor(() =>
      expect(screen.getByText(/Task created successfully/i)).toBeInTheDocument()
    );
  });

  it("shows error toast message if task creation fails", async () => {
    addTask.mockRejectedValue(new Error("Task creation failed"));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ToastContainer />
          <AddNewTaskPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
    await waitFor(() =>
      expect(screen.getByText(/Task creation failed/i)).toBeInTheDocument()
    );
  });
});
