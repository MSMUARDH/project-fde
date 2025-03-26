import {
  Layout,
  Typography,
  Row,
  Col,
  Button,
  Card,
  Space,
  Divider
} from "antd";
import {
  CheckCircleOutlined,
  TeamOutlined,
  BarChartOutlined,
  SyncOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const features = [
  {
    title: "Task Tracking",
    icon: (
      <CheckCircleOutlined style={{ fontSize: "32px", color: "#1890ff" }} />
    ),
    description:
      "Easily create, assign, and track tasks with our intuitive interface.",
  },
  {
    title: "Team Collaboration",
    icon: <TeamOutlined style={{ fontSize: "32px", color: "#1890ff" }} />,
    description: "Work seamlessly with your team members in real-time.",
  },
  {
    title: "Progress Analytics",
    icon: <BarChartOutlined style={{ fontSize: "32px", color: "#1890ff" }} />,
    description: "Get insights into your productivity with detailed reports.",
  },
  {
    title: "Automation",
    icon: <SyncOutlined style={{ fontSize: "32px", color: "#1890ff" }} />,
    description: "Automate repetitive tasks and focus on what matters.",
  },
];



const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Space align="center">
              <ThunderboltOutlined
                style={{ fontSize: "24px", color: "#1890ff" }}
              />
              <Title level={4} style={{ marginBottom: 40 }}>
                TaskFlow
              </Title>
            </Space>
          </Col>
        </Row>
      </Header>

      <Content style={{ padding: "0 50px" }}>
        {/* Hero Section */}
        <div style={{ padding: "80px 0", textAlign: "center" }}>
          <Title level={1} style={{ fontSize: "48px", marginBottom: "20px" }}>
            Organize, Prioritize, and Get Work Done
          </Title>
          <Paragraph
            style={{
              fontSize: "18px",
              maxWidth: "700px",
              margin: "0 auto 40px",
            }}
          >
            TaskFlow helps teams of all sizes track work, manage projects, and
            stay organized
          </Paragraph>
          <Space size="large">
            <Button onClick={() => navigate('/login')} type="primary" size="large">
              Get Started!
            </Button>
          </Space>
          <div style={{ marginTop: "40px" }}>
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
              alt="Task Management Dashboard"
              style={{
                maxWidth: "100%",
                borderRadius: "8px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
              }}
            />
          </div>
        </div>

        {/* Features Section */}
        <Divider>
          <Title level={2}>Powerful Features</Title>
        </Divider>
        <Row
          gutter={[32, 32]}
          justify="center"
          style={{ marginBottom: "60px" }}
        >
          {features.map((feature, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card hoverable style={{ textAlign: "center", height: "100%" }}>
                {feature.icon}
                <Title level={4} style={{ marginTop: "16px" }}>
                  {feature.title}
                </Title>
                <Paragraph type="secondary">{feature.description}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default LandingPage;
