import React from "react";
import { Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import  { EyeFilled } from "@ant-design/icons";

interface DataType {
  _id: string;
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
  completionDate: string;
  endDate: string;
  startDate:string
}

const AssignTaskTable: React.FC = ({ userTasks }) => {
  const navigate = useNavigate();

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Task Name",
      dataIndex: "taskName",
      key: "taskName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (_, record) => {
        // Create a Date object
        const date = new Date(record.startDate);
        const formattedDate = format(date, "EEE MMM dd yyyy"); // "Tue Mar 19 2025"

        return  <Tag color="blue">{formattedDate}</Tag>;
      },
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (_, record) => {
        // Create a Date object
        const date = new Date(record.endDate);
        const formattedDate = format(date, "EEE MMM dd yyyy"); // "Tue Mar 19 2025"

        // return <p>{formattedDate}</p>;
        return <Tag color="purple">{formattedDate}</Tag>;
      },
    },
    {
      title: "Completed Date",
      dataIndex: "completedDate",
      key: "completedDate",
      render: (_: any, record) => {
        // Create a Date object
        const date = new Date(record.completionDate);
        const formattedDate = format(date, "EEE MMM dd yyyy"); // "Tue Mar 19 2025"

        if (record.completionDate == null) {
          return <Tag color="red">Not Completed</Tag>;
        } else {
          return  <Tag color="green">{formattedDate}</Tag>;
        }
      },
    },
    {
      title: "Action",
      key: "edit",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => navigate(`/user/update-completion/${record._id}`)}>
            {/* Update Completion */}
            <EyeFilled
              style={{ fontSize: "30px",  }}
            />
          </a>
        </Space>
      ),
    },
  ];

  const data: DataType[] = userTasks;

  return <Table<DataType> columns={columns} dataSource={data} />;
};

export default AssignTaskTable;

