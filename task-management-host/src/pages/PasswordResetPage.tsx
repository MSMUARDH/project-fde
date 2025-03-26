import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const { Title } = Typography;

const APP_API_URL = import.meta.env.VITE_BASE_URL;

const PasswordResetPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const verifyUser = async () => {
    const response = await axios.get(`${APP_API_URL}/api/users/verify-email`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the JWT token to the header
      },
    });

    console.log("reponse", response);

    try {
      if (response.data.success) {
        // console.log(response.data.message);
        toast.success("user verification success");
        // Handle successful verification
      } else {
        console.error(response.data.message);
        // Handle the error (e.g., show a message to the user)
      }
    } catch (error) {
      let errorMessage: string;

      if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object" && "message" in error) {
        errorMessage = (error as { message: string }).message;
      } else {
        errorMessage = "An unexpected error occurred";
      }
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  const onFinish = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      // Send the new password and token to the backend
      const response = await axios.put(
        `${APP_API_URL}/api/users/change-password`,
        {
          password: values.password,
          confirmPassword: values.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the JWT token to the header
          },
        }
      );

      if (response.status == 200) {
        toast.success("Password set successfully!");
        navigate("/login"); // Redirect to the login page
      } else {
        toast.error(response.data.message || "Failed to set password.");
      }
    } catch (error) {
      console.error("Error setting password:", error);
      toast.error("An error occurred while setting the password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px", padding: "20px" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: "24px" }}>
          Set Your Password
        </Title>
        <Form
          form={form}
          name="setPassword"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                min: 8,
                message: "Password must be at least 8 characters long!",
              },
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Set Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default PasswordResetPage;
