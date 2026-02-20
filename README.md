# 酒店后台管理系统

基于 Umi + React + Ant Design 的酒店后台管理系统，提供完整的酒店信息管理、审核流程和权限控制功能。

## 技术栈

### 前端

- **框架**: Umi 4
- **UI 组件库**: Ant Design 5
- **语言**: TypeScript
- **日期处理**: Day.js
- **代码规范**: ESLint + Prettier

### 后端

- **运行时**: Node.js
- **框架**: Express
- **数据库**: MongoDB
- **OD**: Mongoose
- **认证**: JWT
- **语言**: TypeScript

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

### 3. 权限隔离

| 角色   | 权限                                   |
| ------ | -------------------------------------- |
| 商户   | 酒店列表、酒店录入、提交审核、编辑草稿 |
| 管理员 | 酒店列表、酒店录入、审核通过/驳回      |

## 项目结构

```
Hotel_Management_System/
├── src/                          # 前端源码
│   ├── layouts/
│   │   └── BasicLayout/          # 主布局组件
│   ├── pages/
│   │   ├── Login/                # 登录页面
│   │   ├── Register/             # 注册页面
│   │   └── Hotel/                # 酒店管理
│   │       ├── components/
│   │       │   └── HotelEditModal.tsx
│   │       └── List/
│   ├── utils/
│   │   └── api.ts                # API请求封装
│   └── global.less
├── server/                       # 后端源码
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts       # 数据库配置
│   │   ├── controllers/
│   │   │   ├── authController.ts # 认证控制器
│   │   │   ├── hotelController.ts# 酒店控制器
│   │   │   └── uploadController.ts
│   │   ├── middlewares/
│   │   │   ├── auth.ts           # JWT认证中间件
│   │   │   └── error.ts          # 错误处理
│   │   ├── models/
│   │   │   ├── User.ts           # 用户模型
│   │   │   └── Hotel.ts          # 酒店模型
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── hotelRoutes.ts
│   │   │   └── uploadRoutes.ts
│   │   ├── utils/
│   │   │   ├── response.ts
│   │   │   └── upload.ts
│   │   ├── server.ts             # 服务入口
│   │   └── seed.ts               # 数据库初始化
│   ├── uploads/                  # 上传文件目录
│   ├── package.json
│   └── tsconfig.json
├── typings.d.ts
├── package.json
└── README.md
```

## 快速开始

### 环境要求

- Node.js >= 16.x
- npm >= 8.x
- MongoDB >= 5.0

### 安装 MongoDB

#### Windows

1. 下载 MongoDB Community Server: https://www.mongodb.com/try/download/community
2. 运行安装程序，选择完整安装
3. 安装完成后，MongoDB 会自动作为 Windows 服务运行

#### macOS

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu)

```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
```

### 安装依赖

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server
npm install
```

### 启动服务

#### 1. 启动 MongoDB（如果未作为服务运行）

```bash
mongod --dbpath /path/to/data/directory
```

#### 2. 初始化数据库（首次运行）

```bash
cd server
npm run seed
```

这会创建：

- 管理员账户: `admin` / `admin123`
- 商户账户: `merchant` / `merchant123`
- 示例酒店数据

#### 3. 启动后端服务

```bash
cd server
npm run dev
```

后端服务运行在 http://localhost:3001

#### 4. 启动前端服务（新终端）

```bash
npm start
```

前端服务运行在 http://localhost:8001

### 测试账户

| 角色   | 用户名   | 密码        |
| ------ | -------- | ----------- |
| 管理员 | admin    | admin123    |
| 商户   | merchant | merchant123 |

## API 接口文档

### 认证接口

| 方法 | 路径               | 说明         |
| ---- | ------------------ | ------------ |
| POST | /api/auth/register | 用户注册     |
| POST | /api/auth/login    | 用户登录     |
| GET  | /api/auth/profile  | 获取用户信息 |
| PUT  | /api/auth/profile  | 更新用户名   |
| PUT  | /api/auth/password | 修改密码     |

### 酒店接口

| 方法   | 路径                   | 说明             |
| ------ | ---------------------- | ---------------- |
| GET    | /api/hotels            | 获取酒店列表     |
| GET    | /api/hotels/stats      | 获取酒店统计     |
| GET    | /api/hotels/:id        | 获取酒店详情     |
| POST   | /api/hotels            | 创建酒店         |
| PUT    | /api/hotels/:id        | 更新酒店         |
| DELETE | /api/hotels/:id        | 删除酒店         |
| PUT    | /api/hotels/:id/submit | 提交审核         |
| PUT    | /api/hotels/:id/audit  | 审核酒店(管理员) |
| PUT    | /api/hotels/:id/toggle | 上线/下线        |

### 上传接口

| 方法 | 路径                 | 说明     |
| ---- | -------------------- | -------- |
| POST | /api/upload/single   | 单图上传 |
| POST | /api/upload/multiple | 多图上传 |

## 数据模型

### User 用户模型

```typescript
interface User {
  _id: string;
  username: string;
  password: string; // 加密存储
  role: 'merchant' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
```

### Hotel 酒店模型

```typescript
interface Hotel {
  _id: string;
  name: string;
  nameEn?: string;
  address: string;
  starRating: 1 | 2 | 3 | 4 | 5;
  phone: string;
  description: string;
  images: string[];
  status: 'draft' | 'pending' | 'online' | 'offline';
  auditStatus?: 'passed' | 'rejected';
  auditReason?: string;
  roomTypes: RoomType[];
  openingDate?: string;
  nearbyAttractions: NearbyAttraction[];
  transportations: Transportation[];
  shoppingMalls: ShoppingMall[];
  discounts: Discount[];
  facilities: string[];
  policies: Policies;
  creator: string; // 用户ID
  createdAt: Date;
  updatedAt: Date;
}
```

## 为什么选择 MongoDB？

酒店数据具有以下特点，非常适合 MongoDB：

1. **嵌套数据结构**: 房型、景点、交通、优惠等数据天然嵌套
2. **Schema灵活**: 字段可能随业务变化，无需频繁迁移
3. **查询高效**: 单文档查询即可获取完整酒店信息
4. **开发效率高**: 与前端JSON格式一致，无需ORM转换

## 生产部署

### 后端构建

```bash
cd server
npm run build
npm start
```

### 前端构建

```bash
npm run build
```

构建产物在 `dist` 目录，可部署到任意静态服务器。

### 环境变量配置

生产环境需要修改 `server/.env`:

```env
PORT=3001
MONGODB_URI=mongodb://your-mongodb-host:27017/hotel_management
JWT_SECRET=your-production-secret-key
JWT_EXPIRES_IN=7d
```

### 注意事项

1. 生产环境务必修改 JWT_SECRET
2. 建议使用 HTTPS
3. MongoDB 建议配置认证
4. 建议使用 PM2 管理 Node 进程

## 常见问题

### Q: MongoDB 连接失败？

A: 检查 MongoDB 服务是否启动，端口是否正确（默认 27017）

### Q: 登录后提示未授权？

A: 检查 JWT_SECRET 配置是否一致，清除 localStorage 重新登录

### Q: 图片上传失败？

A: 检查 server/uploads 目录是否存在，是否有写入权限

## License

MIT
