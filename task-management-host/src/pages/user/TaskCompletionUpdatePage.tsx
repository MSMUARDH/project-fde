import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  DatePicker,
  Descriptions,
  Form,
  Switch,
  Tag,
  Typography,
  Space,
  Spin,
  message,
} from "antd";
import { format } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { updateUserTask } from "../../features/userTasksSlice";
import axios from "axios";
import moment from "moment";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const APP_API_URL = import.meta.env.VITE_BASE_URL;

interface TaskData {
  _id: string;
  taskName: string;
  description: string;
  startDate: string;
  endDate: string;
  isEnabled: boolean;
  assignedTo: string;
  isCompleted: boolean;
  completionDate: string | null;
}

const TaskCompletionUpdatePage: React.FC = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState<TaskData | null>(null);
  const [completedDate, setCompletedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.usertask);



  const handleOnFinish = (value: any) => {
    if (completedDate == "" && value.completionDate != null) {
      const starDate = new Date(value.completionDate?._d);
      const formattedStartDate = format(starDate, "yyyy-MM-dd");
      value.completionDate = formattedStartDate;
    } else if (value.completionDate != null) {
      console.log("completedDate", completedDate);

      const starDate = new Date(value.completionDate?.$d);

      const formattedStartDate = format(starDate, "yyyy-MM-dd");

      value.completionDate = formattedStartDate;
      formattedStartDate;
    }

    if (value.isEnabled == undefined) {
      value.isEnabled = false;
    }

    dispatch(updateUserTask({ id: taskId, formData: value }));

    if (status === "succeeded") {
      form.resetFields();
      navigate("/user/dashboard");
      toast.success("Task Updated...");
    }

    console.log("value", value);
  };

  const fetchUserTaskDetails = async () => {
    try {
      const response = await axios.get(
        `${APP_API_URL}/api/tasks/get-task-details/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTask(response.data.task);
    } catch (error) {
      message.error("Failed to fetch task details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTaskDetails();
  }, []);



  const initialDate = moment(task?.completionDate);

  useEffect(() => {
    if (task) {
      if (task?.completionDate == null) {
        console.log("null val found");
        form.setFieldsValue({
          completionDate: null,
          isCompleted: task.isCompleted,
        });
      } else {
        form.setFieldsValue({
          completionDate: initialDate,
          isCompleted: task.isCompleted,
        });
      }
    }
  }, [task, form]);

  const handleRangeChange = () => {

    form.setFieldsValue({
      completionDate: null, 
    });
  };

  const handleDateChange = (dates: any) => {
    if (dates) {
      // console.log(dates.$d);
      setCompletedDate(dates.$d);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!task) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Card>
          <Empty description="Task not found" />
        </Card>
      </div>
    );
  }

  const getStatusTag = () => {
    if (task.isCompleted) {
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Completed
        </Tag>
      );
    }
    return (
      <Tag icon={<ClockCircleOutlined />} color="processing">
        In Progress
      </Tag>
    );
  };

  const getDateRange = () => {
    const start = format(new Date(task.startDate), "MMM dd, yyyy");
    const end = format(new Date(task.endDate), "MMM dd, yyyy");
    return `${start} - ${end}`;
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px" }}>
      <Card
        title={
          <Space>
            <Title level={4} style={{ margin: 0 }}>
              {task.taskName}
            </Title>
            {getStatusTag()}
          </Space>
        }
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item
            label={
              <Text strong>
                <CalendarOutlined /> Task Period
              </Text>
            }
          >
            {getDateRange()}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Text strong>
                <InfoCircleOutlined /> Description
              </Text>
            }
          >
            {task.description || "No description provided"}
          </Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 24 }}>
          <Title level={5}>Update Completion Status</Title>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleOnFinish}
            initialValues={{
              isCompleted: task.isCompleted,
              completionDate: task.completionDate
                ? moment(task.completionDate)
                : null,
            }}
            // initialValues={{ completionDate: initialDate }}
          >
            <Form.Item
              name="isCompleted"
              label="Mark as completed"
              valuePropName="checked"
            >
              <Switch
                checkedChildren="Completed"
                unCheckedChildren="In Progress"
              />
            </Form.Item>

            {/* <Form.Item
              name="completionDate"
              label="Completion Date"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (getFieldValue("isCompleted") && !value) {
                      return Promise.reject(
                        new Error("Please select completion date")
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                disabled={!form.getFieldValue("isCompleted")}
                disabledDate={(current) => {
                  return (
                    current && current < moment(task.startDate).startOf("day")
                  );
                }}
              />
            </Form.Item> */}

            <Form.Item
              label="Completed On"
              name="completionDate"
              //  rules={[{ required: true, message: "Please Provide date" }]}
            >
              <DatePicker
                onClick={handleRangeChange}
                onChange={handleDateChange}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                style={{ marginRight: 8 }}
              >
                Update Status
              </Button>
              <Button onClick={() => navigate("/user/dashboard")}>
                Back to Dashboard
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default TaskCompletionUpdatePage;
