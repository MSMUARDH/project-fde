import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, Switch } from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAlluser, updateUser } from "../../../features/user/userSlice";
import { AppDispatch, RootState } from "../../../app/store";
import { toast } from "react-toastify";
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

const APP_API_URL = import.meta.env.VITE_BASE_URL;

interface UserData {
  firstName: string;
  lastName: string;
  mobileNumber: number;
  address: string;
  isEnabled: boolean;
  role: string;
}

const EditUserPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { userId } = useParams();
  const [user, setUser] = useState<UserData | null>(null);
  const { datas, status, error } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch<AppDispatch>();
  const variant = Form.useWatch("variant", form);
  const [selectedAdress, setSelectedAdress] = useState("");

  const handleOnFinish = (value: any) => {
    console.log(value);

    if (value.isEnabled == undefined) {
      value.isEnabled = false;
    }

    dispatch(updateUser({ id: userId, formData: value }));
    dispatch(getAlluser());

    if (status === "succeeded") {
      form.resetFields();
      navigate("/admin/user-management");
      toast.success("User Updated successfully");
    }
  };

  const fetchUserDetails = async () => {
    const response = await axios.get(
      `${APP_API_URL}/api/users/get-user-details/${userId}`
    );

    console.log("response", response.data.user);
    setUser(response.data.user);
  };



  const getSelectedLocationAddress = (place) => {
    console.log("Location from the parent", place);
    form.setFieldsValue({
      address: place.address,
    });

    setSelectedAdress(place.address);
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);


  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        mobileNumber: user.mobileNumber,
        address: user.address,
        isEnabled: user.isEnabled,
        role: user.role,
      });
    }
  }, [user, form]);

  return (
    <div style={{ margin: "50px" }}>
      <Form
        onFinish={handleOnFinish}
        {...formItemLayout}
        form={form}
        variant={variant || "filled"}
        style={{ maxWidth: 900 }}
        initialValues={{ variant: "filled" }}
      >
        <h2 style={{ display: "flex", justifyContent: "center" }}>Edit User</h2>
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
            address={user?.address}
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

export default EditUserPage;
