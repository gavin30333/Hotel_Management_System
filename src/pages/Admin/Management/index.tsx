import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, message, Card, Popconfirm, Modal, Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { adminApi } from '../../../utils/api';

interface AdminUser {
  _id: string;
  username: string;
  role: string;
  status: 'active' | 'suspended';
  createdAt: string;
}

const AdminManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AdminUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleCreateAdmin = async (values: any) => {
    try {
      const response = await adminApi.createAdmin(values.username, values.password);
      if (response.success) {
        message.success('创建管理员成功');
        setIsModalOpen(false);
        form.resetFields();
        fetchData();
      }
    } catch (error: any) {
      message.error(error.message || '创建管理员失败');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getAdmins();
      if (response.success) {
        setData(response.data || []);
      }
    } catch (error: any) {
      message.error(error.message || '获取管理员列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const response = await adminApi.updateStatus(id, newStatus);
      if (response.success) {
        message.success('状态更新成功');
        fetchData(); // 重新加载数据
      }
    } catch (error: any) {
      message.error(error.message || '更新状态失败');
    }
  };

  const columns: ColumnsType<AdminUser> = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'super_admin' ? 'gold' : 'blue'}>
          {role === 'super_admin' ? '超级管理员' : '普通管理员'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '正常' : '已挂起'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.role !== 'super_admin' && (
            <Popconfirm
              title={`确定要${record.status === 'active' ? '挂起' : '激活'}该管理员吗？`}
              onConfirm={() => handleStatusChange(record._id, record.status)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" danger={record.status === 'active'}>
                {record.status === 'active' ? '挂起' : '激活'}
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card title="管理员管理" bordered={false}>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          创建管理员
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title="创建管理员"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateAdmin}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AdminManagement;
