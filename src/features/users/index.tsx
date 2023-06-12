import React, { Suspense } from 'react'
import {Table, Button} from 'antd'
import styles from './index.module.css'
import { useUsers, onHideUsers } from 'state'
import { UserItem } from 'api/githubAPI'
const UsersListLoaded = () => {
  const { users } = useUsers()
  return <Table
        
        dataSource={users}
        className={styles.table}
        rowKey="id"
        scroll={{ y: 'calc(100vh - 280px)' }}
        columns={[
          { title: "User Name", dataIndex: "displayName" },
          { title: "Email", dataIndex: "email" },
          {
            title: "User Role",
            dataIndex: "role",
            render: (_, record: UserItem) => (
              <span>
                {record.role === "SUPER_ADMIN" ? "Super Admin" : "Viewer"}
              </span>
            ),
          },
        ]}
        pagination={false}
      />
}

const UsersList = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <div style={{ display: 'flex' }}>
      <button
        type="button"
        className="pure-button pure-button-primary"
        style={{ marginLeft: 5 }}
        onClick={onHideUsers}
      >
        back
      </button>
    </div>
    <UsersListLoaded />
  </Suspense>
)
export default UsersList
