import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Alert, Radio } from 'antd';
import { UserOutlined, LockOutlined, InfoCircleOutlined, SolutionOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { authApi, ApiError } from '../../utils/api';
import styles from './index.less';

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const getErrorMessage = (error: ApiError): string => {
    switch (error.status) {
      case 400:
        return error.message || '用户名已存在';
      case 401:
        return '认证失败';
      case 500:
        return '服务器错误，请稍后重试';
      default:
        return error.message || '注册失败，请重试';
    }
  };
  const onFinish = async (values: any) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await authApi.register(values.username, values.password, values.role);
      
      if (response.success && response.data) {
        const userData = {
          id: response.data.user.id,
          username: response.data.user.username,
          role: response.data.user.role,
          token: response.data.token,
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        message.success('注册成功，欢迎加入！');
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
          <p>创建您的账户</p>
        </div>

        <div className={styles.formTip}>
          <InfoCircleOutlined className={styles.icon} />
          <span>注册成功后将自动登录</span>
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
          name="register"
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 2, max: 20, message: '用户名长度为2-20个字符' },
            ]}
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
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码长度不能少于6位' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#999' }} />}
              placeholder="请输入密码"
              className={styles.inputField}
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#999' }} />}
              placeholder="请确认密码"
              className={styles.inputField}
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="role"
            initialValue="merchant"
            rules={[{ required: true, message: '请选择注册角色' }]}
          >
            <Radio.Group className={styles.roleGroup}>
              <Radio.Button value="merchant">
                <SolutionOutlined /> 酒店商户
              </Radio.Button>
              <Radio.Button value="admin">
                <UserOutlined /> 系统管理员
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block
              className={styles.loginButton}
            >
              {loading ? '注册中...' : '注册'}
            </Button>
          </Form.Item>

          <div className={styles.footer}>
            已有账户？
            <Link to="/login">立即登录</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
