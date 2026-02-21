import React, { useState, useMemo } from 'react';
import { Layout, Menu, theme, Avatar, Dropdown, Tag, Modal, Form, Input, message, Switch, Divider } from 'antd';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeOutlined, 
  LogoutOutlined, 
  UserOutlined,
  EditOutlined,
  SettingOutlined,
  LockOutlined,
  BellOutlined
} from '@ant-design/icons';
import { authApi } from '../../utils/api';
import styles from './index.less';

const { Header, Content, Sider } = Layout;

const BasicLayout: React.FC = () => {
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG, colorPrimary },
  } = theme.useToken();

  console.log('[BasicLayout] 渲染, path:', location.pathname);

  const user = localStorage.getItem('currentUser');
  const userData = user ? JSON.parse(user) : null;
  const navigate = useNavigate();
  const isAdmin = userData?.role === 'admin';

  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotify: false,
    darkMode: false
  });

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const handleProfileClick = () => {
    profileForm.setFieldsValue({
      username: userData?.username,
    });
    setProfileModalVisible(true);
  };

  const handleSettingsClick = () => {
    setSettingsModalVisible(true);
  };

  const handleProfileSubmit = async (values: any) => {
    try {
      const response = await authApi.updateProfile(values.username);
      if (response.success) {
        const updatedUser = { ...userData, username: values.username };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        message.success('个人信息更新成功');
        setProfileModalVisible(false);
        window.location.reload();
      }
    } catch (error: any) {
      message.error(error.message || '更新失败');
    }
  };

  const handlePasswordSubmit = async (values: any) => {
    try {
      const response = await authApi.changePassword(values.oldPassword, values.newPassword);
      if (response.success) {
        message.success('密码修改成功');
        passwordForm.resetFields();
      }
    } catch (error: any) {
      message.error(error.message || '修改失败');
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  const handleUserMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'logout':
        handleLogout();
        break;
      case 'profile':
        handleProfileClick();
        break;
      case 'settings':
        handleSettingsClick();
        break;
    }
  };

  const menuItems = useMemo(() => {
    return [
      {
        key: '/hotel/list',
        icon: <HomeOutlined />,
        label: <Link to="/hotel/list">酒店列表</Link>,
      },
      {
        key: '/hotel/add',
        icon: <EditOutlined />,
        label: <Link to="/hotel/list?action=add">酒店录入</Link>,
      },
    ];
  }, []);

  const getSelectedKeys = () => {
    const path = location.pathname;
    const action = new URLSearchParams(location.search).get('action');
    if (path === '/hotel/list' && action === 'add') {
      return ['/hotel/add'];
    }
    return [path];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        theme="light" 
        width={240} 
        style={{ 
          borderRight: '1px solid #f0f0f0',
          boxShadow: '2px 0 8px rgba(0,0,0,0.05)'
        }}
      >
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <HomeOutlined style={{ fontSize: 28, color: colorPrimary }} />
          </div>
          <h2>酒店管理系统</h2>
        </div>
        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={['/hotel']}
          items={menuItems}
          style={{ 
            borderRight: 'none',
            marginTop: 8
          }}
        />
        <div className={styles.siderFooter}>
          <div className={styles.roleInfo}>
            <Tag color={isAdmin ? 'blue' : 'green'}>
              {isAdmin ? '管理员' : '商户'}
            </Tag>
          </div>
        </div>
      </Sider>
      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: colorBgContainer, 
          display: 'flex', 
          justifyContent: 'flex-end',
          alignItems: 'center',
          borderBottom: '1px solid #f0f0f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          height: 64
        }}>
          <div className={styles.headerRight}>
            {userData && (
              <Dropdown
                menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
                placement="bottomRight"
                trigger={['click']}
              >
                <div className={styles.userInfo}>
                  <Avatar 
                    size={36} 
                    icon={<UserOutlined />}
                    style={{ backgroundColor: colorPrimary }}
                  />
                  <div className={styles.userDetails}>
                    <span className={styles.userName}>{userData.username}</span>
                    <span className={styles.userRole}>
                      {isAdmin ? '管理员' : '商户'}
                    </span>
                  </div>
                </div>
              </Dropdown>
            )}
          </div>
        </Header>
        <Content 
          style={{ 
            margin: 0,
            minHeight: 'calc(100vh - 64px)',
            background: '#f5f7fa'
          }}
        >
          <div style={{ 
            padding: 24,
            minHeight: 'calc(100vh - 64px - 48px)'
          }}>
            <div style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              padding: 24,
              minHeight: 'calc(100vh - 64px - 48px - 48px)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
            }}>
              <Outlet />
            </div>
          </div>
        </Content>
      </Layout>

      <Modal
        title="个人中心"
        open={profileModalVisible}
        onCancel={() => setProfileModalVisible(false)}
        footer={null}
        width={500}
      >
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: colorPrimary }} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>{userData?.username}</div>
              <Tag color={isAdmin ? 'blue' : 'green'} style={{ marginTop: 4 }}>
                {isAdmin ? '管理员' : '商户'}
              </Tag>
            </div>
          </div>
        </div>

        <Divider>修改用户名</Divider>
        <Form form={profileForm} layout="vertical" onFinish={handleProfileSubmit}>
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item>
            <button type="submit" style={{
              width: '100%',
              height: 40,
              background: colorPrimary,
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14
            }}>
              保存修改
            </button>
          </Form.Item>
        </Form>

        <Divider>修改密码</Divider>
        <Form form={passwordForm} layout="vertical" onFinish={handlePasswordSubmit}>
          <Form.Item
            name="oldPassword"
            label="原密码"
            rules={[{ required: true, message: '请输入原密码' }]}
          >
            <Input.Password placeholder="请输入原密码" prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少6位' }
            ]}
          >
            <Input.Password placeholder="请输入新密码" prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请确认新密码" prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item>
            <button type="submit" style={{
              width: '100%',
              height: 40,
              background: '#52c41a',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14
            }}>
              修改密码
            </button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="系统设置"
        open={settingsModalVisible}
        onCancel={() => setSettingsModalVisible(false)}
        footer={null}
        width={500}
      >
        <div className={styles.settingsItem}>
          <div className={styles.settingsLabel}>
            <BellOutlined style={{ marginRight: 8 }} />
            <span>系统通知</span>
          </div>
          <Switch 
            checked={settings.notifications} 
            onChange={(checked) => setSettings({ ...settings, notifications: checked })}
          />
        </div>
        <div className={styles.settingsItem}>
          <div className={styles.settingsLabel}>
            <BellOutlined style={{ marginRight: 8 }} />
            <span>邮件通知</span>
          </div>
          <Switch 
            checked={settings.emailNotify} 
            onChange={(checked) => setSettings({ ...settings, emailNotify: checked })}
          />
        </div>
        <Divider />
        <div style={{ color: '#8c8c8c', fontSize: 12 }}>
          <p>• 系统通知：开启后将接收系统消息提醒</p>
          <p>• 邮件通知：开启后将通过邮件接收重要通知</p>
        </div>
      </Modal>
    </Layout>
  );
};

export default BasicLayout;
