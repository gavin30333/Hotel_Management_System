import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Space, 
  Tag, 
  Select, 
  Input, 
  message, 
  Modal, 
  Popconfirm,
  Image,
  Descriptions,
  Drawer,
  Tabs,
  Typography,
  Row,
  Col
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  EyeOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  UploadOutlined,
  StopOutlined,
  EnvironmentOutlined,
  StarFilled,
  PercentageOutlined,
  CarOutlined,
  ShopOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import HotelEditModal from '../components/HotelEditModal';
import SearchSection from './SearchSection';
import { hotelApi } from '../../../utils/api';
import styles from './index.less';

const { Option } = Select;
const { TabPane } = Tabs;
const { Text, Title } = Typography;

const HotelListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [starFilter, setStarFilter] = useState<string>('all');
  const [keyword, setKeyword] = useState<string>('');
  const [auditModalVisible, setAuditModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [currentHotel, setCurrentHotel] = useState<Hotel | null>(null);
  const [auditReason, setAuditReason] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const user = localStorage.getItem('currentUser');
  const userData = user ? JSON.parse(user) : { role: 'merchant' };
  const isAdmin = userData.role === 'admin' || userData.role === 'super_admin';

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    try {
      const response = await hotelApi.getList({
        page: pagination.current,
        pageSize: pagination.pageSize,
        status: statusFilter,
        starRating: starFilter,
        keyword: keyword,
      });

      if (response.success && response.data) {
        setHotels(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.total || 0,
        }));
      }
    } catch (error: any) {
      message.error(error.message || '获取酒店列表失败');
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, statusFilter, starFilter, keyword]);

  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'add') {
      setCurrentHotel(null);
      setEditModalVisible(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  // useEffect 依赖 fetchHotels
  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const getStatusTag = (status: string, auditStatus?: string) => {
    // 优先判断 Pending 状态
    if (status === 'pending') {
      return <Tag color="orange">待审核</Tag>;
    }
    
    // 判断 Rejected 状态 (Status 为 rejected 或 auditStatus 为 rejected)
    if (status === 'rejected' || auditStatus === 'rejected') {
      return <Tag color="red">审核驳回</Tag>;
    }

    const statusMap: Record<string, { color: string; text: string }> = {
      draft: { color: 'default', text: '草稿' },
      online: { color: 'green', text: '已上线' },
      offline: { color: 'red', text: '已下线' },
      rejected: { color: 'red', text: '审核驳回' },
    };
    
    const statusConfig = statusMap[status];
    if (statusConfig) {
      return <Tag color={statusConfig.color}>{statusConfig.text}</Tag>;
    }

    return <Tag>未知</Tag>;
  };

  const getStarDisplay = (starRating: number) => (
    <span>
      {Array.from({ length: starRating }).map((_, i) => (
        <StarFilled key={i} style={{ color: '#faad14', fontSize: 12 }} />
      ))}
    </span>
  );

  const confirmAudit = async (hotel: Hotel, passed: boolean, reason?: string) => {
    setLoading(true);
    try {
      const response = await hotelApi.audit(hotel._id, passed, reason);
      if (response.success) {
        message.success(passed ? '审核通过，酒店已上线' : '审核驳回');
        setAuditModalVisible(false);
        fetchHotels();
      }
    } catch (error: any) {
      message.error(error.message || '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleAudit = (hotel: Hotel, type: 'pass' | 'reject') => {
    setCurrentHotel(hotel);
    if (type === 'reject') {
      setAuditModalVisible(true);
      setAuditReason('');
    } else {
      confirmAudit(hotel, true);
    }
  };

  const handlePublish = async (hotel: Hotel) => {
    setLoading(true);
    try {
      const response = await hotelApi.submitForAudit(hotel._id);
      if (response.success) {
        message.success('已提交审核');
        fetchHotels();
      }
    } catch (error: any) {
      message.error(error.message || '提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOnline = async (hotel: Hotel) => {
    setLoading(true);
    try {
      const response = await hotelApi.toggleOnline(hotel._id);
      if (response.success) {
        const isOnline = hotel.status === 'online';
        message.success(isOnline ? '酒店已下线' : '酒店已重新上线');
        fetchHotels();
      }
    } catch (error: any) {
      message.error(error.message || '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const response = await hotelApi.delete(id);
      if (response.success) {
        message.success('酒店删除成功');
        fetchHotels();
      }
    } catch (error: any) {
      message.error(error.message || '删除失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hotel?: Hotel) => {
    setCurrentHotel(hotel || null);
    setEditModalVisible(true);
  };

  const handleEditOk = async (hotelData: Partial<Hotel>) => {
    setLoading(true);
    try {
      let response;
      if (currentHotel?._id) {
        response = await hotelApi.update(currentHotel._id, hotelData);
        message.success('酒店信息更新成功');
      } else {
        response = await hotelApi.create(hotelData);
        message.success('酒店添加成功');
      }
      
      if (response?.success) {
        setEditModalVisible(false);
        fetchHotels();
      }
    } catch (error: any) {
      message.error(error.message || '保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (hotel: Hotel) => {
    try {
      const response = await hotelApi.getById(hotel._id);
      if (response.success && response.data) {
        setCurrentHotel(response.data);
        setDetailDrawerVisible(true);
      }
    } catch (error: any) {
      message.error(error.message || '获取详情失败');
    }
  };

  const renderPriceRange = (roomTypes?: RoomType[]) => {
    if (!roomTypes || roomTypes.length === 0) return '-';
    const prices = roomTypes.map(r => r.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? `¥${min}` : `¥${min} - ¥${max}`;
  };

  const columns = [
    {
      title: '酒店信息',
      key: 'info',
      width: 280,
      render: (_: any, record: Hotel) => (
        <div className={styles.hotelInfo}>
          <div className={styles.hotelImage}>
            {record.images?.[0] ? (
              <Image
                width={80}
                height={60}
                src={record.images[0]}
                style={{ borderRadius: 8, objectFit: 'cover' }}
                preview={false}
              />
            ) : (
              <div className={styles.noImage}>暂无图片</div>
            )}
          </div>
          <div className={styles.hotelDetails}>
            <div className={styles.hotelName}>
              <Text strong>{record.name}</Text>
              {record.nameEn && (
                <Text type="secondary" style={{ fontSize: 12, marginLeft: 4 }}>
                  ({record.nameEn})
                </Text>
              )}
            </div>
            <div className={styles.hotelMeta}>
              {getStarDisplay(record.starRating)}
              <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
                <EnvironmentOutlined /> {record.address}
              </Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '房型价格',
      key: 'price',
      width: 120,
      render: (_: any, record: Hotel) => (
        <div>
          <Text strong style={{ color: '#f5222d', fontSize: 16 }}>
            {renderPriceRange(record.roomTypes)}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}> /晚</Text>
          {record.discounts && record.discounts.length > 0 && (
            <div>
              <Tag color="orange" style={{ marginTop: 4 }}>
                <PercentageOutlined /> {record.discounts.length}个优惠
              </Tag>
            </div>
          )}
        </div>
      ),
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_: any, record: Hotel) => getStatusTag(record.status, record.auditStatus),
    },
    {
      title: '开业时间',
      dataIndex: 'openingDate',
      key: 'openingDate',
      width: 110,
      render: (text: string) => text || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (text: string) => text ? new Date(text).toLocaleString() : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right' as const,
      render: (_: any, record: Hotel) => {
        // 状态判定逻辑
        const isPending = record.status === 'pending';
        const isOnline = record.status === 'online';
        const isOffline = record.status === 'offline';
        const isRejected = record.status === 'rejected' || (!isPending && record.auditStatus === 'rejected');
        const isDraft = record.status === 'draft' && !isRejected;

        // 权限判定逻辑
        // 编辑权限: 
        // Admin: 全状态可编辑 (Draft, Pending, Online, Offline, Rejected)
        // Merchant: 仅 Draft, Offline, Rejected 可编辑
        const canEdit = isAdmin || (isDraft || isOffline || isRejected);

        // 删除权限:
        // Admin: 全状态可删除 (需二次确认)
        // Merchant: 仅 Draft, Offline, Rejected 可删除
        const canDelete = isAdmin || (isDraft || isOffline || isRejected);

        // 提交审核权限: Draft, Rejected, 或 Offline (且需要重新审核)
        // Admin & Merchant 均可
        const canSubmit = isDraft || isRejected || (isOffline && record.auditStatus !== 'passed');

        // 重新上线权限 (直接恢复): Offline 且 Audit Passed
        const canReonline = isOffline && record.auditStatus === 'passed';

        // 审核权限: 仅 Admin 且在 Pending 状态
        const canAudit = isAdmin && isPending;

        // 下线权限: 仅 Online 状态
        const canOffline = isOnline;

        return (
          <Space size="small">
            <Button 
              type="link" 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            >
              详情
            </Button>
            
            {canEdit && (
              <Button 
                type="link" 
                size="small" 
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              >
                编辑
              </Button>
            )}
            
            {canAudit && (
              <>
                <Button 
                  type="link" 
                  size="small" 
                  icon={<CheckCircleOutlined />}
                  style={{ color: '#52c41a' }}
                  onClick={() => handleAudit(record, 'pass')}
                >
                  通过
                </Button>
                <Button 
                  type="link" 
                  size="small" 
                  icon={<CloseCircleOutlined />}
                  style={{ color: '#f5222d' }}
                  onClick={() => handleAudit(record, 'reject')}
                >
                  驳回
                </Button>
              </>
            )}
            
            {canSubmit && (
              <Button 
                type="link" 
                size="small" 
                icon={<UploadOutlined />}
                onClick={() => handlePublish(record)}
              >
                提交审核
              </Button>
            )}

            {canReonline && (
              <Button 
                type="link" 
                size="small" 
                icon={<UploadOutlined />}
                onClick={() => handleToggleOnline(record)}
              >
                重新上线
              </Button>
            )}
            
            {canOffline && (
              <Popconfirm
                title="确定要下线该酒店吗？"
                description="下线后C端不可见，但数据保留"
                onConfirm={() => handleToggleOnline(record)}
                okText="确定"
                cancelText="取消"
              >
                <Button 
                  type="link" 
                  size="small" 
                  icon={<StopOutlined />}
                  style={{ color: '#f5222d' }}
                >
                  下线
                </Button>
              </Popconfirm>
            )}

            {canDelete && (
              <Popconfirm
                title="确定要删除该酒店吗？"
                description="此操作不可恢复，请谨慎操作"
                onConfirm={() => handleDelete(record._id)}
                okText="确定"
                cancelText="取消"
                okButtonProps={{ danger: true }}
              >
                <Button 
                  type="link" 
                  size="small" 
                  icon={<DeleteOutlined />}
                  danger
                >
                  删除
                </Button>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  const renderDetailDrawer = () => {
    if (!currentHotel) return null;

    return (
      <Drawer
        title={
          <Space>
            <span>{currentHotel.name}</span>
            {currentHotel.nameEn && (
              <Text type="secondary">({currentHotel.nameEn})</Text>
            )}
          </Space>
        }
        placement="right"
        width={720}
        onClose={() => setDetailDrawerVisible(false)}
        open={detailDrawerVisible}
      >
        <Tabs defaultActiveKey="basic">
          <TabPane tab="基本信息" key="basic">
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="酒店星级" span={1}>
                {getStarDisplay(currentHotel.starRating)}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话" span={1}>
                {currentHotel.phone}
              </Descriptions.Item>
              <Descriptions.Item label="酒店地址" span={2}>
                {currentHotel.address}
              </Descriptions.Item>
              <Descriptions.Item label="开业时间" span={1}>
                {currentHotel.openingDate || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="状态" span={1}>
                {getStatusTag(currentHotel.status, currentHotel.auditStatus)}
              </Descriptions.Item>
              <Descriptions.Item label="酒店描述" span={2}>
                {currentHotel.description}
              </Descriptions.Item>
              <Descriptions.Item label="酒店设施" span={2}>
                {currentHotel.facilities?.map(f => (
                  <Tag key={f} color="blue">{f}</Tag>
                )) || '-'}
              </Descriptions.Item>
            </Descriptions>

            {currentHotel.images && currentHotel.images.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <Title level={5}>酒店图片</Title>
                <Image.PreviewGroup>
                  <Row gutter={[8, 8]}>
                    {currentHotel.images.map((img, index) => (
                      <Col span={8} key={index}>
                        <Image
                          width="100%"
                          height={120}
                          src={img}
                          style={{ borderRadius: 8, objectFit: 'cover' }}
                        />
                      </Col>
                    ))}
                  </Row>
                </Image.PreviewGroup>
              </div>
            )}
          </TabPane>

          <TabPane tab="房型信息" key="rooms">
            {currentHotel.roomTypes && currentHotel.roomTypes.length > 0 ? (
              <div className={styles.roomList}>
                {currentHotel.roomTypes.map((room, index) => (
                  <Card key={room._id || index} size="small" style={{ marginBottom: 12 }}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Text strong>{room.name}</Text>
                        {room.nameEn && (
                          <Text type="secondary" style={{ marginLeft: 8 }}>({room.nameEn})</Text>
                        )}
                      </Col>
                      <Col span={12} style={{ textAlign: 'right' }}>
                        <Text delete type="secondary">
                          {room.originalPrice ? `¥${room.originalPrice}` : ''}
                        </Text>
                        <Text strong style={{ color: '#f5222d', fontSize: 18, marginLeft: 8 }}>
                          ¥{room.price}
                        </Text>
                        <Text type="secondary">/晚</Text>
                      </Col>
                    </Row>
                    <Row gutter={16} style={{ marginTop: 8 }}>
                      <Col span={6}>
                        <Text type="secondary">面积: </Text>
                        {room.area ? `${room.area}㎡` : '-'}
                      </Col>
                      <Col span={6}>
                        <Text type="secondary">床型: </Text>
                        {room.bedType || '-'}
                      </Col>
                      <Col span={6}>
                        <Text type="secondary">入住: </Text>
                        {room.maxOccupancy ? `${room.maxOccupancy}人` : '-'}
                      </Col>
                      <Col span={6}>
                        <Text type="secondary">早餐: </Text>
                        {room.breakfast !== undefined ? (room.breakfast ? '含' : '不含') : '-'}
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>
            ) : (
              <Text type="secondary">暂无房型信息</Text>
            )}
          </TabPane>

          <TabPane tab="周边信息" key="nearby">
            <Title level={5}>
              <EnvironmentOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              附近热门景点
            </Title>
            {currentHotel.nearbyAttractions && currentHotel.nearbyAttractions.length > 0 ? (
              <div style={{ marginBottom: 24 }}>
                {currentHotel.nearbyAttractions.map((item, index) => (
                  <div key={index} className={styles.nearbyItem}>
                    <Text strong>{item.name}</Text>
                    <Text type="secondary" style={{ marginLeft: 8 }}>{item.distance}</Text>
                    {item.description && (
                      <Text type="secondary" style={{ marginLeft: 8 }}>- {item.description}</Text>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Text type="secondary">暂无景点信息</Text>
            )}

            <Title level={5}>
              <CarOutlined style={{ marginRight: 8, color: '#52c41a' }} />
              交通信息
            </Title>
            {currentHotel.transportations && currentHotel.transportations.length > 0 ? (
              <div style={{ marginBottom: 24 }}>
                {currentHotel.transportations.map((item, index) => (
                  <div key={index} className={styles.nearbyItem}>
                    <Tag color="green">
                      {item.type === 'subway' ? '地铁' : 
                       item.type === 'bus' ? '公交' :
                       item.type === 'airport' ? '机场' :
                       item.type === 'train' ? '火车站' : '其他'}
                    </Tag>
                    <Text strong>{item.name}</Text>
                    <Text type="secondary" style={{ marginLeft: 8 }}>{item.distance}</Text>
                  </div>
                ))}
              </div>
            ) : (
              <Text type="secondary">暂无交通信息</Text>
            )}

            <Title level={5}>
              <ShopOutlined style={{ marginRight: 8, color: '#722ed1' }} />
              周边商场
            </Title>
            {currentHotel.shoppingMalls && currentHotel.shoppingMalls.length > 0 ? (
              <div>
                {currentHotel.shoppingMalls.map((item, index) => (
                  <div key={index} className={styles.nearbyItem}>
                    <Text strong>{item.name}</Text>
                    <Text type="secondary" style={{ marginLeft: 8 }}>{item.distance}</Text>
                    {item.description && (
                      <Text type="secondary" style={{ marginLeft: 8 }}>- {item.description}</Text>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Text type="secondary">暂无商场信息</Text>
            )}
          </TabPane>

          <TabPane tab="优惠活动" key="discounts">
            {currentHotel.discounts && currentHotel.discounts.length > 0 ? (
              <div className={styles.discountList}>
                {currentHotel.discounts.map((discount, index) => (
                  <Card 
                    key={discount._id || index} 
                    size="small" 
                    style={{ marginBottom: 12, background: '#fff7e6', borderColor: '#ffd591' }}
                  >
                    <Row gutter={16}>
                      <Col span={16}>
                        <Text strong style={{ fontSize: 16 }}>{discount.name}</Text>
                        <br />
                        <Text type="secondary">{discount.description}</Text>
                        {discount.conditions && (
                          <>
                            <br />
                            <Tag color="orange">{discount.conditions}</Tag>
                          </>
                        )}
                      </Col>
                      <Col span={8} style={{ textAlign: 'right' }}>
                        {discount.type === 'percentage' ? (
                          <Text strong style={{ color: '#f5222d', fontSize: 24 }}>
                            {discount.value}折
                          </Text>
                        ) : discount.type === 'fixed' ? (
                          <>
                            <Text strong style={{ color: '#f5222d', fontSize: 24 }}>
                              -¥{discount.value}
                            </Text>
                          </>
                        ) : (
                          <Text strong style={{ color: '#f5222d', fontSize: 24 }}>
                            特价
                          </Text>
                        )}
                      </Col>
                    </Row>
                    {discount.startDate && discount.endDate && (
                      <div style={{ marginTop: 8 }}>
                        <Text type="secondary">
                          有效期: {discount.startDate} 至 {discount.endDate}
                        </Text>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Text type="secondary">暂无优惠活动</Text>
            )}
          </TabPane>

          <TabPane tab="入住政策" key="policies">
            {currentHotel.policies ? (
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="入住时间">
                  {currentHotel.policies.checkIn || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="退房时间">
                  {currentHotel.policies.checkOut || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="取消政策">
                  {currentHotel.policies.cancellation || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="加床政策">
                  {currentHotel.policies.extraBed || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="宠物政策">
                  {currentHotel.policies.pets || '-'}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Text type="secondary">暂无入住政策</Text>
            )}
          </TabPane>
        </Tabs>

        {currentHotel.auditStatus === 'rejected' && currentHotel.auditReason && (
          <div style={{ marginTop: 24, padding: 16, background: '#fff1f0', borderRadius: 8 }}>
            <Text type="danger" strong>驳回原因: </Text>
            <Text type="danger">{currentHotel.auditReason}</Text>
          </div>
        )}
      </Drawer>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2>酒店管理</h2>
          <span className={styles.subtitle}>
            共 {pagination.total} 家酒店
            {statusFilter !== 'all' && ` · ${statusFilter === 'draft' ? '草稿' : statusFilter === 'pending' ? '待审核' : statusFilter === 'online' ? '已上线' : '已下线'}`}
          </span>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => handleEdit()}
          size="large"
        >
          新增酒店
        </Button>
      </div>

      <div className={styles.filters}>
        <SearchSection 
          onSearch={(value) => {
            if (value !== keyword) {
              setKeyword(value);
              setPagination(prev => ({ ...prev, current: 1 }));
            }
          }}
        />
        <Select
          defaultValue="all"
          style={{ width: 140 }}
          onChange={(value) => {
            setStatusFilter(value);
            setPagination(prev => ({ ...prev, current: 1 }));
          }}
          placeholder="状态筛选"
        >
          <Option value="all">全部状态</Option>
          <Option value="draft">草稿</Option>
          <Option value="pending">待审核</Option>
          <Option value="online">已上线</Option>
          <Option value="offline">已下线</Option>
        </Select>
        <Select
          defaultValue="all"
          style={{ width: 140 }}
          onChange={(value) => {
            setStarFilter(value);
            setPagination(prev => ({ ...prev, current: 1 }));
          }}
          placeholder="星级筛选"
        >
          <Option value="all">全部星级</Option>
          {[5, 4, 3, 2, 1].map(star => (
            <Option key={star} value={star}>
              {getStarDisplay(star)}
            </Option>
          ))}
        </Select>
      </div>

      <div className={styles.tableWrapper}>
        <Table
          columns={columns}
          dataSource={hotels}
          rowKey="_id"
          loading={loading}
          scroll={{ x: 1300 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            onChange: (page, pageSize) => {
              setPagination(prev => ({ ...prev, current: page, pageSize }));
            },
          }}
        />
      </div>

      <Modal
        title="审核驳回"
        open={auditModalVisible}
        onOk={() => currentHotel && confirmAudit(currentHotel, false, auditReason)}
        onCancel={() => setAuditModalVisible(false)}
        confirmLoading={loading}
        okText="确认驳回"
        cancelText="取消"
      >
        <p>请填写驳回原因：</p>
        <Input.TextArea
          rows={4}
          value={auditReason}
          onChange={(e) => setAuditReason(e.target.value)}
          placeholder="请输入驳回原因，方便商户修改"
        />
      </Modal>

      <HotelEditModal
        visible={editModalVisible}
        hotel={currentHotel}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleEditOk}
        loading={loading}
      />

      {renderDetailDrawer()}
    </div>
  );
};

export default HotelListPage;
