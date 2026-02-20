import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  Upload, 
  Button, 
  Tabs, 
  Row, 
  Col, 
  DatePicker,
  Space,
  Divider,
  Tag,
  message
} from 'antd';
import { 
  PlusOutlined, 
  MinusCircleOutlined, 
  EnvironmentOutlined,
  CarOutlined,
  ShopOutlined,
  PercentageOutlined,
  StarFilled
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import dayjs from 'dayjs';
import { uploadApi } from '../../../utils/api';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface HotelEditModalProps {
  visible: boolean;
  hotel?: Hotel | null;
  onCancel: () => void;
  onOk: (hotel: Partial<Hotel>) => void;
  loading?: boolean;
}

const HotelEditModal: React.FC<HotelEditModalProps> = ({
  visible,
  hotel,
  onCancel,
  onOk,
  loading = false
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [activeTab, setActiveTab] = useState('basic');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (visible && hotel) {
      form.setFieldsValue({
        ...hotel,
        openingDate: hotel.openingDate ? dayjs(hotel.openingDate) : undefined,
      });
      if (hotel.images?.length) {
        setFileList(hotel.images.map((url, index) => ({
          uid: `-${index}`,
          name: `image-${index}`,
          status: 'done',
          url,
        })));
      }
    } else if (visible) {
      form.resetFields();
      form.setFieldsValue({
        starRating: 3,
        roomTypes: [{ name: '', price: 0 }],
        facilities: [],
      });
      setFileList([]);
    }
  }, [visible, hotel, form]);

  const handleUploadChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
    const updatedList: UploadFile[] = [];
    
    for (const file of newFileList) {
      if (file.status === 'uploading') {
        updatedList.push(file);
      } else if (file.originFileObj && !file.url) {
        try {
          setUploading(true);
          const result = await uploadApi.uploadSingle(file.originFileObj);
          updatedList.push({
            ...file,
            status: 'done',
            url: `http://localhost:3001${result.url}`,
          } as UploadFile);
        } catch (error) {
          // 上传失败，不添加到列表
        }
      } else if (file.status === 'done') {
        updatedList.push(file);
      }
    }
    
    setUploading(false);
    setFileList(updatedList);
  };

  const uploadProps: UploadProps = {
    fileList,
    onChange: handleUploadChange,
    beforeUpload: () => false,
    listType: 'picture-card',
    maxCount: 10,
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const hotelData: Partial<Hotel> = {
        ...values,
        openingDate: values.openingDate?.format('YYYY-MM-DD'),
        images: fileList
          .filter(file => file.status === 'done')
          .map(file => file.url || ''),
      };
      onOk(hotelData);
    } catch (error) {
      message.error('请填写必填项');
    }
  };

  const renderStarRating = (value: number) => (
    <span>
      {Array.from({ length: value }).map((_, i) => (
        <StarFilled key={i} style={{ color: '#faad14', marginRight: 2 }} />
      ))}
    </span>
  );

  return (
    <Modal
      title={hotel?._id ? '编辑酒店信息' : '新增酒店'}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading || uploading}
      width={900}
      destroyOnClose
      okText="保存"
      cancelText="取消"
      bodyStyle={{ padding: '12px 24px' }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          starRating: 3,
          roomTypes: [{ name: '', price: 0 }],
        }}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="基本信息" key="basic">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="酒店名称（中文）"
                  rules={[{ required: true, message: '请输入酒店中文名称' }]}
                >
                  <Input placeholder="请输入酒店中文名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="nameEn"
                  label="酒店名称（英文）"
                >
                  <Input placeholder="请输入酒店英文名称" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="starRating"
                  label="酒店星级"
                  rules={[{ required: true, message: '请选择酒店星级' }]}
                >
                  <Select placeholder="请选择酒店星级">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Option key={star} value={star}>
                        {renderStarRating(star)}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="openingDate"
                  label="开业时间"
                >
                  <DatePicker style={{ width: '100%' }} placeholder="请选择开业时间" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="联系电话"
                  rules={[
                    { required: true, message: '请输入联系电话' },
                    { pattern: /^[\d\-+]+$/, message: '请输入正确的电话号码' }
                  ]}
                >
                  <Input placeholder="请输入联系电话" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="address"
                  label="酒店地址"
                  rules={[{ required: true, message: '请输入酒店地址' }]}
                >
                  <Input placeholder="请输入酒店详细地址" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label="酒店描述"
              rules={[{ required: true, message: '请输入酒店描述' }]}
            >
              <TextArea 
                rows={3} 
                placeholder="请输入酒店详细描述，包括设施、服务等"
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Form.Item label="酒店图片" required>
              <Upload {...uploadProps}>
                {fileList.length < 10 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>上传图片</div>
                  </div>
                )}
              </Upload>
              <div style={{ color: '#8c8c8c', fontSize: 12, marginTop: 8 }}>
                最多上传10张图片，支持 jpg、png 格式
              </div>
            </Form.Item>

            <Form.Item name="facilities" label="酒店设施">
              <Select
                mode="multiple"
                placeholder="请选择酒店设施"
                style={{ width: '100%' }}
              >
                {['免费WiFi', '游泳池', '健身房', '停车场', '餐厅', '会议室', 'SPA', '洗衣服务', '接机服务', '儿童乐园'].map(f => (
                  <Option key={f} value={f}>{f}</Option>
                ))}
              </Select>
            </Form.Item>
          </TabPane>

          <TabPane tab="房型信息" key="rooms">
            <Form.List name="roomTypes">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} style={{ 
                      marginBottom: 16, 
                      padding: 16, 
                      background: '#fafafa', 
                      borderRadius: 8,
                      position: 'relative'
                    }}>
                      {fields.length > 1 && (
                        <MinusCircleOutlined
                          style={{ position: 'absolute', top: 8, right: 8, color: '#ff4d4f' }}
                          onClick={() => remove(name)}
                        />
                      )}
                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'name']}
                            label="房型名称"
                            rules={[{ required: true, message: '请输入房型名称' }]}
                          >
                            <Input placeholder="如：大床房、双床房" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'price']}
                            label="价格（元/晚）"
                            rules={[{ required: true, message: '请输入价格' }]}
                          >
                            <InputNumber min={0} style={{ width: '100%' }} placeholder="当前价格" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'originalPrice']}
                            label="原价（元/晚）"
                          >
                            <InputNumber min={0} style={{ width: '100%' }} placeholder="原价（可选）" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'area']}
                            label="房间面积（㎡）"
                          >
                            <InputNumber min={0} style={{ width: '100%' }} placeholder="房间面积" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'bedType']}
                            label="床型"
                          >
                            <Select placeholder="请选择床型" allowClear>
                              <Option value="大床1.8m">大床1.8m</Option>
                              <Option value="大床2.0m">大床2.0m</Option>
                              <Option value="双床1.2m">双床1.2m</Option>
                              <Option value="双床1.35m">双床1.35m</Option>
                              <Option value="单人床1.2m">单人床1.2m</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'maxOccupancy']}
                            label="最大入住人数"
                          >
                            <InputNumber min={1} max={10} style={{ width: '100%' }} placeholder="人数" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item
                        {...restField}
                        name={[name, 'breakfast']}
                        label="含早餐"
                      >
                        <Select placeholder="是否含早餐" allowClear style={{ width: 200 }}>
                          <Option value={true}>含早餐</Option>
                          <Option value={false}>不含早餐</Option>
                        </Select>
                      </Form.Item>
                    </div>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    添加房型
                  </Button>
                </>
              )}
            </Form.List>
          </TabPane>

          <TabPane tab="周边信息" key="nearby">
            <Divider orientation="left">
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <EnvironmentOutlined style={{ color: '#1890ff' }} />
                附近热门景点
              </span>
            </Divider>
            <Form.List name="nearbyAttractions">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row key={key} gutter={16} style={{ marginBottom: 8 }}>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'name']}
                          rules={[{ required: true, message: '请输入景点名称' }]}
                        >
                          <Input placeholder="景点名称" />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'distance']}
                        >
                          <Input placeholder="距离（如：500米）" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'description']}
                        >
                          <Input placeholder="简短描述" />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <MinusCircleOutlined 
                          style={{ color: '#ff4d4f', marginTop: 8 }} 
                          onClick={() => remove(name)} 
                        />
                      </Col>
                    </Row>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    添加景点
                  </Button>
                </>
              )}
            </Form.List>

            <Divider orientation="left">
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CarOutlined style={{ color: '#52c41a' }} />
                交通信息
              </span>
            </Divider>
            <Form.List name="transportations">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row key={key} gutter={16} style={{ marginBottom: 8 }}>
                      <Col span={5}>
                        <Form.Item
                          {...restField}
                          name={[name, 'type']}
                          rules={[{ required: true, message: '请选择类型' }]}
                        >
                          <Select placeholder="交通类型">
                            <Option value="subway">地铁</Option>
                            <Option value="bus">公交</Option>
                            <Option value="airport">机场</Option>
                            <Option value="train">火车站</Option>
                            <Option value="other">其他</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={7}>
                        <Form.Item
                          {...restField}
                          name={[name, 'name']}
                          rules={[{ required: true, message: '请输入名称' }]}
                        >
                          <Input placeholder="站点/线路名称" />
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        <Form.Item
                          {...restField}
                          name={[name, 'distance']}
                        >
                          <Input placeholder="距离" />
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        <Form.Item
                          {...restField}
                          name={[name, 'description']}
                        >
                          <Input placeholder="备注" />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <MinusCircleOutlined 
                          style={{ color: '#ff4d4f', marginTop: 8 }} 
                          onClick={() => remove(name)} 
                        />
                      </Col>
                    </Row>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    添加交通信息
                  </Button>
                </>
              )}
            </Form.List>

            <Divider orientation="left">
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShopOutlined style={{ color: '#722ed1' }} />
                周边商场
              </span>
            </Divider>
            <Form.List name="shoppingMalls">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row key={key} gutter={16} style={{ marginBottom: 8 }}>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'name']}
                          rules={[{ required: true, message: '请输入商场名称' }]}
                        >
                          <Input placeholder="商场名称" />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'distance']}
                        >
                          <Input placeholder="距离" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'description']}
                        >
                          <Input placeholder="简短描述" />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <MinusCircleOutlined 
                          style={{ color: '#ff4d4f', marginTop: 8 }} 
                          onClick={() => remove(name)} 
                        />
                      </Col>
                    </Row>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    添加商场
                  </Button>
                </>
              )}
            </Form.List>
          </TabPane>

          <TabPane tab="优惠活动" key="discounts">
            <Form.List name="discounts">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} style={{ 
                      marginBottom: 16, 
                      padding: 16, 
                      background: '#fff7e6', 
                      borderRadius: 8,
                      border: '1px solid #ffd591',
                      position: 'relative'
                    }}>
                      <div style={{ position: 'absolute', top: 8, right: 8 }}>
                        <Tag color="orange">
                          <PercentageOutlined /> 优惠活动
                        </Tag>
                        {fields.length > 1 && (
                          <MinusCircleOutlined
                            style={{ marginLeft: 8, color: '#ff4d4f' }}
                            onClick={() => remove(name)}
                          />
                        )}
                      </div>
                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'name']}
                            label="活动名称"
                            rules={[{ required: true, message: '请输入活动名称' }]}
                          >
                            <Input placeholder="如：新用户立减" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'type']}
                            label="优惠类型"
                            rules={[{ required: true, message: '请选择优惠类型' }]}
                          >
                            <Select placeholder="请选择">
                              <Option value="percentage">折扣</Option>
                              <Option value="fixed">立减</Option>
                              <Option value="special">特价</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'value']}
                            label="优惠值"
                            rules={[{ required: true, message: '请输入优惠值' }]}
                          >
                            <InputNumber 
                              min={0} 
                              style={{ width: '100%' }} 
                              placeholder="折扣填数字如85表示85折"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'startDate']}
                            label="开始日期"
                          >
                            <Input placeholder="如：2024-01-01" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'endDate']}
                            label="结束日期"
                          >
                            <Input placeholder="如：2024-12-31" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'conditions']}
                            label="使用条件"
                          >
                            <Input placeholder="如：满500可用" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item
                        {...restField}
                        name={[name, 'description']}
                        label="活动说明"
                      >
                        <TextArea rows={2} placeholder="详细活动说明" />
                      </Form.Item>
                    </div>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    添加优惠活动
                  </Button>
                </>
              )}
            </Form.List>
          </TabPane>

          <TabPane tab="入住政策" key="policies">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name={['policies', 'checkIn']}
                  label="入住时间"
                >
                  <Input placeholder="如：14:00后" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={['policies', 'checkOut']}
                  label="退房时间"
                >
                  <Input placeholder="如：12:00前" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name={['policies', 'cancellation']}
                  label="取消政策"
                >
                  <TextArea rows={2} placeholder="如：入住前1天可免费取消" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={['policies', 'extraBed']}
                  label="加床政策"
                >
                  <TextArea rows={2} placeholder="如：加床收费100元/晚" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name={['policies', 'pets']}
              label="宠物政策"
            >
              <TextArea rows={2} placeholder="如：允许携带小型宠物" />
            </Form.Item>
          </TabPane>
        </Tabs>
      </Form>
    </Modal>
  );
};

export default HotelEditModal;
