import React from "react";
import { Switch } from "antd";

interface ToggleSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "small" | "default";
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked = false,
  onChange,
  disabled = false,
  size = "default",
  ...props
}) => {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      size={size}
      {...props}
    />
  );
};

export default ToggleSwitch;
