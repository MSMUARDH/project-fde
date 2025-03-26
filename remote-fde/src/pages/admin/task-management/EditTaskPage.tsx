import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Select, Switch } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../app/store";
import axios from "axios";
import moment from "moment";
import { getAlluser } from "../../../features/user/userSlice";
import { getAllTask, updateTask } from "../../../features/task/taskSlice";
import { format } from "date-fns";
import { toast } from "react-toastify";
import PageLoader from "../../../components/PageLoader";

const { RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const APP_API_URL = import.meta.env.VITE_BASE_URL;

interface TaskData {
  taskName: string;
  description: string;
  startDate: string;
  endDate: string;
  address: string;
  isEnabled: boolean;
  assignedTo: string;
  role: string;
}

const EditTaskPage: React.FC = () => {
  const [form] = Form.useForm();
  const variant = Form.useWatch("variant", form);

  const navigate = useNavigate();

  const { taskId } = useParams();
  const [task, setTask] = useState<TaskData | null>(null);

  const { datas } = useSelector((state: RootState) => state.user);
  const { status } = useSelector((state: RootState) => state.task);

  const dispatch = useDispatch<AppDispatch>();

  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");

  const handleOnFinish = (value: any) => {
    if (selectedStartDate == "" && selectedEndDate == "") {
      const starDate = new Date(value.duration[0]?._d);
      const endDate = new Date(value.duration[1]?._d);

      const formattedStartDate = format(starDate, "yyyy-MM-dd");
      const formattedEndtDate = format(endDate, "yyyy-MM-dd");

      value.startDate = formattedStartDate;
      value.endDate = formattedEndtDate;
    } else {
      const starDate = new Date(value.duration[0]?.$d);
      const endDate = new Date(value.duration[1]?.$d);

      const formattedStartDate = format(starDate, "yyyy-MM-dd");
      const formattedEndtDate = format(endDate, "yyyy-MM-dd");

      value.startDate = formattedStartDate;
      value.endDate = formattedEndtDate;
    }
    if (value.isEnabled == undefined) {
      value.isEnabled = false;
    }
    console.log(value);

    try {
      dispatch(updateTask({ id: taskId, formData: value }));
      dispatch(getAllTask());

      form.resetFields();
      navigate("/admin/task-management");
      toast.success("User Updated successfully");
    } catch (error: any) {
      console.log(error);
    }
  };

  console.log("status", status);

  const fetchTaskDetails = async () => {
    const response = await axios.get(
      `${APP_API_URL}/api/tasks/get-task-details/${taskId}`
    );

    setTask(response.data.task);

    console.log("response.data.task", response.data.task);
  };

  useEffect(() => {
    fetchTaskDetails();
    dispatch(getAlluser());
  }, []);

  const initialRange = [moment(task?.startDate), moment(task?.endDate)];
  useEffect(() => {
    if (task) {
      // Convert API response to moment objects

      form.setFieldsValue({
        taskName: task.taskName,
        description: task.description,
        isEnabled: task.isEnabled,
        assignedTo: task.assignedTo,
        duration: initialRange,
      });
    }
  }, [task, form]);

  const handleRangeChange = () => {
    // If the user tries to clear the date range or selects only one date, reset the field
    form.setFieldsValue({
      duration: null, // Clear the date range
    });
  };

  const options = datas.map((user) => {
    return { value: user._id, label: user.firstName };
  });

  const handleDateChange = (dates: any) => {
    if (dates) {
      setSelectedStartDate(dates[0].$d);
      setSelectedEndDate(dates[1].$d);
    }
  };

  // console.log("options", options);

  return (
    <div style={{ margin: "50px" }}>
      {status === "loading" && <PageLoader />}
      <Form
        onFinish={handleOnFinish}
        {...formItemLayout}
        form={form}
        variant={variant || "filled"}
        style={{ maxWidth: 900 }}
        // initialValues={{ variant: "filled" }}
        initialValues={{ duration: initialRange }}
      >
        <h2 style={{ display: "flex", justifyContent: "center" }}>Edit Task</h2>

        <Form.Item
          label="Task Name"
          name="taskName"
          rules={[{ required: true, message: "Please provide taskname!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: false }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="Duration"
          name="duration"
          rules={[{ required: true, message: "Please provide a date range" }]}
        >
          <RangePicker
            onClick={handleRangeChange}
            onChange={handleDateChange}
          />
        </Form.Item>

        <Form.Item
          label="Assign User"
          name="assignedTo"
          rules={[{ required: true, message: "Please select a user!" }]}
        >
          <Select options={options} />
        </Form.Item>
        <Form.Item
          name="isEnabled"
          label="Enable/Disable Task"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditTaskPage;
