# 数据库扩充方案 (Database Expansion Plan)

## 1. 概述 (Overview)

各位同学好，

为了支持本次新增的超级管理员（Super Admin）功能，并为后续项目交接及远程数据库迁移做准备，特此梳理本数据库扩充方案。本项目目前基于本地 MongoDB 数据库开发，但考虑到各位同学已部署远程数据库环境，本方案旨在说明现有数据结构的变更点、数据初始化流程以及如何平滑接入远程数据库。

## 2. 现状与架构 (Current Status & Architecture)

-   **数据库技术**: MongoDB
-   **ORM 框架**: Mongoose
-   **当前连接**: 本地开发环境默认使用 `mongodb://localhost:27017/hotel_management`。

## 3. Schema 变更与扩充 (Schema Changes & Expansion)

基于 `d:\Hotel_Management_System\.trae\specs\super-admin-implementation` 的需求，我们在 `User` 模型中进行了以下关键扩展，请各位同学在对接远程数据库时留意：

### 3.1 用户模型 (User Model)

文件路径: `server/src/models/User.ts`

我们扩展了 `User` Schema 以支持更细粒度的权限控制和账户状态管理：

-   **角色字段 (`role`)**:
    -   新增枚举值: `'super_admin'`
    -   完整枚举: `['merchant', 'admin', 'super_admin']`
    -   **用途**: 区分普通商户、普通管理员和超级管理员。超级管理员拥有最高权限，包括管理其他管理员账户。

-   **状态字段 (`status`)**:
    -   新增字段: `status`
    -   枚举值: `['active', 'suspended']`
    -   默认值: `'active'`
    -   **用途**: 用于账户生命周期管理。`suspended` 状态的用户将被禁止登录系统，适用于违规处理或离职交接场景。

### 3.2 酒店模型 (Hotel Model)

文件路径: `server/src/models/Hotel.ts`

酒店模型保持原有的丰富结构（包含房型、周边、设施等），未做破坏性变更，兼容现有数据。

## 4. 数据初始化与迁移 (Data Initialization & Migration)

为了方便各位同学快速搭建可用环境，我们提供了数据播种脚本 `server/src/seed.ts`。

### 4.1 初始化逻辑
脚本会自动检测并执行以下操作：
1.  **超级管理员账户**:
    -   检查是否存在用户名为 `admin` 的账户。
    -   若不存在，创建默认超级管理员：`admin / admin123`，角色为 `super_admin`，状态为 `active`。
    -   若存在，**自动更新**其角色为 `super_admin` 并激活状态，确保现有开发环境无缝升级。
2.  **商户账户**:
    -   创建测试商户 `merchant`, `merchant2`, `merchant3` (密码均为 `merchant123`)。
3.  **酒店数据**:
    -   如果数据库中没有酒店数据，将自动导入演示用的酒店数据并分配给上述商户。

### 4.2 执行方式
在 `server` 目录下执行：
```bash
npm run seed
# 或者
npx ts-node src/seed.ts
```

## 5. 远程数据库接入指南 (Remote Database Connection Guide)

为了方便项目交接和统一维护，建议各位同学将本地服务连接至统一的远程数据库。

### 5.1 配置步骤
1.  在 `server` 目录下找到或创建 `.env` 文件。
2.  配置 `MONGODB_URI` 环境变量。

**示例配置 (.env):**
```env
# 请替换为各位同学实际的远程数据库连接字符串
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-address>.mongodb.net/hotel_management?retryWrites=true&w=majority

# 其他配置保持不变
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
```

### 5.2 验证连接
启动服务后，控制台应输出：
```
✅ MongoDB 连接成功
```
若连接失败，请检查：
-   远程数据库的 IP 白名单是否已包含当前开发机 IP。
-   用户名密码是否正确。
-   网络连接是否通畅。

## 6. 安全与协作规范 (Security & Best Practices)

-   **敏感信息**: 请勿将包含真实生产环境密码的 `.env` 文件提交到代码仓库（`.gitignore` 已配置忽略）。
-   **数据备份**: 在进行重大 Schema 变更前，建议对远程数据库进行备份。
-   **文档同步**: 若后续有新增字段，请同步更新本方案或相关 API 文档，保持信息一致。

感谢各位同学的配合，如有疑问请随时沟通。
