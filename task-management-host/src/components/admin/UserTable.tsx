import React, { useState } from "react";
import { Space, Table, Tag, Input } from "antd";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../DeleteModal";

const { Column, ColumnGroup } = Table;
const { Search } = Input;

interface DataType {
  _id: string;
  firstName: string;
  lastName: string;
  mobileNumber: number;
  address: string;
  isEnabled: boolean;
  role: string;
  email:string
}

interface UserTableProps {
  users: DataType[];
  onDelete: (id: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onDelete }) => {
  // State for controlling the modal visibility
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();
  const [searchText, setSearchText] = React.useState("");

  const filteredData = users.filter((item) =>
    Object.values(item).some(
      (val) =>
        val && val.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search users..."
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <Table<DataType>
        dataSource={filteredData}
        rowKey="_id"
        bordered
        scroll={{ x: true }}
      >
        <ColumnGroup title="Name">
          <Column
            title="First Name"
            dataIndex="firstName"
            key="firstName"
            sorter={(a: DataType, b: DataType) =>
              a.firstName.localeCompare(b.firstName)
            }
            sortDirections={["ascend", "descend"]}
            filterMultiple={false}
            onFilter={(value, record) =>
              record.firstName.includes(value as string)
            }
          />
          <Column
            title="Last Name"
            dataIndex="lastName"
            key="lastName"
            sorter={(a: DataType, b: DataType) =>
              a.lastName.localeCompare(b.lastName)
            }
            sortDirections={["ascend", "descend"]}
          />
        </ColumnGroup>

        <Column
          title="Email"
          dataIndex="email"
          key="email"
          sorter={(a: DataType, b: DataType) =>
            a.email.localeCompare(b.email)
          }
        />

        <Column
          title="Mobile"
          dataIndex="mobileNumber"
          key="mobileNumber"
          sorter={(a: DataType, b: DataType) => a.mobileNumber - b.mobileNumber}
        />

        <Column
          title="Address"
          dataIndex="address"
          key="address"
          sorter={(a: DataType, b: DataType) =>
            a.address.localeCompare(b.address)
          }
          filterMultiple={false}
          onFilter={(value, record) => record.address.includes(value as string)}
        />

        <Column
          title="User Status"
          dataIndex="isEnabled"
          key="isEnabled"
          filters={[
            { text: "Enabled", value: true },
            { text: "Disabled", value: false },
          ]}
          onFilter={(value, record) => record.isEnabled === value}
          render={(isEnabled: boolean) => (
            <Space size="middle">
              {isEnabled ? (
                <Tag bordered={false} color="success">
                  Enabled
                </Tag>
              ) : (
                <Tag bordered={false} color="red">
                  Disabled
                </Tag>
              )}
            </Space>
          )}
        />

        <Column
          title="User Role"
          dataIndex="role"
          key="role"
          filters={[
            { text: "Admin", value: "admin" },
            { text: "User", value: "user" },
          ]}
          onFilter={(value, record) => record.role === value}
          render={(role: string) => (
            <Space size="middle">
              {role === "admin" ? (
                <Tag color="#f50">{role}</Tag>
              ) : (
                <Tag color="#87d068">{role}</Tag>
              )}
            </Space>
          )}
        />

        {/* <Column
          title="Action"
          key="action"
          render={(_: any, record: DataType) => (
            <Space size="middle">
              <a
                onClick={() =>
                  navigate(`/admin/user-management/edit-user/${record._id}`)
                }
              >
                Edit
              </a>
              <a onClick={() => onDelete(record._id)}>Delete</a>
            </Space>
          )}
        /> */}

        {/* //! */}

        <Column
          title="Action"
          key="action"
          render={(_: any, record: DataType) => (
            <Space size="middle">
              <a
                onClick={() =>
                  navigate(`/admin/user-management/edit-user/${record._id}`)
                }
              >
                Edit
              </a>
              
              <DeleteModal
                buttonText="Delete"
                buttonType="text"
                danger
                onConfirm={() => onDelete(record._id)}
              />
            </Space>
          )}
        />
      </Table>
    </>
  );
};

export default UserTable;

// !old - worked properly
// import React from "react";
// import { Space, Table, Tag } from "antd";
// import { useNavigate } from "react-router-dom";

// const { Column, ColumnGroup } = Table;

// interface DataType {
//   // key: React.Key;
//   _id: string;
//   firstName: string;
//   lastName: string;
//   mobileNumber: number;
//   address: string;
//   isEnabled: boolean;
//   // tags: string[];
// }

// interface UserTableProps {
//   users: DataType[];
//   onDelete: any;
// }

// const UserTable: React.FC<UserTableProps> = ({ users, onDelete }) => {
//   const navigate = useNavigate();

//   // const data: DataType[] = [
//   //   {
//   //     key: "1",
//   //     firstName: "John",
//   //     lastName: "Brown",
//   //     age: 32,
//   //     address: "New York No. 1 Lake Park",
//   //     tags: ["nice", "developer"],
//   //   },
//   //   {
//   //     key: "2",
//   //     firstName: "Jim",
//   //     lastName: "Green",
//   //     age: 42,
//   //     address: "London No. 1 Lake Park",
//   //     tags: ["loser"],
//   //   },
//   //   {
//   //     key: "3",
//   //     firstName: "Joe",
//   //     lastName: "Black",
//   //     age: 32,
//   //     address: "Sydney No. 1 Lake Park",
//   //     tags: ["cool", "teacher"],
//   //   },
//   // ];

//   const data: DataType[] = users;

//   // console.log("data", data.isEnabled);

//   return (
//     <Table<DataType> dataSource={data}>
//       <ColumnGroup title="Name">
//         <Column title="First Name" dataIndex="firstName" key="firstName" />
//         <Column title="Last Name" dataIndex="lastName" key="lastName" />
//       </ColumnGroup>
//       <Column title="Mobile" dataIndex="mobileNumber" key="mobileNumber" />
//       <Column title="Address" dataIndex="address" key="address" />

//       <Column
//         title="User Status"
//         dataIndex="isEnabled"
//         key="isEnabled"
//         render={(_: any, record) => (
//           <Space size="middle">
//             {record.isEnabled == true ? (
//               <Tag bordered={false} color="success">
//                 Enabled
//               </Tag>
//             ) : (
//               <Tag bordered={false} color="red">
//                 Disabled
//               </Tag>
//             )}
//           </Space>
//         )}
//       />

//       <Column
//         title="User Role"
//         dataIndex="role"
//         key="role"
//         render={(_: any, record) => (
//           <Space size="middle">
//             {record.role == "admin" ? (
//               <Tag color="#f50">{record.role}</Tag>
//             ) : (
//               <Tag color="#87d068">{record.role}</Tag>
//             )}
//           </Space>
//         )}
//       />

//       <Column
//         title="Action"
//         key="edit"
//         render={(_: any, record: DataType) => (
//           <Space size="middle">
//             {/* <a>Invite {record.lastName}</a> */}
//             <a
//               onClick={() =>
//                 navigate(`/admin/user-management/edit-user/${record._id}`)
//               }
//             >
//               Edit
//             </a>
//           </Space>
//         )}
//       />
//       <Column
//         title="Action"
//         key="delete"
//         render={(_: any, record: DataType) => (
//           <Space size="middle">
//             <a onClick={() => onDelete(record._id)}>Delete</a>
//           </Space>
//         )}
//       />
//     </Table>
//   );
// };

// export default UserTable;
