import React from "react";
import { Result, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleGoHome = () => {
    navigate("/"); // Navigate to the home page
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
      <Result
        status="403"
        title={<Title level={2}>403 - Unauthorized</Title>}
        subTitle={
          <Paragraph type="secondary">
            Sorry, you are not authorized to access this page.
          </Paragraph>
        }
        extra={[
          <Button type="primary" key="goBack" onClick={handleGoBack}>
            Go Back
          </Button>,
          <Button key="goHome" onClick={handleGoHome}>
            Go Home
          </Button>,
        ]}
      />
    </div>
  );
};

export default Unauthorized;
