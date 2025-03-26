
import React from "react";
import { Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import DeleteModal from "../DeleteModal";


interface DataType {
  _id: string | number; // Accept both types
  taskName: string;
  description: string;
  startDate: string;
  endDate: string;
  isEnabled: boolean;
  isCompleted: boolean;
  completionDate: string;
  assignedTo: AssignedTo;
}

interface TaskTableProps {
  tasks: any;
  onDelete: any;
}

interface AssignedTo {
  firstName: string;
  lastName: string;
}

interface RecordType {
  assignedTo: AssignedTo;
  // Add other properties of `record` if needed
}



const TaskTable: React.FC<TaskTableProps> = ({ tasks, onDelete }) => {
  const navigate = useNavigate();

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Task Name",
      dataIndex: "taskName",
      key: "taskName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (_, record) => (
        <Space size="middle">
          {record?.description == null ? (
            <Tag color="red">No Description</Tag>
          ) : (
            <p>{record?.description}</p>
          )}
        </Space>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (_, record) => {
        // Create a Date object
        const date = new Date(record.startDate);
        const formattedDate = format(date, "EEE MMM dd yyyy"); // "Tue Mar 19 2025"

        return <p>{formattedDate}</p>;
      },
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (_, record) => {
        // Create a Date object
        const date = new Date(record?.endDate);
        const formattedDate = format(date, "EEE MMM dd yyyy"); // "Tue Mar 19 2025"

        return <p>{formattedDate}</p>;
      },
    },
    {
      title: "Assignee",
      dataIndex: "assignee",
      key: "assignee",
      render: (_, record: RecordType) => (
        <p>{` ${record.assignedTo?.firstName} ${record.assignedTo?.lastName}`}</p>
      ),
    },

    {
      title: "Enabled/Disabled",
      key: "isEnabled",
      dataIndex: "isEnabled",
      render: (_: any, record) => (
        <Space size="middle">
          {record?.isEnabled == true ? (
            <Tag bordered={false} color="success">
              Enabled
            </Tag>
          ) : (
            <Tag bordered={false} color="red">
              Disabled
            </Tag>
          )}
        </Space>
      ),
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
          return <p>{formattedDate}</p>;
        }
      },
    },
    {
      title: "Action",
      key: "edit",
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() =>
              navigate(`/admin/task-management/edit-task/${record._id}`)
            }
          >
            Edit
          </a>
        </Space>
      ),
    },
    {
      title: "Action",
      key: "delete",
      render: (_, record) => (
        <Space size="middle">
          {/* <a onClick={() => onDelete(record._id)}>Delete</a> */}
          <DeleteModal
            buttonText="Delete"
            buttonType="text"
            danger
            onConfirm={() => onDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  const data: DataType[] = tasks;

  return <Table<DataType> columns={columns} dataSource={data} />;
};

export default TaskTable;
