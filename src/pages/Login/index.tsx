import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Alert } from 'antd';
import { UserOutlined, LockOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { authApi, ApiError } from '../../utils/api';
import styles from './index.less';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const getErrorMessage = (error: ApiError): string => {
    switch (error.status) {
      case 400:
        return '请输入用户名和密码';
      case 401:
        return '用户名或密码错误，请重新输入';
      case 403:
        return '账户已被禁用，请联系管理员';
      case 404:
        return '用户不存在，请检查用户名';
      case 500:
        return '服务器错误，请稍后重试';
      default:
        return error.message || '登录失败，请重试';
    }
  };
  const onFinish = async (values: any) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await authApi.login(values.username, values.password);
      
      if (response.success && response.data) {
        const userData = {
          id: response.data.user.id,
          username: response.data.user.username,
          role: response.data.user.role,
          token: response.data.token,
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        message.success(`欢迎回来，${userData.role === 'admin' ? '管理员' : '商户'} ${userData.username}`);
        navigate('/hotel/list');
      }
    } catch (err: any) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
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

        <div className={styles.formTip}>
          <InfoCircleOutlined className={styles.icon} />
          <span>系统将自动识别您的账户角色</span>
        </div>

        {error && (
          <Alert
            className={styles.errorAlert}
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => setError('')}
          />
        )}

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
              prefix={<UserOutlined style={{ color: '#999' }} />} 
              placeholder="请输入用户名"
              className={styles.inputField}
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#999' }} />}
              placeholder="请输入密码"
              className={styles.inputField}
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block
              className={styles.loginButton}
            >
              {loading ? '登录中...' : '登录'}
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
