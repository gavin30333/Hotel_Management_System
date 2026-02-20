# 酒店后台管理系统

基于 Umi + React + Ant Design 的酒店后台管理系统，提供完整的酒店信息管理、审核流程和权限控制功能。

## 技术栈

- **框架**: Umi 4
- **UI 组件库**: Ant Design 5
- **语言**: TypeScript
- **日期处理**: Day.js
- **代码规范**: ESLint + Prettier

## 功能模块

### 1. 用户认证

- 用户登录/注册
- 支持商户和管理员两种角色
- 个人中心（修改用户名、修改密码）
- 系统设置（通知偏好）

### 2. 酒店管理

#### 酒店数据维度

| 字段             | 说明                                 | 必填 |
| ---------------- | ------------------------------------ | ---- |
| 酒店名称（中文） | 酒店中文名称                         | ✓    |
| 酒店名称（英文） | 酒店英文名称                         |      |
| 酒店地址         | 详细地址                             | ✓    |
| 酒店星级         | 1-5星                                | ✓    |
| 酒店房型         | 支持多种房型，包含价格、面积、床型等 | ✓    |
| 酒店价格         | 根据房型自动计算价格区间             | ✓    |
| 开业时间         | 酒店开业日期                         |      |
| 附近热门景点     | 景点名称、距离、描述                 |      |
| 交通信息         | 地铁/公交/机场/火车站等              |      |
| 周边商场         | 商场名称、距离、描述                 |      |
| 优惠活动         | 折扣/立减/特价活动                   |      |
| 酒店设施         | WiFi、游泳池、健身房等               |      |
| 入住政策         | 入住/退房时间、取消政策等            |      |

#### 功能特性

- **酒店录入**: 点击侧边栏「酒店录入」或列表页「新增酒店」按钮，弹出编辑弹窗
- **酒店编辑**: 点击「编辑」按钮，在弹窗中修改酒店信息
- **酒店详情**: 抽屉式详情展示，包含完整酒店信息
- **审核流程**: 管理员可审核待审核状态的酒店（通过/驳回）
- **上下线管理**: 支持酒店上线和下线操作
- **草稿保存**: 支持保存草稿，后续继续编辑

### 3. 权限隔离

| 角色   | 权限                                   |
| ------ | -------------------------------------- |
| 商户   | 酒店列表、酒店录入、提交审核、编辑草稿 |
| 管理员 | 酒店列表、酒店录入、审核通过/驳回      |

## 项目结构

```
Hotel_Management_System/
├── src/
│   ├── layouts/
│   │   └── BasicLayout/        # 主布局组件
│   ├── pages/
│   │   ├── Login/              # 登录页面
│   │   ├── Register/           # 注册页面
│   │   └── Hotel/              # 酒店管理
│   │       ├── components/
│   │       │   └── HotelEditModal.tsx  # 酒店编辑弹窗
│   │       └── List/           # 酒店列表页面
│   ├── global.less             # 全局样式
│   └── app.tsx                 # 应用入口
├── typings.d.ts                # 类型定义
├── package.json
├── tsconfig.json
├── .umirc.ts                   # 路由配置
├── .eslintrc.js
└── .prettierrc
```

## 快速开始

### 环境要求

- Node.js >= 16.x
- npm >= 8.x

### 安装依赖

```bash
npm install
```

### 启动开发服务

```bash
npm start
```

访问 http://localhost:8001

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

### 代码格式化

```bash
npm run format
```

## 数据模型

### Hotel 酒店模型

```typescript
interface Hotel {
  id?: number;
  name: string; // 酒店中文名称
  nameEn?: string; // 酒店英文名称
  address: string; // 酒店地址
  starRating: 1 | 2 | 3 | 4 | 5; // 酒店星级
  phone: string; // 联系电话
  description: string; // 酒店描述
  images: string[]; // 酒店图片
  status: 'draft' | 'pending' | 'online' | 'offline'; // 状态
  auditStatus?: 'passed' | 'rejected'; // 审核状态
  auditReason?: string; // 驳回原因
  roomTypes?: RoomType[]; // 房型列表
  openingDate?: string; // 开业时间
  nearbyAttractions?: NearbyAttraction[]; // 附近景点
  transportations?: Transportation[]; // 交通信息
  shoppingMalls?: ShoppingMall[]; // 周边商场
  discounts?: Discount[]; // 优惠活动
  facilities?: string[]; // 酒店设施
  policies?: {
    // 入住政策
    checkIn?: string;
    checkOut?: string;
    cancellation?: string;
    extraBed?: string;
    pets?: string;
  };
  createTime?: string;
  updateTime?: string;
}
```

## 页面说明

### 登录页面

支持商户/管理员角色选择

### 酒店列表页面

- 支持状态筛选、星级筛选、关键词搜索
- 表格展示酒店基本信息、价格区间、状态
- 操作按钮根据权限和状态动态显示
- 点击「酒店录入」菜单或「新增酒店」按钮弹出新增弹窗

### 酒店编辑弹窗

- 基本信息：名称、星级、地址、描述、图片等
- 房型信息：支持动态添加多种房型
- 周边信息：景点、交通、商场
- 优惠活动：折扣、立减、特价
- 入住政策：入住/退房时间等

### 酒店详情抽屉

- 多Tab展示完整酒店信息
- 图片预览
- 房型价格展示

## 开发说明

### 路由配置

路由配置在 `.umirc.ts` 文件中：

```typescript
routes: [
  { path: '/login', component: './Login' },
  { path: '/register', component: './Register' },
  {
    path: '/',
    component: '@/layouts/BasicLayout',
    routes: [
      { path: '/', redirect: '/hotel/list' },
      { path: '/hotel/list', component: './Hotel/List' },
    ],
  },
];
```

### 主题色

项目使用 Ant Design 默认主题色 `#1677ff`

### Mock 数据

当前使用 Mock 数据模拟后端接口，实际项目中需替换为真实 API 调用。

## License

MIT
