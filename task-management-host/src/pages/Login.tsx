// import React, { useEffect, useRef } from "react";
// import { LockOutlined, UserOutlined } from "@ant-design/icons";
// import { Button, Checkbox, Form, Input, Flex } from "antd";
// import { useNavigate } from "react-router-dom";
// import { AppDispatch, RootState } from "../app/store";
// import { useDispatch, useSelector } from "react-redux";
// import { loginUser } from "../features/authSlice";
// import { toast } from "react-toastify";

// const Login: React.FC = () => {
//   const navigate = useNavigate();
//   const hasErrorHandled = useRef(false);

//   const { user, loading, error } = useSelector(
//     (state: RootState) => state.auth
//   );
//   const dispatch = useDispatch<AppDispatch>();

//   const onFinish = (values: any) => {
//     console.log("Received values of form: ", values);

//     dispatch(loginUser({ email: values.email, password: values.password }));
//   };

//   if (!loading) {
//     console.log("user", user);
//     if (user?.role == "admin") {
//       navigate("/admin/task-management");
//     } else {
//       navigate("/user/dashboard");
//     }
//   }

//   useEffect(() => {
//     if (!loading && error && !hasErrorHandled.current) {
//       console.log("error", error);
//       // toast.error(error.message);
//       let errorMessage: string;

//       if (typeof error === "string") {
//         errorMessage = error;
//       } else if (error && typeof error === "object" && "message" in error) {
//         errorMessage = (error as { message: string }).message;
//       } else {
//         errorMessage = "An unexpected error occurred";
//       }

//       toast.error(errorMessage);
//       hasErrorHandled.current = true; // Mark as handled
//     }
//   }, [loading, error]);

//   return (
//     <div
//       style={{
//         width: "100%",
//         height: "100%",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Form
//         name="login"
//         initialValues={{ remember: true }}
//         style={{ minWidth: "40vw" }}
//         onFinish={onFinish}
//       >
//         <div style={{ display: "flex", justifyContent: "center" }}>
//           <h1>Login</h1>
//         </div>

//         <Form.Item
//           name="email"
//           rules={[
//             { required: true, message: "Please provide email!" },
//             { type: "email", message: "Please enter a valid email address!" },
//           ]}
//         >
//           <Input prefix={<UserOutlined />} placeholder="Email" />
//         </Form.Item>
//         <Form.Item
//           name="password"
//           rules={[{ required: true, message: "Please input your Password!" }]}
//         >
//           <Input
//             prefix={<LockOutlined />}
//             type="password"
//             placeholder="Password"
//           />
//         </Form.Item>
//         <Form.Item>
//           <Flex justify="space-between" align="center">
//             <Form.Item name="remember" valuePropName="checked" noStyle>
//               <Checkbox>Remember me</Checkbox>
//             </Form.Item>
//             <a href="">Forgot password</a>
//           </Flex>
//         </Form.Item>

//         <Form.Item>
//           <Button block type="primary" htmlType="submit">
//             Log in
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default Login;


// ! NEW
import React, { useEffect, useRef } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Flex,
  Card,
  Typography,
  Divider,
  Space,
} from "antd";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/authSlice";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const hasErrorHandled = useRef(false);

  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
    dispatch(loginUser({ email: values.email, password: values.password }));
  };

  if (!loading) {
    console.log("user", user);
    if (user?.role == "admin") {
      navigate("/admin/task-management");
    } else {
      navigate("/user/dashboard");
    }
  }

  useEffect(() => {
    if (!loading && error && !hasErrorHandled.current) {
      console.log("error", error);
      let errorMessage: string;

      if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object" && "message" in error) {
        errorMessage = (error as { message: string }).message;
      } else {
        errorMessage = "An unexpected error occurred";
      }

      toast.error(errorMessage);
      hasErrorHandled.current = true;
    }
  }, [loading, error]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <Card
        hoverable
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        }}
        bodyStyle={{ padding: "32px" }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <Title level={3} style={{ marginBottom: "8px", color: "#1890ff" }}>
              Welcome Back
            </Title>
            <Text type="secondary">Please login to your account</Text>
          </div>

          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please provide email!" },
                {
                  type: "email",
                  message: "Please enter a valid email address!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Enter your email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Enter your password"
                size="large"
              />
            </Form.Item>

            <Flex
              justify="space-between"
              align="center"
              style={{ marginBottom: "24px" }}
            >
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a href="#" style={{ color: "#1890ff" }}>
                Forgot password?
              </a>
            </Flex>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>

          <Divider plain>Or</Divider>

          <div style={{ textAlign: "center" }}>
            <Text type="secondary">Don't have an account? </Text>
            <a href="#" style={{ color: "#1890ff" }}>
              Sign up
            </a>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Login;

