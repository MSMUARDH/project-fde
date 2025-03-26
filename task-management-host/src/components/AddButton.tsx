import React from "react";
import { Button } from "antd";
import { ButtonProps } from "antd/es/button";
import { PlusOutlined } from "@ant-design/icons";

interface CustomButtonProps extends ButtonProps {
  icon?: React.ReactNode;
}

const AddButton: React.FC<CustomButtonProps> = ({
  type = "primary",
  shape = "round",
  icon = <PlusOutlined />,
  size = "large",
  children,
  ...props
}) => {
  return (
    <Button type={type} shape={shape} icon={icon} size={size} {...props}>
      {children}
    </Button>
  );
};

export default AddButton;
