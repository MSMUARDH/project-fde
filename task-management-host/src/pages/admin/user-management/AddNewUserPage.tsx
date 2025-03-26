import React, { useRef, useState } from "react";
import { Button, Form, Input, Select, Switch } from "antd";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../app/store";
import { getAlluser, addUser } from "../../../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageLoader from "../../../components/PageLoader";
import MapWithClickSelection from "../../../components/MapWithClickSelection";

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

const AddNewUserPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const variant = Form.useWatch("variant", form);
  const [selectedAdress, setSelectedAdress] = useState("");

  const { datas, status, error } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleOnFinish = async (value: any) => {
    console.log(value);

    if (value.isEnabled == undefined) {
      value.isEnabled = false;
    }

    try {
      await dispatch(addUser(value)).unwrap();
      await dispatch(getAlluser());


        form.resetFields();
        navigate("/admin/user-management");
        toast.success("User created successfully");
      
    } catch (error) {
      toast.error(error);
    }
  };

  const getSelectedLocationAddress = (place) => {
    console.log("Location from the parent", place);
    form.setFieldsValue({
      address: place.address,
    });

    setSelectedAdress(place.address);
  };

  console.log("users", datas);

  return (
    <div style={{ margin: "50px" }}>
      {status === "loading" && <PageLoader />}
      <Form
        onFinish={handleOnFinish}
        {...formItemLayout}
        form={form}
        variant={variant || "filled"}
        style={{ maxWidth: 900 }}
        initialValues={{ variant: "filled" }}
      >
        <h2 style={{ display: "flex", justifyContent: "center" }}>
          Add New User
        </h2>

        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: "Please provide first name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: "Please provide last name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please provide email!" },
            { type: "email", message: "Please enter a valid email address!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mobile Number"
          name="mobileNumber"
          rules={[
            { required: true, message: "Please provide mobile number!" },
            {
              validator: (_, value) => {
                // Regex to validate mobile number with country code
                const regex = /^\+\d{1,4}\d{7,14}$/; // Example: +911234567890
                if (!value || regex.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    "Please enter a valid mobile number with country code (e.g., +911234567890)!"
                  )
                );
              },
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please provide address!" }]}
        >
          <Input
            placeholder="Select Your Location on map"
            readOnly
            value={selectedAdress}
          />
          <MapWithClickSelection
            getSelectedLocationAddress={getSelectedLocationAddress}
          />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select a role!" }]}
        >
          <Select
            // defaultValue="user"
            style={{ width: 400 }}
            // onChange={handleChange}
            options={[
              { value: "user", label: "User" },
              { value: "admin", label: "Admin" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Enable/Disable User"
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

export default AddNewUserPage;
