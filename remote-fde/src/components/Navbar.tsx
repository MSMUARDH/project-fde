import React, {useState } from "react";
import { Button, Grid, Menu, Space, theme } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { logout } from "../features/authSlice";

const { useToken } = theme;
const { useBreakpoint } = Grid;

export default function Navbar() {
  const navigate = useNavigate();
  const { token } = useToken();
  const screens = useBreakpoint();

    const dispatch = useDispatch<AppDispatch>();

  const [current, setCurrent] = useState<string>(
    location.pathname == "/admin/task-management"
      ? "/admin/task-management"
      : "/admin/user-management"
  );

  const menuItems: MenuProps["items"] = [
    {
      label: "Task Managment",
      key: "/admin/task-management",
    },
    {
      label: "User Management",
      key: "/admin/user-management",
    },
  ];

  const onClick: MenuProps["onClick"] = (e) => {
    // console.log("click ", e);
    setCurrent(e.key);
    navigate(e.key, { replace: true });
  };



  const styles: Record<string, React.CSSProperties> = {
    container: {
      alignItems: "center",
      display: "flex",
      justifyContent: "space-between",
      margin: "0 auto",
      maxWidth: token.screenXL,
      padding: screens.md
        ? `0px ${token.paddingLG}px`
        : `0px ${token.padding}px`,
    },
    header: {
      backgroundColor: token.colorBgContainer,
      borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
      position: "relative",
    },
    logo: {
      display: "block",
      height: token.sizeLG,
      left: "50%",
      position: screens.md ? "static" : "absolute",
      top: "50%",
      transform: screens.md ? " " : "translate(-50%, -50%)",
    },
    menu: {
      backgroundColor: "transparent",
      borderBottom: "none",
      lineHeight: screens.sm ? "4rem" : "3.5rem",
      marginLeft: screens.md ? "0px" : `-${token.size}px`,
      width: screens.md ? "inherit" : token.sizeXXL,
    },
    menuContainer: {
      alignItems: "center",
      display: "flex",
      gap: token.size,
      width: "100%",
    },
  };

  return (
    <nav style={styles.header}>
      <div style={styles.container}>
        <div style={styles.menuContainer}>
          <a style={styles.logo} href="#">
            {/* <Logo showText={true} /> */}
          </a>
          <Menu
            style={styles.menu}
            mode="horizontal"
            items={menuItems}
            onClick={onClick}
            selectedKeys={screens.md ? [current] : []}
            overflowedIndicator={<Button type="text" icon={<MenuOutlined />} />}
          />
        </div>
        <Space>
          {screens.md ? localStorage.getItem("token") ? <Button type="primary" color="danger" onClick={() => {
            dispatch(logout())
            navigate('/login')
          }}>Log Out</Button> :<Button type="text">Log in</Button> : null}
        </Space>
      </div>
    </nav>
  );
}
