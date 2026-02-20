import React, { useState, useEffect } from 'react';
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
  ShopOutlined
} from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import HotelEditModal from '../components/HotelEditModal';
import styles from './index.less';

const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const { Text, Title } = Typography;

const mockHotels: Hotel[] = [
  {
    id: 1,
    name: '阳光大酒店',
    nameEn: 'Sunshine Grand Hotel',
    address: '上海市浦东新区世纪大道100号',
    starRating: 5,
    phone: '021-12345678',
    description: '五星级豪华酒店，提供优质的住宿服务和餐饮体验。酒店拥有各类豪华客房，配备完善的会议设施和健身中心。',
    images: ['https://via.placeholder.com/400x300', 'https://via.placeholder.com/400x300'],
    status: 'online',
    auditStatus: 'passed',
    createTime: '2024-01-01 10:00:00',
    openingDate: '2020-06-15',
    roomTypes: [
      { id: 1, name: '豪华大床房', nameEn: 'Deluxe King Room', price: 688, originalPrice: 888, area: 45, bedType: '大床2.0m', maxOccupancy: 2, breakfast: true },
      { id: 2, name: '行政套房', nameEn: 'Executive Suite', price: 1288, originalPrice: 1588, area: 75, bedType: '大床2.0m', maxOccupancy: 3, breakfast: true },
    ],
    nearbyAttractions: [
      { name: '东方明珠', distance: '1.5公里', description: '上海地标性建筑' },
      { name: '外滩', distance: '2公里', description: '历史风貌区' },
    ],
    transportations: [
      { type: 'subway', name: '地铁2号线陆家嘴站', distance: '500米' },
      { type: 'airport', name: '浦东国际机场', distance: '35公里' },
    ],
    shoppingMalls: [
      { name: '正大广场', distance: '800米', description: '大型购物中心' },
    ],
    discounts: [
      { id: 1, name: '新用户专享', type: 'fixed', value: 100, conditions: '满500可用', description: '新用户首单立减100元' },
    ],
    facilities: ['免费WiFi', '游泳池', '健身房', '停车场', '餐厅', '会议室', 'SPA'],
    policies: {
      checkIn: '14:00后',
      checkOut: '12:00前',
      cancellation: '入住前1天可免费取消',
      extraBed: '加床收费200元/晚',
      pets: '不允许携带宠物',
    },
  },
  {
    id: 2,
    name: '海景度假酒店',
    nameEn: 'Seaview Resort Hotel',
    address: '海南省三亚市海棠湾88号',
    starRating: 5,
    phone: '0898-87654321',
    description: '位于海边的度假酒店，享受无敌海景。',
    images: ['https://via.placeholder.com/400x300'],
    status: 'pending',
    auditStatus: undefined,
    createTime: '2024-01-15 14:30:00',
    openingDate: '2022-03-01',
    roomTypes: [
      { id: 1, name: '海景房', price: 1588, area: 55, bedType: '大床2.0m', breakfast: true },
    ],
    nearbyAttractions: [
      { name: '蜈支洲岛', distance: '5公里', description: '潜水胜地' },
    ],
    facilities: ['免费WiFi', '游泳池', '私人海滩', 'SPA'],
  },
  {
    id: 3,
    name: '城市精品酒店',
    nameEn: 'City Boutique Hotel',
    address: '北京市朝阳区建国路50号',
    starRating: 4,
    phone: '010-55556666',
    description: '城市中心的精品酒店，交通便利。',
    images: ['https://via.placeholder.com/400x300'],
    status: 'offline',
    auditStatus: 'rejected',
    auditReason: '酒店图片不符合要求，请重新上传高清图片',
    createTime: '2024-01-10 09:00:00',
    openingDate: '2019-08-20',
    roomTypes: [
      { id: 1, name: '标准间', price: 388, area: 30, bedType: '双床1.2m' },
    ],
  },
  {
    id: 4,
    name: '商务快捷酒店',
    nameEn: 'Business Express Hotel',
    address: '广州市天河区体育西路20号',
    starRating: 3,
    phone: '020-77778888',
    description: '经济实惠的商务酒店，适合出差。',
    images: ['https://via.placeholder.com/400x300'],
    status: 'draft',
    createTime: '2024-01-20 16:00:00',
    openingDate: '2021-05-10',
    roomTypes: [
      { id: 1, name: '经济房', price: 198, area: 20, bedType: '大床1.8m' },
    ],
  },
];

const HotelListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState<Hotel[]>(mockHotels);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>(mockHotels);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [starFilter, setStarFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');
  const [auditModalVisible, setAuditModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [currentHotel, setCurrentHotel] = useState<Hotel | null>(null);
  const [auditReason, setAuditReason] = useState('');

  const user = localStorage.getItem('currentUser');
  const userData = user ? JSON.parse(user) : { role: 'merchant' };
  const isAdmin = userData.role === 'admin';

  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'add') {
      setCurrentHotel(null);
      setEditModalVisible(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    let result = [...hotels];
    
    if (statusFilter !== 'all') {
      result = result.filter(hotel => hotel.status === statusFilter);
    }

    if (starFilter !== 'all') {
      result = result.filter(hotel => hotel.starRating === Number(starFilter));
    }
    
    if (searchText) {
      result = result.filter(hotel => 
        hotel.name.includes(searchText) || 
        hotel.nameEn?.toLowerCase().includes(searchText.toLowerCase()) ||
        hotel.address.includes(searchText)
      );
    }
    
    setFilteredHotels(result);
  }, [hotels, statusFilter, starFilter, searchText]);

  const getStatusTag = (status: string, auditStatus?: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      draft: { color: 'default', text: '草稿' },
      pending: { color: 'orange', text: '审核中' },
      online: { color: 'green', text: '已上线' },
      offline: { color: 'red', text: '已下线' },
    };
    
    const auditMap: Record<string, { color: string; text: string }> = {
      passed: { color: 'green', text: '通过' },
      rejected: { color: 'red', text: '驳回' },
    };
    
    if (status === 'online' || status === 'offline') {
      return <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>;
    }
    
    if (auditStatus) {
      return <Tag color={auditMap[auditStatus].color}>{auditMap[auditStatus].text}</Tag>;
    }
    
    return <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>;
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
      await new Promise((resolve) => { setTimeout(resolve, 1000); });
      
      setHotels(prev => prev.map(h => {
        if (h.id === hotel.id) {
          return {
            ...h,
            auditStatus: passed ? 'passed' : 'rejected',
            status: passed ? 'online' : 'offline',
            auditReason: reason,
            updateTime: new Date().toLocaleString(),
          };
        }
        return h;
      }));
      
      message.success(passed ? '审核通过，酒店已上线' : '审核驳回');
      setAuditModalVisible(false);
    } catch (error) {
      message.error('操作失败，请重试');
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
      await new Promise((resolve) => { setTimeout(resolve, 1000); });
      
      setHotels(prev => prev.map(h => {
        if (h.id === hotel.id) {
          return {
            ...h,
            status: 'pending',
            updateTime: new Date().toLocaleString(),
          };
        }
        return h;
      }));
      
      message.success('已提交审核');
    } catch (error) {
      message.error('提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleOffline = async (hotel: Hotel) => {
    setLoading(true);
    try {
      await new Promise((resolve) => { setTimeout(resolve, 1000); });
      
      setHotels(prev => prev.map(h => {
        if (h.id === hotel.id) {
          return {
            ...h,
            status: 'offline',
            updateTime: new Date().toLocaleString(),
          };
        }
        return h;
      }));
      
      message.success('酒店已下线');
    } catch (error) {
      message.error('下线失败，请重试');
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
      await new Promise((resolve) => { setTimeout(resolve, 1000); });
      
      if (currentHotel?.id) {
        setHotels(prev => prev.map(h => {
          if (h.id === currentHotel.id) {
            return { ...h, ...hotelData, updateTime: new Date().toLocaleString() };
          }
          return h;
        }));
        message.success('酒店信息更新成功');
      } else {
        const newHotel: Hotel = {
          ...hotelData as Hotel,
          id: Math.max(...hotels.map(h => h.id || 0)) + 1,
          status: 'draft',
          createTime: new Date().toLocaleString(),
        };
        setHotels(prev => [...prev, newHotel]);
        message.success('酒店添加成功');
      }
      
      setEditModalVisible(false);
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (hotel: Hotel) => {
    setCurrentHotel(hotel);
    setDetailDrawerVisible(true);
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
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: Hotel) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          
          {(record.status === 'draft' || record.status === 'offline' || record.auditStatus === 'rejected') && (
            <Button 
              type="link" 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
          )}
          
          {isAdmin && record.status === 'pending' && (
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
          
          {!isAdmin && record.status === 'draft' && (
            <Button 
              type="link" 
              size="small" 
              icon={<UploadOutlined />}
              onClick={() => handlePublish(record)}
            >
              提交审核
            </Button>
          )}
          
          {record.status === 'online' && (
            <Popconfirm
              title="确定要下线该酒店吗？"
              onConfirm={() => handleOffline(record)}
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
          
          {record.status === 'offline' && record.auditStatus === 'passed' && (
            <Button 
              type="link" 
              size="small" 
              icon={<UploadOutlined />}
              onClick={() => handlePublish(record)}
            >
              重新上线
            </Button>
          )}
        </Space>
      ),
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
                  <Card key={room.id || index} size="small" style={{ marginBottom: 12 }}>
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
                    key={discount.id || index} 
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
            共 {filteredHotels.length} 家酒店
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
        <Search
          placeholder="搜索酒店名称、英文名或地址"
          allowClear
          style={{ width: 320 }}
          onSearch={setSearchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Select
          defaultValue="all"
          style={{ width: 140 }}
          onChange={setStatusFilter}
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
          onChange={setStarFilter}
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
          dataSource={filteredHotels}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1300 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
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
