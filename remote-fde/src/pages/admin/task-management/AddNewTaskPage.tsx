import React, { useEffect } from "react";
import { Button, DatePicker, Form, Input, Select, Switch } from "antd";
import { getAlluser } from "../../../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../app/store";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { format } from "date-fns";
import { addTask, getAllTask } from "../../../features/task/taskSlice";
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

const AddNewTaskPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const variant = Form.useWatch("variant", form);

  const  datas  = useSelector((state: RootState) => state.user.datas);

  const { status } = useSelector((state: RootState) => state.task);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getAlluser());
  }, [dispatch]);

  const handleOnFinish = async (value: any) => {
    const starDate = new Date(value.duration[0].$d);
    const endDate = new Date(value.duration[1].$d);

    const formattedStartDate = format(starDate, "yyyy-MM-dd");
    const formattedEndtDate = format(endDate, "yyyy-MM-dd");

    value.startDate = formattedStartDate;
    value.endDate = formattedEndtDate;

    if (value.isEnabled == undefined) {
      value.isEnabled = false;
    }

    console.log("Valiues", value);

    try {
      await dispatch(addTask(value)).unwrap();
      await dispatch(getAllTask());

      toast.success("Task created successfully", {
        autoClose: 1000, // ✅ Correct property (in milliseconds)
        onClose: () => {
          // Your function here
          navigate("/admin/task-management");
        },
      });

      form.resetFields();
    } catch (error: any) {
      toast.error(error);
    }
  };

  const options = datas?.map((user) => {
    return { value: user._id, label: user.firstName };
  });

  return (
    <div style={{ margin: "50px" }}>
      {status === "loading" && <PageLoader />}
      <ToastContainer />
      <Form
        onFinish={handleOnFinish}
        {...formItemLayout}
        form={form}
        variant={variant || "filled"}
        style={{ maxWidth: 900 }}
        initialValues={{ variant: "filled" }}
      >
        <h2 style={{ display: "flex", justifyContent: "center" }}>
          Add New Task
        </h2>

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
          rules={[{ required: true, message: "Please Provide date range" }]}
        >
          <RangePicker />
        </Form.Item>

        <Form.Item
          label="Assign User"
          name="assignedTo"
          rules={[{ required: true, message: "Please select a user!" }]}
        >
          <Select options={options} />
        </Form.Item>
        <Form.Item
          label="Enable/Disable Task"
          name="isEnabled"
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

export default AddNewTaskPage;
