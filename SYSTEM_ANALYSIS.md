# 酒店管理系统核心分析文档

## 1. 组件关系 (Component Relationships)

### 1.1 用户登录/注册 (User Login/Register)
- **Login (`src/pages/Login`)**
  - `LoginPage` (核心容器)
    - `Card` (布局容器)
    - `Form` (登录表单)
      - `Input` / `Input.Password`
      - `Button` (提交)
    - `Alert` (错误提示)
- **Register (`src/pages/Register`)**
  - `RegisterPage` (核心容器)
    - `Card` (布局容器)
    - `Form` (注册表单)
      - `Input` / `Input.Password`
      - `Button` (提交)
    - `Alert` (错误提示)

### 1.2 酒店信息管理 (Hotel Management)
- **HotelList (`src/pages/Hotel/List`)**
  - `HotelListPage` (核心容器，列表/管理页)
    - `Table` (核心展示组件)
      - Columns: 信息, 价格, 状态, 操作
    - `HotelEditModal` (子组件，新增/编辑)
      - `Form` (数据录入)
      - `Tabs` (分模块录入: 基本信息, 房型, 周边, 优惠, 政策)
      - `Upload` (图片上传)
      - `Form.List` (动态列表: 房型, 景点等)
    - `Drawer` (子组件，详情查看)
      - `Descriptions` (信息展示)
      - `Tabs` (分模块展示)
    - `Modal` (子组件，审核驳回)
      - `Input.TextArea` (驳回原因)
    - `Popconfirm` (操作确认)

## 2. 状态关系 (State Relationships)

### 2.1 全局/通用状态
- **用户会话 (User Session)**
  - **核心状态**: `currentUser` (包含 token, role, id)
  - **来源**: `localStorage`
  - **更新方式**: 登录/注册成功后写入，退出登录时清除。

### 2.2 登录/注册页面
- **UI 状态**
  - `loading` (boolean): 控制提交按钮加载状态。
  - `error` (string): 错误提示信息。
  - **更新方式**: `useState` 管理，API 请求前后更新。

### 2.3 酒店列表/管理页面 (`HotelListPage`)
- **核心数据状态**
  - `hotels` (Array): 酒店列表数据。
    - **来源**: 后端 API (`hotelApi.getList`)
    - **更新方式**: 页面加载、筛选变动、分页变动、操作成功后重新拉取。
  - `currentHotel` (Object | null): 当前操作的酒店对象。
    - **来源**: 用户点击列表项（编辑/详情/审核）。
    - **更新方式**: `useState` 管理。

- **交互控制状态**
  - `editModalVisible` (boolean): 编辑/新增弹窗显隐。
  - `auditModalVisible` (boolean): 审核驳回弹窗显隐。
  - `detailDrawerVisible` (boolean): 详情抽屉显隐。
  - `auditReason` (string): 审核驳回原因。
  - **更新方式**: `useState` 管理，用户交互触发。

- **筛选与分页状态**
  - `pagination` (Object): `{ current, pageSize, total }`
  - `searchText` (string): 搜索关键词
  - `statusFilter` (string): 状态筛选 (all/draft/pending/online/offline)
  - `starFilter` (string): 星级筛选
  - **更新方式**: `useState` 管理，组件 onChange 事件触发，并作为 `useEffect` 依赖触发数据刷新。

## 3. 路由关系 (Route Relationships)

| 路由路径 (Path) | 对应页面/组件 | 权限要求 (Permissions) | 跳转/拦截规则 (Rules) |
| :--- | :--- | :--- | :--- |
| `/login` | `src/pages/Login` | 公开 | 无特殊拦截。 |
| `/register` | `src/pages/Register` | 公开 | 无特殊拦截。 |
| `/` | `src/layouts/AuthWrapper` | **受保护** (需登录) | 1. 检查 `localStorage` 是否存在 `currentUser`。<br>2. 若不存在或 Token 无效，强制重定向至 `/login`。<br>3. 若验证通过，渲染子路由。 |
| `/` (子路由) | `src/layouts/BasicLayout` | 受保护 | 提供通用布局（导航、侧边栏）。 |
| `/` (根路径) | Redirect | - | 自动重定向至 `/hotel/list`。 |
| `/hotel/list` | `src/pages/Hotel/List` | 受保护 | **页面级角色控制**: <br>- **Admin**: 可见“通过/驳回”按钮。<br>- **Merchant**: 可见“编辑/提交审核/下线”按钮。 |
| `*` | Redirect | - | 所有未匹配路径均重定向至 `/login`。 |
