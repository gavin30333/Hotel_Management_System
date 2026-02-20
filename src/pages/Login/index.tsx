import React, { useState } from 'react';
import { Form, Input, Button, Card, Select, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {Link, useNavigate} from 'react-router-dom'
import { authApi } from '../../utils/api';
import styles from './index.less';

const { Option } = Select;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await authApi.login(values.username, values.password, values.role);
      
      if (response.success && response.data) {
        const userData = {
          id: response.data.user.id,
          username: response.data.user.username,
          role: response.data.user.role,
          token: response.data.token,
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        message.success('登录成功');
        navigate('/hotel/list');
      }
    } catch (error: any) {
      message.error(error.message || '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Card className={styles.loginCard}>
        <div className={styles.header}>
          <h1>酒店后台管理系统</h1>
          <p>欢迎回来，请登录您的账户</p>
        </div>
        
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="请输入用户名" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
            />
          </Form.Item>

          <Form.Item
            name="role"
            rules={[{ required: true, message: '请选择角色' }]}
            initialValue="merchant"
          >
            <Select placeholder="请选择角色">
              <Option value="merchant">商户</Option>
              <Option value="admin">管理员</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block
              size="large"
            >
              登录
            </Button>
          </Form.Item>

          <div className={styles.footer}>
            还没有账户？
            <Link to="/register">立即注册</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
